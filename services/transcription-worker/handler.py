"""
Runpod Serverless Handler — Whisper + Diarisation

Input (option A — direct audio URL):
  {
    "input": {
      "audio_url": "https://...",        # URL du fichier audio (S3 ou direct)
      "job_id": "abc123",                # ID unique du job
      "language": "fr",                  # Optionnel, default "fr"
      "model_size": "large-v3",          # Optionnel, default "large-v3"
      "compute_type": "int8"             # Optionnel, default "int8"
    }
  }

Input (option B — YouTube video ID, downloaded via yt-dlp):
  {
    "input": {
      "youtube_video_id": "dQw4w9WgXcQ", # ID de la video YouTube
      "job_id": "abc123",
      "language": "fr"
    }
  }

Output:
  {
    "job_id": "abc123",
    "duration_seconds": 3612.5,
    "language": "fr",
    "segments": [
      {
        "start": 0.0,
        "end": 4.52,
        "text": "Bonjour et bienvenue...",
        "speaker": "SPEAKER_00",
        "words": [
          {"word": "Bonjour", "start": 0.0, "end": 0.45},
          ...
        ]
      },
      ...
    ],
    "speakers": ["SPEAKER_00", "SPEAKER_01", ...],
    "processing_time_seconds": 42.3
  }
"""

import os
import time
import tempfile
import subprocess
import logging
import functools
import inspect
import requests
import torch
import numpy as np

# ---------------------------------------------------------------------------
# Patch huggingface_hub to support use_auth_token → token migration
# pyannote.audio 3.x uses use_auth_token which was removed in hf_hub >= 0.24
# ---------------------------------------------------------------------------
import huggingface_hub
_original_hf_hub_download = huggingface_hub.hf_hub_download

@functools.wraps(_original_hf_hub_download)
def _patched_hf_hub_download(*args, **kwargs):
    if "use_auth_token" in kwargs:
        kwargs["token"] = kwargs.pop("use_auth_token")
    return _original_hf_hub_download(*args, **kwargs)

huggingface_hub.hf_hub_download = _patched_hf_hub_download

# Also patch hf_hub_download in the file_download module
if hasattr(huggingface_hub, 'file_download'):
    huggingface_hub.file_download.hf_hub_download = _patched_hf_hub_download

from faster_whisper import WhisperModel
from pyannote.audio import Pipeline as DiarizationPipeline

import runpod

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("transcription-worker")

# ---------------------------------------------------------------------------
# Global models (loaded once, reused across requests)
# ---------------------------------------------------------------------------
WHISPER_MODEL = None
DIARIZATION_PIPELINE = None
_YTDLP_UPDATED = False


def load_models(model_size: str = "large-v3", compute_type: str = "int8"):
    """Load Whisper + pyannote models into GPU memory (cold start)."""
    global WHISPER_MODEL, DIARIZATION_PIPELINE

    if WHISPER_MODEL is None:
        log.info(f"Loading faster-whisper {model_size} ({compute_type})...")
        t0 = time.time()
        WHISPER_MODEL = WhisperModel(
            model_size,
            device="cuda",
            compute_type=compute_type,
        )
        log.info(f"Whisper loaded in {time.time() - t0:.1f}s")

    if DIARIZATION_PIPELINE is None:
        hf_token = os.environ.get("HF_TOKEN")
        if not hf_token:
            log.warning("HF_TOKEN not set — diarization disabled")
            return

        log.info("Loading pyannote speaker-diarization-3.1...")
        t0 = time.time()
        # Let huggingface_hub auto-detect HF_TOKEN from env
        # The monkey-patch above handles use_auth_token→token migration
        DIARIZATION_PIPELINE = DiarizationPipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=hf_token,
        )
        DIARIZATION_PIPELINE.to(torch.device("cuda"))
        log.info(f"Pyannote loaded in {time.time() - t0:.1f}s")


def download_audio(url: str, dest: str):
    """Download audio file from URL to local path."""
    log.info(f"Downloading audio from {url[:80]}...")
    t0 = time.time()
    resp = requests.get(url, stream=True, timeout=300)
    resp.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            f.write(chunk)
    size_mb = os.path.getsize(dest) / (1024 * 1024)
    log.info(f"Downloaded {size_mb:.1f} MB in {time.time() - t0:.1f}s")


def _ensure_ytdlp_updated():
    """Self-update yt-dlp to latest nightly to keep up with YouTube changes."""
    global _YTDLP_UPDATED
    if _YTDLP_UPDATED:
        return
    log.info("Updating yt-dlp to latest version...")
    try:
        result = subprocess.run(
            ["pip", "install", "--upgrade", "yt-dlp"],
            capture_output=True, text=True, timeout=120,
        )
        if result.returncode == 0:
            log.info("yt-dlp updated successfully")
        else:
            log.warning(f"yt-dlp update failed (non-critical): {result.stderr[:200]}")
    except Exception as e:
        log.warning(f"yt-dlp update error (non-critical): {e}")
    _YTDLP_UPDATED = True


def download_youtube_audio(video_id: str, dest: str):
    """Download audio from YouTube using yt-dlp and convert to WAV."""
    _ensure_ytdlp_updated()

    url = f"https://www.youtube.com/watch?v={video_id}"
    log.info(f"Downloading YouTube audio: {video_id}...")
    t0 = time.time()

    # yt-dlp: extract audio, convert to wav via ffmpeg
    cmd = [
        "yt-dlp",
        "--extract-audio",
        "--audio-format", "wav",
        "--audio-quality", "0",
        "--output", dest.replace(".wav", ".%(ext)s"),
        "--no-playlist",
        "--quiet",
        "--no-check-certificates",
        url,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    if result.returncode != 0:
        raise RuntimeError(f"yt-dlp failed: {result.stderr}")

    # Verify file exists
    if not os.path.exists(dest):
        # yt-dlp may have created the file with slightly different name
        import glob
        base = dest.rsplit(".", 1)[0]
        candidates = glob.glob(f"{base}.*")
        if candidates:
            # Rename to expected dest
            os.rename(candidates[0], dest)
        else:
            raise RuntimeError(f"yt-dlp did not produce output file at {dest}")

    size_mb = os.path.getsize(dest) / (1024 * 1024)
    log.info(f"YouTube audio downloaded in {time.time() - t0:.1f}s ({size_mb:.1f} MB)")


def transcribe(audio_path: str, language: str = "fr"):
    """Run faster-whisper transcription with word-level timestamps."""
    log.info(f"Transcribing (language={language})...")
    t0 = time.time()

    segments_raw, info = WHISPER_MODEL.transcribe(
        audio_path,
        language=language,
        beam_size=5,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters=dict(
            min_silence_duration_ms=500,
        ),
    )

    # Materialize generator
    segments = []
    for seg in segments_raw:
        words = []
        if seg.words:
            for w in seg.words:
                words.append({
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                })
        segments.append({
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg.text.strip(),
            "words": words,
        })

    duration = info.duration
    log.info(
        f"Transcription done in {time.time() - t0:.1f}s "
        f"({len(segments)} segments, {duration:.1f}s audio)"
    )
    return segments, duration


def diarize(audio_path: str):
    """Run pyannote speaker diarization."""
    if DIARIZATION_PIPELINE is None:
        log.warning("Diarization pipeline not loaded, skipping")
        return None

    log.info("Running speaker diarization...")
    t0 = time.time()
    diarization = DIARIZATION_PIPELINE(audio_path)
    log.info(f"Diarization done in {time.time() - t0:.1f}s")
    return diarization


def merge_transcript_diarization(segments: list, diarization) -> list:
    """Assign speaker labels to each transcript segment based on overlap."""
    if diarization is None:
        for seg in segments:
            seg["speaker"] = "SPEAKER_00"
        return segments

    # Build speaker timeline: list of (start, end, speaker)
    speaker_timeline = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        speaker_timeline.append((turn.start, turn.end, speaker))

    # For each transcript segment, find speaker with max overlap
    for seg in segments:
        seg_start = seg["start"]
        seg_end = seg["end"]
        best_speaker = "UNKNOWN"
        best_overlap = 0.0

        for sp_start, sp_end, speaker in speaker_timeline:
            overlap_start = max(seg_start, sp_start)
            overlap_end = min(seg_end, sp_end)
            overlap = max(0.0, overlap_end - overlap_start)

            if overlap > best_overlap:
                best_overlap = overlap
                best_speaker = speaker

        seg["speaker"] = best_speaker

    return segments


def handler(job):
    """Runpod serverless handler — main entry point."""
    t_start = time.time()

    # Parse input
    job_input = job.get("input", {})
    audio_url = job_input.get("audio_url")
    youtube_video_id = job_input.get("youtube_video_id")
    job_id = job_input.get("job_id", job.get("id", "unknown"))
    language = job_input.get("language", "fr")
    model_size = job_input.get("model_size", "large-v3")
    compute_type = job_input.get("compute_type", "int8")

    if not audio_url and not youtube_video_id:
        return {"error": "audio_url or youtube_video_id is required"}

    log.info(f"=== Job {job_id} started ===")

    # Load models (warm after first call)
    load_models(model_size, compute_type)

    # Download audio to temp file
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as tmp:
        audio_path = tmp.name

        if youtube_video_id:
            download_youtube_audio(youtube_video_id, audio_path)
        else:
            download_audio(audio_url, audio_path)

        # Transcription
        segments, duration = transcribe(audio_path, language)

        # Diarization
        diarization = diarize(audio_path)

    # Merge
    segments = merge_transcript_diarization(segments, diarization)

    # Extract unique speakers
    speakers = sorted(set(seg["speaker"] for seg in segments))

    processing_time = round(time.time() - t_start, 2)
    log.info(
        f"=== Job {job_id} complete: {processing_time}s processing, "
        f"{duration:.1f}s audio, {len(segments)} segments, "
        f"{len(speakers)} speakers ==="
    )

    return {
        "job_id": job_id,
        "duration_seconds": round(duration, 2),
        "language": language,
        "segments": segments,
        "speakers": speakers,
        "processing_time_seconds": processing_time,
    }


# ---------------------------------------------------------------------------
# Runpod serverless entry point
# ---------------------------------------------------------------------------
runpod.serverless.start({"handler": handler})

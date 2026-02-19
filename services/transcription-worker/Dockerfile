# =============================================================================
# Dockerfile — Transcription Worker (Whisper + Diarisation)
#
# Image optimisee pour Runpod Serverless :
#   - CUDA 12.1 + Python 3.11
#   - faster-whisper (CTranslate2, int8) pour transcription ultra-rapide
#   - pyannote-audio 3.1 pour la diarisation
#   - runpod SDK pour le handler serverless
#
# Le modele Whisper large-v3 est pre-telecharge dans l'image
# pour eliminer le cold-start de telechargement (~3 GB).
# =============================================================================

FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

# Eviter les prompts interactifs
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Deps systeme
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.11 \
    python3.11-venv \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Faire de python3.11 le python par defaut
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 && \
    update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1

# Upgrade pip
RUN python -m pip install --upgrade pip setuptools wheel

# Installer les dependances Python
RUN pip install --no-cache-dir \
    faster-whisper==1.1.0 \
    pyannote.audio==3.3.2 \
    huggingface_hub==0.23.5 \
    torch==2.4.1 \
    torchaudio==2.4.1 \
    runpod==1.7.7 \
    requests==2.32.3 \
    numpy==1.26.4

# Pre-telecharger le modele Whisper large-v3 dans l'image
# Cela evite un cold-start de 60-90s au premier appel
RUN python -c "from faster_whisper import WhisperModel; WhisperModel('large-v3', device='cpu', compute_type='int8')"

# Copier le handler
WORKDIR /app
COPY handler.py .

# Runpod serverless entry point
CMD ["python", "-u", "handler.py"]

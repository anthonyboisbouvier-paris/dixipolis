# Dixipolis — Pipeline Transcription + Diarisation

## Architecture

```
Client (POST youtube_video_id)
    │
    ▼
n8n (CPU) ─── yt-dlp download ─── upload audio ─── trigger Runpod
    │                                                     │
    │                                                     ▼
    │                                            Runpod Serverless (GPU)
    │                                            ├─ faster-whisper large-v3 (int8)
    │                                            ├─ pyannote diarization 3.1
    │                                            └─ → JSON transcript
    │                                                     │
    ▼                                                     ▼
Client (GET job_id) ◄──── n8n polls Runpod ◄──── result stored
```

## Coûts estimés

| Composant | Coût |
|-----------|------|
| GPU (RTX A4000, 16 GB) | ~$0.00020/s |
| 1h audio → ~3-5 min GPU | ~$0.04-0.06 |
| n8n self-hosted | $0 |
| Stockage audio temp | négligeable |

## Stack technique

- **Transcription** : faster-whisper large-v3 (CTranslate2, int8) — 4x plus rapide que whisper original
- **Diarisation** : pyannote/speaker-diarization-3.1
- **GPU** : Runpod Serverless (pay-per-second, auto-shutdown)
- **Orchestration** : n8n (yt-dlp + trigger GPU)
- **Stockage** : fichier audio temporaire local n8n → URL servie au worker

## Setup

### 1. Variables d'environnement

```bash
# .env.local (jamais committé)
RUNPOD_API_KEY=rpa_xxxxx
RUNPOD_ENDPOINT_ID=xxxxx        # créé après déploiement
HF_TOKEN=hf_xxxxx               # token HuggingFace (pour pyannote)
```

### 2. Build & Push Docker image

```bash
cd services/transcription-worker

# Build
docker build -t dixipolis-transcription-worker .

# Tag pour Docker Hub (remplacer par ton username)
docker tag dixipolis-transcription-worker:latest YOUR_DOCKERHUB/dixipolis-worker:latest

# Push
docker push YOUR_DOCKERHUB/dixipolis-worker:latest
```

### 3. Créer le Serverless Endpoint sur Runpod

1. Aller sur https://console.runpod.io/serverless
2. "New Endpoint"
3. Configuration :
   - **Container Image** : `YOUR_DOCKERHUB/dixipolis-worker:latest`
   - **GPU** : RTX A4000 (16 GB) — le moins cher suffisant
   - **Min Workers** : 0 (scale-to-zero, $0 quand idle)
   - **Max Workers** : 1 (ou plus si besoin de parallélisme)
   - **Idle Timeout** : 5s (shutdown rapide)
   - **Environment Variables** :
     - `HF_TOKEN` = ton token HuggingFace
4. Copier l'Endpoint ID → mettre dans `RUNPOD_ENDPOINT_ID`

### 4. Configurer n8n

1. Importer les workflows :
   - `n8n-workflows/transcription-submit.json`
   - `n8n-workflows/transcription-status.json`
2. Configurer les variables d'environnement n8n :
   - `RUNPOD_API_KEY`
   - `RUNPOD_ENDPOINT_ID`
3. Installer yt-dlp sur le serveur n8n :
   ```bash
   pip install yt-dlp
   # ou
   apt-get install yt-dlp
   ```
4. Créer le dossier audio :
   ```bash
   mkdir -p /data/audio
   ```
5. Activer les deux workflows

### 5. Servir l'audio au worker GPU

Le worker GPU doit pouvoir télécharger l'audio. Deux options :

**Option A (simple) : n8n sert le fichier via un webhook statique**
- Ajouter un workflow n8n qui sert les fichiers `/data/audio/{job_id}.wav`
- L'URL est passée au worker comme `audio_url`

**Option B (recommandé pour prod) : Stockage S3**
- Upload le fichier wav vers Runpod S3 ou Cloudflare R2
- Passer l'URL S3 pré-signée au worker

## Utilisation

### Lancer une transcription

```bash
curl -X POST https://your-n8n-url/webhook/transcriptions \
  -H "Content-Type: application/json" \
  -d '{"youtube_video_id": "dQw4w9WgXcQ"}'
```

Réponse :
```json
{
  "job_id": "job_1708123456789_a1b2c3",
  "runpod_job_id": "abc123-def456",
  "status": "IN_QUEUE",
  "youtube_video_id": "dQw4w9WgXcQ"
}
```

### Vérifier le statut / récupérer le transcript

```bash
curl https://your-n8n-url/webhook/transcriptions/abc123-def456
```

En cours :
```json
{
  "job_id": "abc123-def456",
  "status": "IN_PROGRESS"
}
```

Terminé :
```json
{
  "job_id": "abc123-def456",
  "status": "COMPLETED",
  "transcript": {
    "job_id": "job_1708123456789_a1b2c3",
    "duration_seconds": 3612.5,
    "language": "fr",
    "segments": [
      {
        "start": 0.0,
        "end": 4.52,
        "text": "Bonjour et bienvenue dans cette émission.",
        "speaker": "SPEAKER_00",
        "words": [
          {"word": "Bonjour", "start": 0.0, "end": 0.45},
          {"word": "et", "start": 0.48, "end": 0.55},
          {"word": "bienvenue", "start": 0.58, "end": 1.12}
        ]
      }
    ],
    "speakers": ["SPEAKER_00", "SPEAKER_01"],
    "processing_time_seconds": 42.3
  }
}
```

## Format de sortie

Chaque segment contient :
- `start` / `end` : timestamps en secondes
- `text` : texte transcrit
- `speaker` : label du locuteur (SPEAKER_00, SPEAKER_01, ...)
- `words` : timestamps mot-à-mot (pour sous-titrage précis)

## Nettoyage

Les fichiers audio temporaires dans `/data/audio/` peuvent être supprimés après récupération du transcript. Ajouter un cron ou un step n8n pour nettoyer les fichiers > 24h.

# Dixipolis — Pipeline Transcription + Diarisation

Pipeline GPU serverless pour transcrire de l'audio avec identification des locuteurs (diarisation). Basee sur **faster-whisper large-v3-turbo** et **pyannote speaker-diarization-3.1**, deployee sur **Runpod Serverless**, orchestree par **n8n** avec stockage persistant sur **Supabase Storage**.

## Architecture

```
                        +---------------------------+
                        |        Client / App       |
                        +---------------------------+
                                    |
                    3 endpoints n8n (webhooks prod)
                                    |
                                    v
                        +---------------------------+
                        |     n8n Orchestrateur      |
                        |     (CPU, self-hosted)     |
                        |                           |
                        |  POST /transcriptions     |
                        |    → submit job Runpod    |
                        |                           |
                        |  GET /transcription-status|
                        |    → poll Runpod          |
                        |    → auto-save Supabase   |
                        |                           |
                        |  GET /transcription-result|
                        |    → fetch depuis Supabase|
                        +---------------------------+
                              |               |
                              v               v
                +------------------+  +------------------+
                | Runpod Serverless|  | Supabase Storage |
                | GPU (16 GB VRAM) |  | Bucket: dixipolis|
                |                  |  |                  |
                | 1. faster-whisper|  | transcripts/     |
                |    turbo         |  |   {job_id}.json  |
                | 2. pyannote 3.1  |  |                  |
                +------------------+  +------------------+
```

### Flux de donnees

1. Le client envoie un `audio_url` via `POST /webhook/transcriptions`
2. n8n genere un `job_id`, construit le payload et soumet le job a Runpod
3. Le worker GPU demarre (cold start ~10s si idle)
4. faster-whisper transcrit l'audio avec timestamps par segment
5. pyannote identifie les locuteurs par analyse du signal audio
6. Les segments sont fusionnes avec les labels de locuteurs
7. Le client poll `GET /webhook/transcription-status?job_id=XXX`
8. Quand COMPLETED : n8n sauvegarde automatiquement le JSON dans Supabase Storage
9. Le client recupere le transcript via `GET /webhook/transcription-result?job_id=XXX`

## API Endpoints (3 webhooks n8n)

### 1. Soumettre une transcription

```bash
curl -X POST https://n8n.srv1262078.hstgr.cloud/webhook/transcriptions \
  -H "Content-Type: application/json" \
  -d '{"audio_url": "https://example.com/audio.mp3", "language": "fr"}'
```

**Parametres d'entree :**

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `audio_url` | string | oui | URL directe du fichier audio (HTTP/HTTPS) |
| `language` | string | non | Code langue (default: `fr`) |

**Reponse :**
```json
{
  "job_id": "job_1708123456789_a1b2c3",
  "runpod_job_id": "abc123-def456-...-u1",
  "status": "IN_QUEUE",
  "audio_url": "https://example.com/audio.mp3",
  "language": "fr"
}
```

> **Important** : Utiliser le `runpod_job_id` (pas le `job_id`) pour les appels Status et Result.

### 2. Verifier le statut

```bash
curl "https://n8n.srv1262078.hstgr.cloud/webhook/transcription-status?job_id=RUNPOD_JOB_ID"
```

**Statuts possibles :** `IN_QUEUE` → `IN_PROGRESS` → `COMPLETED` | `FAILED` | `ERROR`

**Reponse (en cours) :**
```json
{
  "job_id": "abc123-def456-...-u1",
  "status": "IN_PROGRESS",
  "execution_time": null,
  "delay_time": 12415,
  "error": null
}
```

**Reponse (termine — auto-save Supabase) :**
```json
{
  "job_id": "abc123-def456-...-u1",
  "status": "COMPLETED",
  "execution_time": 122065,
  "delay_time": 12415,
  "transcript_saved": true,
  "transcript_path": "transcripts/abc123-def456-...-u1.json"
}
```

### 3. Recuperer la transcription

```bash
curl "https://n8n.srv1262078.hstgr.cloud/webhook/transcription-result?job_id=RUNPOD_JOB_ID"
```

**Reponse (succes) :** le JSON complet de transcription (voir format ci-dessous)

**Reponse (pas encore pret) :**
```json
{
  "error": "Transcript not found",
  "job_id": "xxx",
  "message": "The transcript file does not exist yet. The job may still be processing."
}
```

### API Runpod directe (avance)

Pour un controle total sans passer par n8n :

```bash
# Soumettre
curl -X POST "https://api.runpod.ai/v2/uds4rmzb61uph6/run" \
  -H "Authorization: Bearer YOUR_RUNPOD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "audio_url": "https://example.com/audio.mp3",
      "language": "fr",
      "job_id": "my_custom_id"
    }
  }'

# Statut
curl "https://api.runpod.ai/v2/uds4rmzb61uph6/status/{job_id}" \
  -H "Authorization: Bearer YOUR_RUNPOD_API_KEY"
```

## Audio de test

Fichiers audio politiques heberges sur GitHub Releases (URLs permanentes, copier-coller pour tester) :

| Audio | Duree | Speakers | Taille | Cout GPU | Release |
|-------|-------|----------|--------|----------|---------|
| Debat Simonnet/Millienne (LCI) | 28 min | 3 | 19 MB | ~$0.020 | benchmarks-v2 |
| Debat Attal/Bardella/Bompard (TF1) | 108 min | 13 | 84 MB | ~$0.082 | benchmarks-v2 |
| Macron Voeux 2025 | 10 min | 1 | — | ~$0.006 | bench-audio-v1 |
| Macron Davos 2025 | 19 min | 1 | — | ~$0.012 | bench-audio-v1 |
| QAG Assemblee Nationale | 57 min | 22 | — | ~$0.038 | bench-audio-v1 |

### URLs copier-coller

```
https://github.com/anthonyboisbouvier-paris/dixipolis/releases/download/benchmarks-v2/debat_lfi_modem.mp3
https://github.com/anthonyboisbouvier-paris/dixipolis/releases/download/benchmarks-v2/debat_attal_bardella_bompard.mp3
https://github.com/anthonyboisbouvier-paris/dixipolis/releases/download/bench-audio-v1/macron_voeux.mp3
https://github.com/anthonyboisbouvier-paris/dixipolis/releases/download/bench-audio-v1/macron_davos.mp3
https://github.com/anthonyboisbouvier-paris/dixipolis/releases/download/bench-audio-v1/qag_assemblee.mp3
```

### Test rapide (copier-coller)

```bash
# 1. Soumettre le debat court (28 min, ~$0.02)
curl -X POST https://n8n.srv1262078.hstgr.cloud/webhook/transcriptions \
  -H "Content-Type: application/json" \
  -d '{"audio_url": "https://github.com/anthonyboisbouvier-paris/dixipolis/releases/download/benchmarks-v2/debat_lfi_modem.mp3"}'

# 2. Noter le runpod_job_id dans la reponse, puis verifier le statut
curl "https://n8n.srv1262078.hstgr.cloud/webhook/transcription-status?job_id=RUNPOD_JOB_ID"

# 3. Quand status=COMPLETED, recuperer le resultat
curl "https://n8n.srv1262078.hstgr.cloud/webhook/transcription-result?job_id=RUNPOD_JOB_ID"
```

## Format de sortie (COMPLETED)

```json
{
  "job_id": "my_custom_id",
  "duration_seconds": 1692.93,
  "language": "fr",
  "processing_time_seconds": 121.84,
  "segments": [
    {
      "start": 0.0,
      "end": 4.44,
      "text": "Bonjour Daniel Timonet, vous etes candidate...",
      "speaker": "SPEAKER_00"
    }
  ],
  "speakers": ["SPEAKER_00", "SPEAKER_01", "SPEAKER_02"]
}
```

### Champs

| Champ | Description |
|-------|-------------|
| `duration_seconds` | Duree totale de l'audio |
| `processing_time_seconds` | Temps total de traitement GPU |
| `segments[].start/end` | Timestamps en secondes |
| `segments[].text` | Texte transcrit du segment |
| `segments[].speaker` | Label du locuteur (SPEAKER_00, 01, ...) |
| `speakers` | Liste des locuteurs uniques detectes |

## KPI & Benchmarks

Tests realises sur l'endpoint Runpod `uds4rmzb61uph6` (GPU 16 GB VRAM tier, $0.00016/s).

### Modele Whisper large-v3-turbo

Le modele **large-v3-turbo** est ~2.7x plus rapide que large-v3 en conditions reelles (transcription + diarisation). Il utilise un decodeur reduit (4 couches au lieu de 32) pour 809M params au lieu de 1.55B, avec une perte de qualite negligeable (-1-2% WER).

> Note : Le gain theorique est de 6x sur la transcription seule, mais pyannote (diarisation) represente ~50% du temps total, ce qui ramene le gain reel a ~2.7x.

### Benchmarks reels (large-v3-turbo + pyannote 3.1, GPU 16 GB)

| Source audio | Duree audio | Temps traitement | Speakers | Ratio | Cout |
|-------------|-------------|------------------|----------|-------|------|
| Debat LFI-Modem (LCI) | 28 min | **122s** | 3 | **0.07x** | ~$0.020 |
| Debat Attal/Bardella/Bompard (TF1) | 108 min | **512s** | 13 | **0.079x** | $0.082 |
| QAG Assemblee Nationale | 57 min 15s | **235s** | 22 | **0.068x** | $0.038 |
| Macron Voeux 2025 | 9 min 55s | **37s** | 1 | **0.062x** | $0.006 |
| Macron Davos 2025 | 18 min 56s | **75s** | 1 | **0.066x** | $0.012 |

### Comparaison avant/apres

| Metrique | large-v3 (avant) | large-v3-turbo (apres) | Gain |
|----------|------------------|------------------------|------|
| Ratio traitement | 0.17x | **0.07x** | **2.4x** |
| GPU pour 1h audio | 10.2 min | **4.2 min** | 2.4x |
| Cout / heure audio | $0.098 | **$0.046** | **2.1x** |

### Extrapolation a grande echelle

| Duree audio | Temps GPU | Avec 3 workers en parallele |
|-------------|-----------|----------------------------|
| 5 min | ~21s | 21s |
| 15 min | ~63s | 63s |
| 30 min | ~126s | 126s |
| 1 heure | ~252s | 252s |
| 2 heures | ~504s | 504s |
| 10x 1 heure (batch) | ~4 min 12s chacun | ~14 min total (3 workers) |

### Latences

| Metrique | Valeur |
|----------|--------|
| Cold start (image pull + init) | ~2-3 min (image 13 GB) |
| Warm start (queue delay) | ~8-12s |
| Chargement modeles | Inclus dans l'image Docker (pre-telecharge) |

## Pricing

### GPU Runpod Serverless (pay-per-second)

| Tier VRAM | Supply | Prix/seconde | Prix/heure |
|-----------|--------|-------------|------------|
| **16 GB** (recommande) | Medium | $0.00016/s | $0.576/h |
| 24 GB | Medium | $0.00019/s | $0.684/h |
| 24 GB PRO | High | $0.00031/s | $1.116/h |
| 48 GB | High | $0.00034/s | $1.224/h |

### Cout par transcription (16 GB tier + turbo, ratio ~0.07x)

| Duree audio | Temps GPU | Cout GPU |
|-------------|-----------|----------|
| 5 min | ~21s | **$0.003** |
| 15 min | ~63s | **$0.010** |
| 30 min | ~126s | **$0.020** |
| 1 heure | ~252s | **$0.040** |
| 2 heures | ~504s | **$0.081** |
| 100 jobs de 1h | ~7h GPU | **$4.03** |

**Note :** Zero cout quand aucun job n'est en cours (scale-to-zero).

### Comparaison avec les concurrents

| Service | Cout pour 1h d'audio | Ratio |
|---------|----------------------|-------|
| **Dixipolis (cette pipeline)** | **~$0.040** | **1x** |
| OpenAI Whisper API | ~$0.36 | 9x plus cher |
| AssemblyAI | ~$0.65 | 16x plus cher |
| Google Speech-to-Text | ~$1.44 | 36x plus cher |
| AWS Transcribe | ~$1.44 | 36x plus cher |

> *Prix concurrents indicatifs, basees sur les tarifs publics (fev. 2026). Dixipolis inclut la diarisation dans le prix.*

### Autres couts fixes

| Composant | Cout |
|-----------|------|
| n8n self-hosted (Hostinger VPS) | ~$5/mois |
| Supabase Storage (free tier) | Gratuit (1 GB) |
| GHCR (stockage image Docker) | Gratuit (public) |
| GitHub Actions (CI/CD) | Gratuit (quota public) |

## Stack technique

| Composant | Technologie | Role |
|-----------|------------|------|
| Transcription | faster-whisper large-v3-turbo (CTranslate2, int8_float16) | ~2.7x plus rapide que large-v3, qualite quasi identique |
| Diarisation | pyannote/speaker-diarization-3.1 | Identification des locuteurs |
| GPU | Runpod Serverless | Pay-per-second, auto scale-to-zero |
| Orchestration | n8n (self-hosted) | Webhooks, routing, API gateway |
| Stockage | Supabase Storage | Persistance JSON transcripts (bucket public) |
| Container | Docker (CUDA 12.1 + Python 3.11) | Image ~13 GB avec modele turbo pre-charge |
| CI/CD | GitHub Actions | Build & push image automatique |
| Registry | GHCR (GitHub Container Registry) | Stockage image Docker publique |

## Structure des fichiers

```
services/
├── transcription-worker/
│   ├── Dockerfile                      # Image GPU (CUDA 12.1, Whisper, pyannote)
│   ├── handler.py                      # Handler Runpod serverless
│   └── requirements.txt
├── n8n-workflows/
│   ├── transcription-submit.json       # POST /webhook/transcriptions
│   ├── transcription-status.json       # GET /webhook/transcription-status
│   └── transcription-result.json       # GET /webhook/transcription-result
└── README.md                           # Ce fichier
```

## Setup / Deploiement

### Prerequis

- Compte Runpod avec credit
- Token HuggingFace (accepter les conditions de pyannote)
- Instance n8n self-hosted
- Projet Supabase avec bucket Storage

### 1. Variables d'environnement

```bash
# Runpod (dans les env vars de l'endpoint)
HF_TOKEN=hf_xxxxx               # Token HuggingFace (pour pyannote)

# Local / CI
RUNPOD_API_KEY=rpa_xxxxx         # API key Runpod
RUNPOD_ENDPOINT_ID=xxxxx         # ID de l'endpoint serverless
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx    # Service role key (pour upload)
```

### 2. Build & Push Docker image

L'image est automatiquement buildee et pushee via GitHub Actions a chaque push sur `main` (si des fichiers dans `services/transcription-worker/` sont modifies).

Build manuel :
```bash
cd services/transcription-worker
docker build -t ghcr.io/YOUR_USER/dixipolis-worker:latest .
docker push ghcr.io/YOUR_USER/dixipolis-worker:latest
```

### 3. Configurer Runpod

1. Creer un endpoint serverless sur https://console.runpod.io/serverless
2. Configuration :
   - **Container Image** : `ghcr.io/YOUR_USER/dixipolis-worker:latest`
   - **Container Disk** : 50 GB (image ~13 GB)
   - **GPU** : 16 GB VRAM tier (turbo ~1.5GB + pyannote ~1.6GB = 3.1GB VRAM)
   - **Min Workers** : 0 (scale-to-zero)
   - **Max Workers** : 3-5 (selon le parallelisme souhaite)
   - **Idle Timeout** : 5s
   - **Environment Variables** : `HF_TOKEN`

### 4. Configurer n8n

1. Importer les 3 fichiers JSON de `n8n-workflows/` dans l'editeur n8n via **Import from file**
2. Activer chaque workflow (toggle Active)
3. Les webhooks seront disponibles sur :
   - `POST /webhook/transcriptions`
   - `GET /webhook/transcription-status`
   - `GET /webhook/transcription-result`

> **Important** : Les workflows doivent etre importes via l'editeur n8n. Les workflows crees via API REST ne registrent pas les webhooks production dans n8n v2.2.6.

### 5. Configurer Supabase

1. Creer un bucket `dixipolis` (public)
2. Les credentials Supabase (service_role key) sont deja integrees dans le workflow `transcription-status.json`

## Langues supportees

Le modele Whisper large-v3-turbo supporte 99 langues. Passer le code langue via le parametre `language` :

| Code | Langue |
|------|--------|
| `fr` | Francais (default) |
| `en` | Anglais |
| `es` | Espagnol |
| `de` | Allemand |
| `it` | Italien |
| `pt` | Portugais |
| `ja` | Japonais |
| `zh` | Chinois |
| ... | [Liste complete](https://github.com/openai/whisper#available-models-and-languages) |

## Limitations connues

- **Audio URL uniquement** : L'API accepte uniquement des URLs audio directes (HTTP/HTTPS). Les URLs YouTube ne sont pas supportees (anti-bot sur les serveurs cloud).
- **Diarisation** : La precision diminue avec plus de 5-6 locuteurs simultanes.
- **Cold start** : Premier job apres une periode d'inactivite prend ~2-3 min (pull image 13 GB).
- **Taille audio** : Pas de limite theorique, mais les fichiers > 3h peuvent timeout (default 600s).
- **Formats audio** : MP3, WAV, FLAC, OGG, M4A... tous acceptes — conversion automatique en WAV 16kHz mono.

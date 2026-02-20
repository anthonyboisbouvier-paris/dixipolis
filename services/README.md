# Dixipolis — Pipeline Transcription + Diarisation

Pipeline GPU serverless pour transcrire de l'audio (fichiers directs ou YouTube) avec identification des locuteurs (diarisation). Basee sur **faster-whisper large-v3-turbo** et **pyannote speaker-diarization-3.1**, deployee sur **Runpod Serverless**.

## Architecture

```
                        +---------------------------+
                        |        Client / App       |
                        +---------------------------+
                                    |
                        POST /transcriptions
                        (youtube_video_id ou audio_url)
                                    |
                                    v
                        +---------------------------+
                        |     n8n Orchestrateur      |
                        |     (CPU, self-hosted)     |
                        |                           |
                        |  - Genere un job_id       |
                        |  - Construit le payload   |
                        |  - Appelle Runpod API     |
                        |  - Retourne job_id        |
                        +---------------------------+
                                    |
                        POST /v2/{endpoint}/run
                                    |
                                    v
                        +---------------------------+
                        |   Runpod Serverless GPU   |
                        |   (RTX 2000 Ada 6 GB)    |
                        |                           |
                        |  1. yt-dlp (si YouTube)   |
                        |  2. faster-whisper turbo  |
                        |     (transcription)       |
                        |  3. pyannote 3.1          |
                        |     (diarisation)         |
                        |  4. Merge segments +      |
                        |     speakers              |
                        +---------------------------+
                                    |
                                    v
                        +---------------------------+
                        |   JSON Transcript         |
                        |   - segments + timestamps |
                        |   - speaker labels        |
                        |   - word-level timing     |
                        +---------------------------+
```

### Flux de donnees

1. Le client envoie un `youtube_video_id` ou un `audio_url` via l'API n8n
2. n8n genere un `job_id`, construit le payload Runpod et soumet le job
3. Le worker GPU demarre (cold start ~10s si idle)
4. Si YouTube : yt-dlp telecharge l'audio en WAV (via Node.js runtime)
5. faster-whisper transcrit l'audio avec timestamps mot-a-mot
6. pyannote identifie les locuteurs par analyse du signal audio
7. Les segments sont fusionnes avec les labels de locuteurs
8. Le resultat JSON est retourne via l'API Runpod status

## API Endpoints

### Methode 1 : Via n8n (recommande pour les applications)

#### Soumettre une transcription

```bash
# Par YouTube video ID
curl -X POST https://n8n.srv1262078.hstgr.cloud/webhook/transcriptions \
  -H "Content-Type: application/json" \
  -d '{"youtube_video_id": "dQw4w9WgXcQ", "language": "fr"}'

# Par URL audio directe
curl -X POST https://n8n.srv1262078.hstgr.cloud/webhook/transcriptions \
  -H "Content-Type: application/json" \
  -d '{"audio_url": "https://example.com/audio.wav", "language": "en"}'
```

**Reponse :**
```json
{
  "job_id": "job_1708123456789_a1b2c3",
  "runpod_job_id": "abc123-def456-...",
  "status": "IN_QUEUE",
  "youtube_video_id": "dQw4w9WgXcQ"
}
```

#### Verifier le statut / Recuperer le transcript

```bash
curl https://n8n.srv1262078.hstgr.cloud/webhook/transcriptions/{runpod_job_id}
```

**Statuts possibles :** `IN_QUEUE` → `IN_PROGRESS` → `COMPLETED` | `FAILED`

### Methode 2 : API Runpod directe

Pour un controle total sans passer par n8n.

#### Soumettre un job

```bash
curl -X POST "https://api.runpod.ai/v2/nu0o7k8jf02mjd/run" \
  -H "Authorization: Bearer YOUR_RUNPOD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "youtube_video_id": "dQw4w9WgXcQ",
      "language": "fr",
      "job_id": "my_custom_id"
    }
  }'
```

**Parametres d'entree :**

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `youtube_video_id` | string | oui* | ID de la video YouTube |
| `audio_url` | string | oui* | URL directe du fichier audio |
| `language` | string | non | Code langue (default: `fr`) |
| `job_id` | string | non | ID personnalise (auto-genere sinon) |
| `model_size` | string | non | Taille du modele Whisper (default: `large-v3-turbo`) |
| `compute_type` | string | non | Type de calcul (default: `int8_float16`) |

*Un des deux (`youtube_video_id` ou `audio_url`) est requis.

**Reponse :**
```json
{
  "id": "abc123-def456-...",
  "status": "IN_QUEUE"
}
```

#### Verifier le statut

```bash
curl "https://api.runpod.ai/v2/nu0o7k8jf02mjd/status/{job_id}" \
  -H "Authorization: Bearer YOUR_RUNPOD_API_KEY"
```

## Format de sortie (COMPLETED)

```json
{
  "job_id": "my_custom_id",
  "duration_seconds": 38.76,
  "language": "en",
  "processing_time_seconds": 24.92,
  "segments": [
    {
      "start": 0.27,
      "end": 2.17,
      "text": "This is my voice on the left.",
      "speaker": "SPEAKER_00",
      "words": [
        {"word": "This", "start": 0.27, "end": 0.73},
        {"word": "is", "start": 0.73, "end": 0.91},
        {"word": "my", "start": 0.91, "end": 1.17},
        {"word": "voice", "start": 1.17, "end": 1.45},
        {"word": "on", "start": 1.45, "end": 1.81},
        {"word": "the", "start": 1.81, "end": 1.97},
        {"word": "left.", "start": 1.97, "end": 2.17}
      ]
    }
  ],
  "speakers": ["SPEAKER_00", "SPEAKER_01"]
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
| `segments[].words[]` | Timestamps mot-a-mot (pour sous-titrage) |
| `speakers` | Liste des locuteurs uniques detectes |

## KPI & Benchmarks

Tests realises sur l'endpoint Runpod `nu0o7k8jf02mjd`.

### Modele Whisper large-v3-turbo

Le modele **large-v3-turbo** est 6x plus rapide que large-v3 avec une perte de qualite negligeable (-1-2% WER). Il utilise un decodeur reduit (4 couches au lieu de 32) pour 809M params au lieu de 1.55B.

### Benchmarks reels (audio_url, large-v3 — avant turbo)

| Source audio | Duree audio | Temps traitement | Delay (queue) | Ratio |
|-------------|-------------|------------------|---------------|-------|
| WAV mono (test technique) | 38.76s | 23.65s | 7.8s | 0.61x |
| MP3 LibriVox (speech EN) | 4 min 36s (275s) | 47.12s | 10.0s | 0.17x |

### Performances estimees avec large-v3-turbo (6x plus rapide)

A grande echelle (workers warm, jobs en continu), le ratio de traitement effectif est de **~0.03x temps reel** avec le modele turbo.

| Duree audio | Temps GPU estime | Avec 3 workers en parallele |
|-------------|------------------|-----------------------------|
| 5 min | ~9s | 9s |
| 15 min | ~27s | 27s |
| 30 min | ~54s | 54s |
| 1 heure | ~1 min 48s | 1 min 48s |
| 2 heures | ~3 min 36s | 3 min 36s |
| 10x 1 heure (batch) | ~1 min 48s chacun | ~6 min total (3 workers) |

### Latences

| Metrique | Valeur |
|----------|--------|
| Cold start (worker idle → ready) | ~15-30s |
| Warm start (queue delay) | ~8-10s |
| Chargement modeles (premiere requete) | Inclus dans l'image Docker |

### Throughput

Avec N workers actifs et le modele turbo, le throughput est de **N × ~33 heures d'audio/heure** :

| Workers | Throughput (audio/heure) | Jobs 1h/heure |
|---------|--------------------------|---------------|
| 1 | ~33h d'audio | ~33 jobs |
| 3 | ~100h d'audio | ~100 jobs |
| 5 | ~166h d'audio | ~166 jobs |

## Pricing

### GPU Runpod Serverless (pay-per-second)

| GPU | Prix/seconde | Prix/heure |
|-----|-------------|------------|
| RTX 2000 Ada (6 GB) | $0.00012/s | $0.43/h |
| RTX 4000 Ada (16 GB) | $0.00028/s | $1.01/h |
| RTX A4500 (20 GB) | $0.00024/s | $0.86/h |

### Cout par transcription a grande echelle (RTX 2000 Ada + turbo)

Basee sur le ratio de **~0.03x** estime avec large-v3-turbo sur RTX 2000 Ada ($0.43/h) :

| Duree audio | Temps GPU | Cout GPU |
|-------------|-----------|----------|
| 5 min | ~9s | **$0.001** |
| 15 min | ~27s | **$0.003** |
| 30 min | ~54s | **$0.006** |
| 1 heure | ~1 min 48s | **$0.013** |
| 2 heures | ~3 min 36s | **$0.026** |
| 100 jobs de 1h | ~3h GPU | **$1.29** |

**Note :** Zero cout quand aucun job n'est en cours (scale-to-zero).

### Comparaison avec les concurrents

| Service | Cout pour 1h d'audio | Ratio |
|---------|----------------------|-------|
| **Dixipolis (cette pipeline)** | **~$0.013** | **1x** |
| OpenAI Whisper API | ~$0.36 | 28x plus cher |
| AssemblyAI | ~$0.65 | 50x plus cher |
| Google Speech-to-Text | ~$1.44 | 110x plus cher |
| AWS Transcribe | ~$1.44 | 110x plus cher |

> *Prix concurrents indicatifs, basees sur les tarifs publics (fev. 2026). Dixipolis inclut la diarisation dans le prix.*

### Autres couts fixes

| Composant | Cout |
|-----------|------|
| n8n self-hosted (Hostinger VPS) | ~$5/mois |
| GHCR (stockage image Docker) | Gratuit (public) |
| GitHub Actions (CI/CD) | Gratuit (quota public) |

## Stack technique

| Composant | Technologie | Role |
|-----------|------------|------|
| Transcription | faster-whisper large-v3-turbo (CTranslate2, int8_float16) | 6x plus rapide que large-v3, qualite quasi identique |
| Diarisation | pyannote/speaker-diarization-3.1 | Identification des locuteurs |
| Download YouTube | yt-dlp + Node.js runtime | Extraction audio YouTube → WAV |
| GPU | Runpod Serverless | Pay-per-second, auto scale-to-zero |
| Orchestration | n8n (self-hosted) | Webhooks, routing, API gateway |
| Container | Docker (CUDA 12.1 + Python 3.11) | Image ~13 GB avec modele turbo pre-charge |
| CI/CD | GitHub Actions | Build & push image automatique |
| Registry | GHCR (GitHub Container Registry) | Stockage image Docker publique |

## Structure des fichiers

```
services/
├── transcription-worker/
│   ├── Dockerfile              # Image GPU (CUDA 12.1, Whisper, pyannote, yt-dlp)
│   └── handler.py              # Handler Runpod serverless
├── n8n-workflows/
│   ├── transcription-submit.json   # Workflow n8n : soumettre un job
│   └── transcription-status.json   # Workflow n8n : verifier le statut
└── README.md                   # Ce fichier
```

## Setup / Deploiement

### Prerequis

- Compte Runpod avec credit
- Token HuggingFace (accepter les conditions de pyannote)
- Instance n8n self-hosted (optionnel, pour les webhooks)

### 1. Variables d'environnement

```bash
# Runpod (dans les env vars de l'endpoint)
HF_TOKEN=hf_xxxxx               # Token HuggingFace (pour pyannote)

# Local / CI
RUNPOD_API_KEY=rpa_xxxxx         # API key Runpod
RUNPOD_ENDPOINT_ID=xxxxx         # ID de l'endpoint serverless
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
   - **GPU** : RTX 2000 Ada (6 GB VRAM suffisent — turbo ~1.5GB + pyannote ~1.6GB)
   - **Min Workers** : 0 (scale-to-zero)
   - **Max Workers** : 3-5 (selon le parallelisme souhaite)
   - **Idle Timeout** : 5s
   - **FlashBoot** : Desactive (image custom volumineuse)
   - **Environment Variables** : `HF_TOKEN`

### 4. Configurer n8n (optionnel)

1. Importer les workflows JSON dans n8n
2. Remplacer les placeholders dans les nodes HTTP :
   - `YOUR_RUNPOD_API_KEY` → votre API key Runpod
   - `YOUR_RUNPOD_ENDPOINT_ID` → ID de l'endpoint
3. Activer les workflows
4. Les webhooks seront disponibles sur :
   - `POST /webhook/transcriptions`
   - `GET /webhook/transcriptions/:job_id`

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

- **YouTube** : Le telechargement YouTube via yt-dlp est bloque par les mesures anti-bot de YouTube sur les serveurs. **Recommandation :** telecharger l'audio YouTube cote client ou via n8n, puis envoyer l'`audio_url` au worker GPU.
- **Diarisation** : La precision diminue avec plus de 5-6 locuteurs simultanes.
- **Cold start** : Premier job apres une periode d'inactivite prend ~15-30s de plus.
- **Taille audio** : Pas de limite theorique, mais les fichiers > 3h peuvent timeout (default 600s).
- **Tous les formats audio** sont acceptes (MP3, WAV, FLAC, OGG, M4A...) — le handler convertit automatiquement en WAV 16kHz mono avant traitement.

## Bugs connus a corriger

| Bug | Severite | Impact | Fix |
|-----|----------|--------|-----|
| YouTube anti-bot | Externe | YouTube bloque les serveurs | Gerer le download YouTube cote client/n8n |

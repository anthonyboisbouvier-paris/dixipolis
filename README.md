# Dixipolis

**La plateforme d'IA puissante pour analyser le discours politique.**

Dixipolis est une application web qui permet de rechercher, analyser et explorer l'ensemble des discours politiques francais. Grace a un moteur de recherche semantique et des outils d'analyse avances, la plateforme offre un acces direct, factuel et sans biais aux declarations des responsables politiques.

## Architecture

```
Client (Next.js / Vercel)
  |
  ├── POST /webhook/transcriptions         → Soumettre un job de transcription
  ├── GET  /webhook/transcription-status    → Verifier le statut (+ auto-save)
  └── GET  /webhook/transcription-result    → Recuperer le JSON de transcription
        |
     n8n (orchestrateur)
        |
        ├── Runpod Serverless GPU ──── faster-whisper large-v3-turbo
        |                               + pyannote speaker-diarization-3.1
        |
        └── Supabase Storage ────────── Stockage persistant des JSON
```

## Pipeline de transcription

### Fonctionnement
1. **Submit** : Le client envoie une URL audio → n8n transmet a Runpod Serverless
2. **Processing** : Le GPU transcrit l'audio avec diarisation des speakers (~0.07x temps reel)
3. **Status** : Le client poll le statut. Quand COMPLETED, n8n sauvegarde automatiquement le JSON dans Supabase Storage
4. **Result** : Le client recupere le JSON complet de transcription depuis Supabase

### API Endpoints

#### 1. Soumettre un job
```bash
curl -X POST https://n8n.srv1262078.hstgr.cloud/webhook/transcriptions \
  -H "Content-Type: application/json" \
  -d '{"audio_url": "https://example.com/audio.mp3", "language": "fr"}'
```
Reponse :
```json
{
  "job_id": "job_xxx",
  "runpod_job_id": "xxx-u1",
  "status": "IN_QUEUE",
  "audio_url": "...",
  "language": "fr"
}
```

#### 2. Verifier le statut
```bash
curl "https://n8n.srv1262078.hstgr.cloud/webhook/transcription-status?job_id=RUNPOD_JOB_ID"
```
Reponse (en cours) : `{"status": "IN_PROGRESS", ...}`
Reponse (termine) : `{"status": "COMPLETED", "transcript_saved": true, "transcript_path": "transcripts/xxx.json"}`

#### 3. Recuperer la transcription
```bash
curl "https://n8n.srv1262078.hstgr.cloud/webhook/transcription-result?job_id=RUNPOD_JOB_ID"
```
Retourne le JSON complet de transcription avec segments, speakers et timestamps.

### Performances

| Source | Duree | Traitement | Speakers | Ratio | Cout |
|--------|-------|------------|----------|-------|------|
| Debat LFI-Modem (LCI) | 28 min | 122s | 3 | 0.07x | ~$0.020 |
| Debat Attal/Bardella/Bompard (TF1) | 108 min | 512s | 13 | 0.079x | $0.082 |
| QAG Assemblee Nationale | 57 min | 235s | 22 | 0.068x | $0.038 |

**8x moins cher** qu'OpenAI Whisper API, **31x moins cher** que Google Speech-to-Text.

## Stack technique

| Technologie | Utilisation |
|---|---|
| **Next.js 16** | Frontend (App Router, SSR, SSG) — deploye sur Vercel |
| **TypeScript** | Typage statique |
| **Tailwind CSS v4** | Styles utilitaires |
| **n8n** | Orchestrateur de workflows (webhooks, logique metier) |
| **Runpod Serverless** | GPU a la demande (AMPERE_16, $0.00016/s) |
| **faster-whisper** | Transcription (large-v3-turbo) |
| **pyannote** | Diarisation des speakers (speaker-diarization-3.1) |
| **Supabase Storage** | Stockage persistant des JSON de transcription |
| **Docker** | Image GPU avec modeles pre-telecharges (~13 GB) |
| **GitHub Actions** | CI/CD Docker auto-build |

## Structure du projet

```
dixipolis/
├── src/                              # Frontend Next.js
│   ├── app/                          # Pages (App Router)
│   ├── components/                   # Composants React reutilisables
│   ├── lib/                          # Utilitaires et constantes
│   ├── types/                        # Types TypeScript
│   └── hooks/                        # Hooks React personnalises
│
├── services/
│   ├── transcription-worker/         # Worker GPU Runpod
│   │   ├── handler.py                # Handler serverless (whisper + pyannote)
│   │   ├── Dockerfile                # Image CUDA 12.1 + Python 3.11
│   │   └── requirements.txt
│   │
│   └── n8n-workflows/                # Workflows n8n (a importer via editeur)
│       ├── transcription-submit.json
│       ├── transcription-status.json
│       └── transcription-result.json
│
├── benchmarks/                       # Fichiers de benchmark
│   ├── debat_lfi_modem.mp3
│   ├── debat_attal_bardella_bompard.mp3
│   └── *_result.json
│
└── CLAUDE_STATE.md                   # Etat du projet pour reprise Claude
```

## Demarrage rapide

### Frontend
```bash
npm install
npm run dev          # Dev sur http://localhost:3000
npm run build        # Build production
```

### Worker GPU (Docker)
```bash
cd services/transcription-worker
docker build -t dixipolis-worker .
# Image publique : ghcr.io/anthonyboisbouvier-paris/dixipolis-worker:latest
```

### Workflows n8n
Les fichiers JSON dans `services/n8n-workflows/` doivent etre importes manuellement dans l'editeur n8n (les workflows crees via API ne registrent pas les webhooks production dans n8n v2.2.6).

## Deploiement

| Service | URL |
|---------|-----|
| **Frontend** | [dixipolis.vercel.app](https://dixipolis.vercel.app) |
| **n8n** | `https://n8n.srv1262078.hstgr.cloud` |
| **Runpod** | Endpoint `uds4rmzb61uph6` (serverless, auto-scale 0→3) |
| **Supabase** | Bucket `dixipolis` (stockage transcriptions) |

## Licence

Projet prive - Dixipolis. Tous droits reserves.

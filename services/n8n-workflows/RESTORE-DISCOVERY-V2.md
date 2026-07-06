# Restauration du workflow Discovery V2 (DIX-33)

Le VPS Hostinger hébergeant n8n (`srv1262078.hstgr.cloud`) a été annulé le 14/06/2026
(défaut de paiement). Ce dossier contient les exports des workflows pour reconstruire
l'instance. `daily-political-discovery-v2.json` a été reconstruit à partir de la
sauvegarde de janvier 2026 + la spécification complète de la story
[DIX-33](https://linear.app/dixipolis/issue/DIX-33) (paramètres, format de réponse,
auth Bearer, limites du mode test).

## 1. Nouvelle instance n8n

Au choix :
- **Hostinger VPS** : template « n8n auto-hébergé » dans hPanel (le plus proche de l'ancien setup)
- **n8n Cloud** : zéro maintenance, payant
- Tout autre VPS avec Docker : `docker run -d -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n`

## 2. Importer les workflows

Dans n8n : **Workflows → Import from File** pour chacun des fichiers :
- `daily-political-discovery-v2.json` (discovery — DIX-33)
- `transcription-submit.json`, `transcription-status.json`, `transcription-result.json` (pipeline transcription)

## 3. Recréer les credentials

Les credentials ne sont jamais inclus dans les exports. À recréer (les nœuds marqués
`TO_RECONFIGURE_*` doivent être re-liés) :

| Credential | Type n8n | Notes |
|---|---|---|
| YouTube API OAuth2 | YouTube OAuth2 API | Projet GCP `youtube-monitor-n8n` — vérifier que la facturation GCP est réactivée et refaire le consentement OAuth |
| SerpAPI account | SerpApi | Clé sur serpapi.com |
| OpenAi account | OpenAI API | Utilisé pour le scoring sémantique (gpt-4o-mini) |
| Discovery Webhook Bearer | Header Auth | Name = `Authorization`, Value = `Bearer <nouveau token>` — **générer un nouveau token**, ne pas réutiliser l'ancien (il figure en clair dans les commentaires Linear) |

## 4. Activer et vérifier

1. Activer le workflow (toggle **Active**).
2. Test sans auth → doit renvoyer **403** :
   ```bash
   curl -X POST https://<instance>/webhook/discover/political-videosV2 \
     -H "Content-Type: application/json" \
     -d '{"mode": "test"}'
   ```
3. Test avec auth → doit renvoyer le JSON `statistics` + `videos` :
   ```bash
   curl -X POST https://<instance>/webhook/discover/political-videosV2 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"mode": "test", "publication_day": "2026-07-05", "days_after": 1, "min_score": 0.4}'
   ```

## 5. Reconnecter l'ingestion

Transmettre à l'app d'ingestion (Loïc) :
- la nouvelle URL du webhook,
- le nouveau Bearer token.

Son cron quotidien (09:00 UTC, `publication_day` = veille, `min_score` = 0.7) repart tel quel.

## Différences avec la sauvegarde de janvier

- Endpoint `discover/political-videosV2` (au lieu de `discover/political-videos`)
- Auth Bearer obligatoire sur le webhook
- Paramètres `publication_day` / `days_after` / `min_score` honorés (fenêtre de dates
  appliquée aux recherches YouTube et re-vérifiée après enrichissement)
- Seuil de score dynamique (`min_score`, défaut 0.4) au lieu de 0.7 en dur
- Mode test plafonné à 8 vidéos
- Réponse au format DIX-33 : bloc `statistics` (global / scores / channels) +
  `videos` enrichies (titre, chaîne, durée, date) — avec `channel_id` en plus pour
  permettre la persistance de `youtube_channel_id` côté BDD

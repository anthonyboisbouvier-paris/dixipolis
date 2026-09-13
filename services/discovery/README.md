# Discovery — reprise historique ciblée (candidats 2027)

Objectif : retrouver **toutes** les vidéos YouTube où parlent les principales figures de la
présidentielle 2027 (puis, par élargissements successifs, les figures de chaque parti), les
qualifier, les dédupliquer et les mettre à disposition de la pipeline d'ingestion de Loïc.

Ce n'est pas un pipeline n8n : c'est un **agent Claude** qui pilote une boîte à outils
déterministe (`harvest.py`) et garde son état dans le schéma `discovery` du projet Supabase
`dixipolis-dev` (org LGX Development). Le pipeline quotidien n8n (`/webhook/discover/political-videosV2`)
reste indépendant et inchangé.

## Où vit quoi

| Élément | Emplacement |
|---|---|
| Registre des personnes ciblées (55, tiers 1-2) | `discovery.persons` — lié à `public.persons` de Loïc par `person_id` |
| Registre des chaînes (246 : 193 abonnements + 68 déjà chez Loïc) | `discovery.channels` (kind : person / party / institution / media / other) |
| Vidéos trouvées, qualifiées, dédupliquées | `discovery.videos` (clé `youtube_video_id`) |
| Journal des passes et unités consommées | `discovery.harvest_runs`, `discovery.quota_ledger` |
| Sortie pour Loïc | vue `discovery.v_ready_for_ingestion` + fonction `discovery.export_to_public(n)` |
| Outils | `harvest.py` (stdlib Python, clé `YOUTUBE_API_KEY`) |

## Métadonnées conservées par vidéo

Tout ce que renvoie `videos.list` (`raw` jsonb) plus les colonnes typées utiles : titre, description,
tags, chaîne (id + titre), date de publication, durée en secondes, live/upcoming, langue audio,
catégorie, vues, likes, sous-titres, miniature. Côté qualification : personnes détectées
(`matched_person_ids`, ids `discovery.persons`), sources de la correspondance, score de pertinence
(0-1 : probabilité qu'une personne ciblée **parle** dans la vidéo), qui a scoré (`rule`, `llm:<modèle>`, `human`).

La description et les tags sont indispensables : la pipeline de Loïc (`resolve_video_speakers` →
`extract_candidates_from_metadata`) s'en sert pour identifier les locuteurs.

## Comment Loïc consomme

1. `select * from discovery.v_ready_for_ingestion;` — vidéos `relevant`, pas encore dans
   `public.youtube_videos`, colonnes alignées sur sa table (durée en secondes, tags joints par virgule,
   `public_channel_id` si la chaîne existe déjà, `matched_public_person_ids` = ids `public.persons`).
2. `select * from discovery.export_to_public(200);` — copie idempotente dans `public.youtube_videos`
   (+ création des chaînes manquantes dans `public.youtube_channels`), marque `ingested`.
   Son flow `process_video` prend ensuite le relais comme pour n'importe quelle vidéo.
3. `select discovery.sync_ingested();` — rapproche ce qu'il a ingéré par ailleurs (dédoublonnage).

## Cycle de vie d'une vidéo

`candidate` (trouvée, score de règle) → `relevant` (validée par le LLM ou l'humain, score ≥ seuil)
ou `rejected` (hors sujet, < 2 min, doublon) → `ingested` (présente chez Loïc, `public_video_id` renseigné).

## Stratégie de collecte (ordre = coût croissant)

Coûts YouTube Data API v3 : `playlistItems.list` 1 u / 50 vidéos · `videos.list` 1 u / 50 ids ·
`channels.list` 1 u · `search.list` **100 u**. Quota : 10 000 u / jour / projet Google Cloud.

1. **Chaîne perso** de chaque personne (`discovery.persons.youtube_channel_id`) : playlist d'uploads
   complète sur la fenêtre. Quasi gratuit, rappel maximal, `own_channel`.
2. **Chaînes de parti et institutions** (`kind in ('party','institution')`) : uploads sur la fenêtre,
   filtre par nom dans titre / description / tags.
3. **Médias prioritaires** (`kind = 'media' and priority = 1` : BFMTV, LCI, CNEWS, LCP, Public Sénat,
   France Inter, franceinfo, RTL, Europe 1, TF1 INFO, France 24, Le Figaro, Le Parisien…) : uploads
   sur la fenêtre, filtre par nom. C'est le gros du volume ; les chaînes à fort débit se paginent par
   tranches de mois pour rester dans le budget du jour.
4. **Autres médias** (`priority = 2`) : même chose, après les prioritaires.
5. **Recherche libre** (`search`, 100 u) : uniquement pour combler les trous — une requête par personne
   et par trimestre (« <nom> interview », « <nom> discours »), `maxResults=50`. Chaque chaîne inconnue
   qui remonte est ajoutée à `discovery.channels` (kind `media`, priority 3) et balayée ensuite par playlist.
6. **`videos.list`** sur tout ce qui a passé le filtre de nom : durée, tags, description complète, stats.
7. **Qualification** : score de règle (`own_channel` 0,9 · nom dans le titre 0,75 · description 0,5 ·
   tags 0,4), rejet < 2 min (règle alignée sur le quotidien). L'agent relit la bande 0,4-0,75 (et les
   alias ambigus : « Le Pen », « Roussel », « Philippe ») et tranche `relevant` / `rejected` avec une raison.

Règles de robustesse : chaque passe est journalisée dans `harvest_runs` avec sa fenêtre et ses unités ;
`channels.scanned_from/scanned_to` mémorise la couverture déjà faite, donc une passe interrompue reprend
là où elle s'est arrêtée ; jamais de doublon (`on conflict` sur `youtube_video_id`, fusion des
personnes détectées) ; un score LLM ou humain n'est jamais écrasé par un score de règle.

## Routine de l'agent (chaque jour, réveil planifié)

1. Lire `quota_ledger` du jour et `harvest_runs` en cours ; budget = 10 000 u − marge 500.
2. Reprise historique : avancer la fenêtre (mois par mois, du plus récent au plus ancien) sur les
   sources 1 → 4, dans la limite du budget. Puis la source 5 avec le reliquat.
3. Fenêtre glissante « hier » sur les sources 1 → 3 (tant que le cron quotidien de Loïc n'est pas
   rebranché, DIX-56, c'est aussi ce qui alimente le corpus au fil de l'eau).
4. `videos.list` + `match` + `to-sql`, application des upserts, relecture de la bande grise.
5. Mettre à jour `channels.scanned_*`, `harvest_runs`, `quota_ledger` ; résumé dans le journal.

Élargissement : passer `tier = 3` à `active = true` (figures secondaires), ajouter des chaînes
(régionales France 3 déjà présentes, presse quotidienne régionale, YouTubeurs politiques), reculer `from`.

## Fichiers

- `schema.sql` — copie des migrations appliquées (schéma, vue, fonctions).
- `seed_persons.sql`, `seed_channels.sql` — état initial des registres (13/09/2026).
- `subscriptions_2026-09-13.json` — les 193 abonnements du compte YouTube du pipeline quotidien
  (propriétaire : chaîne `UCzmA4tuxmbOyvNo-nW-vwdQ`).
- `harvest.py` — outils : `uploads`, `details`, `search`, `channel`, `match`, `to-sql`.

## À faire / points ouverts

- Clé `YOUTUBE_API_KEY` (nouveau projet Google Cloud → quota indépendant du pipeline quotidien).
- Chaînes perso à ajouter aux abonnements YouTube (pipeline quotidien) : Retailleau, Édouard Philippe
  (« Avec Édouard »), Fabien Roussel, Villepin, Xavier Bertrand, Bayrou (FB Direct), Bompard, Asselineau.
  Sans chaîne perso trouvée : Tondelier, Faure, Hollande, Bouamrane, Cazeneuve, Lecornu.
- `public.persons` (référentiel Loïc) ne contient ni François Hollande ni Mathilde Panot → à ajouter
  côté Loïc, sinon la speaker resolution ne peut pas leur attribuer de prise de parole.
- Le schéma `discovery` n'est pas exposé par l'API REST Supabase (seul `public` l'est) : l'accès se fait
  en SQL (SQLAlchemy côté Loïc, connecteur côté agent). À exposer dans les réglages API si besoin.

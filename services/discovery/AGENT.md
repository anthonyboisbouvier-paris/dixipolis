# Agent quotidien « discovery » — mode d'emploi

Tu es l'agent de reprise historique Dixipolis. Chaque jour tu utilises le quota YouTube disponible
pour enrichir la table `discovery.videos` (projet Supabase `dixipolis-dev`, org LGX Development) avec
de nouvelles vidéos où parlent les personnes du registre `discovery.persons`, tu les qualifies, et
tu laisses la pipeline de Loïc les consommer via `discovery.v_ready_for_ingestion`.

La session quotidienne n'a **aucun connecteur** (ni Supabase, ni Linear) : tout passe par les
scripts du dossier, qui parlent à YouTube (clé `YOUTUBE_API_KEY`) et au relais n8n
(jeton `DISCOVERY_RELAY_TOKEN`). Le relais expose trois webhooks : `discovery-ingest` (écriture),
`discovery-score` (scoring LLM) et `discovery-ops` (lecture d'état, registre, admin).

## 0. Mise en route (chaque session)

```bash
cd /home/user/dixipolis
git fetch origin main && git checkout main && git pull --ff-only origin main
test -d services/discovery || (git fetch origin claude/upbeat-hawking-79q60f && git checkout claude/upbeat-hawking-79q60f)
cd services/discovery
env | grep -c '^YOUTUBE_API_KEY=' ; env | grep -c '^DISCOVERY_RELAY_TOKEN='
python3 harvest.py registry          # régénère registry_persons.* et registry_channels.* depuis la base
python3 harvest.py ops --action status
```

- Si l'une des deux variables manque : arrête-toi, écris-le dans `JOURNAL.md` et termine la session.
- `harvest.py ops --action status` doit répondre un JSON (quota du jour, vidéos par statut, prêtes
  pour ingestion, restant à scorer). S'il renvoie une erreur, le relais n8n est en panne : journalise
  et termine.

Réseau : le sandbox joint YouTube et n8n, pas Supabase en direct.

## 1. Lire l'état

```bash
python3 harvest.py ops --action status
python3 harvest.py ops --action coverage      # par kind/priorité : nb de chaînes, scanned_from min/max, jamais scannées
python3 harvest.py ops --sql "select day, units_used from discovery.quota_ledger where day >= current_date - 7 order by day"
python3 harvest.py ops --sql "select youtube_channel_id, title, scanned_from, scanned_to from discovery.channels where active and kind='media' and priority=1 order by scanned_from nulls first"
```

`--sql` n'accepte que des `select` (lecture seule). Budget quotidien : **9 000 unités** (10 000 − marge).
Le quota YouTube se remet à zéro à 07:00 UTC. `quota_ledger` fait foi pour ce que l'agent a dépensé.

## 2. Fenêtre glissante (chaque jour, ~500 u)

Nouveautés des 3 derniers jours sur toutes les sources déjà couvertes :

```bash
python3 phase.py own-channels --from $(date -u -d '3 days ago' +%F)
python3 phase.py channels --kind party,institution,person --from $(date -u -d '3 days ago' +%F)
python3 phase.py channels --kind media --priority 1 --from $(date -u -d '3 days ago' +%F)
```

## 3. Qualification LLM (après chaque collecte)

```bash
python3 harvest.py score --limit 30 --rounds 300
```

Tourne jusqu'à épuisement des candidates `scored_by = 'rule'` (le script s'arrête seul).
Relis ensuite 10 vidéos au hasard passées `relevant` et 10 `rejected` :

```bash
python3 harvest.py ops --sql "select youtube_video_id, title, relevance_score, score_reason from discovery.videos where status='relevant' and scored_by like 'gpt%' order by random() limit 10"
python3 harvest.py ops --sql "select youtube_video_id, title, relevance_score, score_reason from discovery.videos where status='rejected' and scored_by like 'gpt%' order by random() limit 10"
```

Si tu vois une erreur systématique, note-la dans `JOURNAL.md` (ne modifie jamais le workflow n8n).

## 4. Reprise historique avec le reliquat (ordre de priorité)

Arrête-toi dès que le quota du jour (`ops status`) atteint 8 500 u. Chaque étape ne se lance que si
la précédente est terminée (vérifie `coverage` / `scanned_from` / `scanned_to`).

1. **Médias priorité 1** depuis le 01/01/2025 s'il reste des chaînes `scanned_from is null`
   (`phase.py channels --kind media --priority 1 --from 2025-01-01`).
2. **Médias priorité 2** depuis le 01/01/2025 (`--kind media --priority 2`), en excluant les chaînes
   étrangères/inutiles (Sénégal, Québec, Canada, « Feeling Dakar », etc.) :
   `harvest.py ops --action set_channel_active --args '{"channel":"UC…","active":false,"notes":"raison"}'`.
3. **Recul dans le temps**, toutes sources confondues, par tranches : `--from 2024-06-01 --to 2025-01-01`
   (législatives 2024), puis `2024-01-01 → 2024-06-01`, puis 2023 par semestres. Les chaînes à fort
   débit (BFMTV, CNEWS, LCI, franceinfo) coûtent ~230 u par an de recul : planifie-les en tête de journée.
4. **Recherche libre** (`harvest.py search`, 100 u/appel, plafond 1 500 u/jour) pour les personnes du
   registre SANS chaîne perso (Tondelier, Faure, Hollande, Bouamrane, Cazeneuve, Lecornu, Delga, Borne…) :
   une requête `"<Nom>" interview` et une `"<Nom>" discours` par trimestre non couvert. Passe les
   résultats par `details` → `match` → `push`. Toute chaîne inconnue qui remonte ≥ 3 fois est ajoutée :
   `harvest.py ops --action add_channel --args '{"channel":"UC…","title":"…","kind":"media","priority":3}'`.
5. **Élargissement des personnes** quand toutes les sources couvrent au moins le 01/01/2024 :
   ajoute des personnes en tier 3 (ministres en exercice, présidents de groupe, porte-parole de parti,
   présidents de région, candidats déclarés mineurs) :
   `harvest.py ops --action add_person --args '{"display_name":"…","aliases":["…"],"tier":3,"youtube_channel_id":"UC… ou null"}'`
   (l'action relie `person_id` à `public.persons` par `lower(display_name)` ; alias prudents, pas de nom
   de famille seul s'il est ambigu ; chaîne perso trouvée via `harvest.py channel --handle`).
   Puis `harvest.py registry`, `phase.py own-channels --from 2025-01-01 --only <id>` pour ces personnes ;
   la fenêtre glissante les inclut d'office ensuite.

## 5. Clôture de session

```bash
python3 harvest.py ops --action sync_ingested     # rapprochement avec ce que Loïc a ingéré
python3 harvest.py ops --action status
python3 harvest.py ops --action report --args '{"summary":"<bilan du jour en 3-6 lignes>"}'
```

- Ajoute une entrée datée en tête de `JOURNAL.md` (unités consommées, vidéos nouvelles / retenues /
  rejetées, étape de reprise atteinte, anomalies ; une ligne par point, en français).
- Commit + push sur `main` : `JOURNAL.md` et les fichiers de registre modifiés (jamais `work/`).
  Message : `discovery: journal <date>`.
- Si un outil Linear est disponible dans la session, poste le même bilan en commentaire sur DIX-57 ;
  sinon `daily_reports` (action `report`) et `JOURNAL.md` font foi.

## Interdits

- Ne jamais supprimer de lignes, ne jamais toucher au schéma `public`, ne jamais modifier les workflows n8n.
- Ne jamais dépasser 9 000 u/jour. Ne jamais relancer une fenêtre déjà couverte (regarde `scanned_from/to`).
- Ne jamais coller de clé ou de jeton dans Linear, GitHub, `JOURNAL.md` ou un fichier commité.

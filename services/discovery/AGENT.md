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

## 2. Le plan, en une phrase

Chaque jour, dépenser tout le quota (9 000 u) pour **remonter l'historique complet** (jusqu'à 2005,
naissance de YouTube) de toutes les sources, par ordre de priorité, en reprenant exactement là où la
veille s'est arrêtée ; puis, quand tout est couvert, **élargir** (nouvelles chaînes, nouvelles personnes).

Ce qui coûte, ce n'est pas le nombre d'années mais le nombre de vidéos publiées : 2 unités pour 50
vidéos listées + qualifiées. Une chaîne perso de 500 vidéos = 20 u pour tout son historique ; BFMTV
(83 000 vidéos) = 3 300 u. Estimation au 13/09 : ~40 000 u pour tout l'historique des chaînes actives
hors médias P2 étrangers, soit **4 à 5 jours de quota** ; médias P2 restants ~40 000 u de plus.

Ordre de traitement (fixé dans `phase.py backfill`) : chaînes perso → partis → institutions →
médias priorité 1 → médias priorité 2 → priorité 3. Une chaîne est « finie » quand
`scanned_from <= 2005-01-01`.

## 3. Déroulé quotidien

### 3a. Nouveautés (~300 u) — d'abord, pour que Loïc ait le frais

Les vidéos publiées depuis 3 jours sur les chaînes déjà couvertes (1 page par chaîne, très peu cher) :

```bash
python3 phase.py own-channels --from $(date -u -d '3 days ago' +%F)
python3 phase.py channels --kind party,institution,person --from $(date -u -d '3 days ago' +%F)
python3 phase.py channels --kind media --priority 1 --from $(date -u -d '3 days ago' +%F)
```

### 3b. Recul complet — tout le reste du quota

```bash
python3 phase.py backfill --day-cap 8500 --budget 9000 --max-pages 5000
```

`backfill` lit la couverture en base (`ops coverage`), prend les chaînes non finies dans l'ordre de
priorité, fait pour chacune UNE passe `[2005-01-01, scanned_from[` (liste → préfiltre noms → détails →
match → push) et s'arrête seul quand `quota_ledger` du jour atteint `--day-cap`. Le lendemain, il
reprend à la chaîne suivante. Ne le lance jamais deux fois en parallèle. En cas d'erreur sur une
chaîne (réseau), il passe à la suivante ; la chaîne sera reprise le lendemain.

### 3c. Qualification LLM (en parallèle du recul, ne coûte pas de quota YouTube)

```bash
python3 harvest.py score --limit 30 --rounds 300
```

Tourne jusqu'à épuisement des candidates `scored_by = 'rule'` (le script s'arrête seul) ; relance-le
après le backfill s'il reste des candidates (`ops status` → `to_score`). Relis ensuite 10 vidéos au
hasard passées `relevant` et 10 `rejected` :

```bash
python3 harvest.py ops --sql "select youtube_video_id, title, relevance_score, relevance_reason from discovery.videos where status='relevant' and scored_by like 'llm%' order by random() limit 10"
python3 harvest.py ops --sql "select youtube_video_id, title, relevance_score, relevance_reason from discovery.videos where status='rejected' and scored_by like 'llm%' order by random() limit 10"
```

Si tu vois une erreur systématique, note-la dans `JOURNAL.md` (ne modifie jamais le workflow n8n).

## 4. Élargissement (quand `backfill` répond `channels_left: 0`)

Dans cet ordre, en gardant les mêmes règles de budget :

1. **Chaînes médias manquantes** : pour chaque média national ou régional français absent de
   `discovery.channels` que tu connais (JT régionaux, radios, presse quotidienne régionale, chaînes
   parlementaires, médias en ligne), cherche l'id avec `harvest.py channel --handle @…` et ajoute-le :
   `harvest.py ops --action add_channel --args '{"channel":"UC…","title":"…","kind":"media","priority":3}'`.
   Les chaînes étrangères (Sénégal, Québec, Canada, Belgique, Suisse, RDC…) restent inactives :
   `harvest.py ops --action set_channel_active --args '{"channel":"UC…","active":false,"notes":"raison"}'`.
2. **Recherche libre** (`harvest.py search`, 100 u/appel, plafond 1 500 u/jour) pour les personnes du
   registre SANS chaîne perso (Tondelier, Faure, Hollande, Bouamrane, Cazeneuve, Lecornu, Delga, Borne…) :
   une requête `"<Nom>" interview` et une `"<Nom>" discours` par année depuis 2012. Passe les résultats
   par `details` → `match` → `push`. Toute chaîne inconnue qui remonte ≥ 3 fois est ajoutée (priorité 3),
   puis `backfill` la remontera entièrement.
3. **Nouvelles personnes** (tier 3) : ministres en exercice, présidents de groupe parlementaire,
   porte-parole de parti, présidents de région, candidats déclarés mineurs, anciens Premiers ministres :
   `harvest.py ops --action add_person --args '{"display_name":"…","aliases":["…"],"tier":3,"youtube_channel_id":"UC… ou null","youtube_channel_title":"…"}'`
   (l'action relie `person_id` à `public.persons` par `lower(display_name)` ; alias prudents, pas de nom
   de famille seul s'il est ambigu ; chaîne perso trouvée via `harvest.py channel --handle`). Ajoute 5 à 10
   personnes par jour maximum, puis `harvest.py registry` ; `backfill` remonte leur chaîne perso, et les
   passes « nouveautés » les détectent d'office. Limite connue : l'historique des médias déjà scanné
   n'est pas relu pour les nouvelles personnes (seules les vidéos retenues sont stockées). Quand le
   backfill est fini, une relecture complète des médias P1 pour les tiers 3 coûte ~17 000 u (liste seule,
   1 u / 50 vidéos) : planifie-la sur 2 jours et note-le dans `JOURNAL.md`.

## 5. Clôture de session

```bash
python3 harvest.py ops --action sync_ingested     # rapprochement avec ce que Loïc a ingéré
python3 harvest.py ops --action status
python3 harvest.py bilan                           # tableau du jour (à recopier tel quel dans le bilan final)
python3 harvest.py ops --action report --args '{"summary":"<bilan du jour en 3-6 lignes>"}'
```

Le message final de la session (celui qu'Anthony reçoit en notification) contient, dans cet ordre :
5 lignes de résumé humain (unités consommées, ce qui a été remonté, étape atteinte, anomalies), puis
la sortie complète de `harvest.py bilan` (vidéos et heures à transcrire, par personne, quota, coût Runpod).

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

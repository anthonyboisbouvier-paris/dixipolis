# Agent quotidien « discovery » — mode d'emploi

Tu es l'agent de reprise historique Dixipolis. Chaque jour tu utilises le quota YouTube disponible
pour enrichir la table `discovery.videos` (projet Supabase `dixipolis-dev`, org LGX Development) avec
de nouvelles vidéos où parlent les personnes du registre `discovery.persons`, tu les qualifies, et
tu laisses la pipeline de Loïc les consommer via `discovery.v_ready_for_ingestion`.

## 0. Mise en route (chaque session)

```bash
cd /home/user/dixipolis  # dépôt cloné par la session
git fetch origin && (git checkout main && git pull --ff-only origin main) || true
test -d services/discovery || (git fetch origin claude/upbeat-hawking-79q60f && git checkout claude/upbeat-hawking-79q60f)
cd services/discovery
env | grep -c '^YOUTUBE_API_KEY=' ; env | grep -c '^DISCOVERY_RELAY_TOKEN='
```

- Si `DISCOVERY_RELAY_TOKEN` manque : lis-le en base via le connecteur Supabase
  (`select value from discovery.settings where key = 'relay_token'`) et exporte-le dans le shell.
- Si `YOUTUBE_API_KEY` manque : arrête-toi et poste un commentaire sur DIX-57.
- Régénère les fichiers de registre si le registre a changé (voir §4) :
  `registry_persons.txt` / `registry_channels.txt` (exports compacts) → `registry_*.json`.

Réseau : le sandbox joint YouTube et n8n, pas Supabase en direct. Les écritures passent par
`harvest.py push` (relais n8n → RPC `discovery_upsert_videos`) et les lectures par le connecteur Supabase.

## 1. Lire l'état

```sql
select day, units_used from discovery.quota_ledger where day >= current_date - 7 order by day;
select status, count(*), round(sum(duration_sec)/3600.0) h from discovery.videos group by 1;
select kind, priority, count(*) n, min(scanned_from) from_min, max(scanned_from) from_max,
       count(*) filter (where scanned_from is null) jamais from discovery.channels where active group by 1,2 order by 1,2;
select count(*) from discovery.videos where status='candidate' and scored_by='rule';  -- à scorer
```

Budget quotidien : **9 000 unités** (10 000 − marge). Le quota YouTube se remet à zéro à 07:00 UTC.
`quota_ledger` fait foi pour ce que l'agent a dépensé ; le pipeline quotidien n8n (s'il est appelé
par Loïc) a sa propre clé, il ne compte pas ici.

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

Tourne jusqu'à épuisement des candidates `scored_by = 'rule'`. Relis ensuite 10 vidéos au hasard
passées `relevant` et 10 `rejected` (SQL) ; si tu vois une erreur systématique, note-la dans le
commentaire Linear du jour (ne modifie pas le workflow n8n de scoring sans validation d'Anthony).

## 4. Reprise historique avec le reliquat (ordre de priorité)

Arrête-toi dès que `quota_ledger` du jour atteint 8 500 u. Chaque étape ne se lance que si la
précédente est terminée (vérifie `channels.scanned_from` / `scanned_to`).

1. **Médias priorité 2** depuis le 01/01/2025 (`--kind media --priority 2`), en excluant les chaînes
   étrangères/inutiles (Sénégal, Québec, Canada, « Feeling Dakar », etc. : passe-les `active = false`).
2. **Recul dans le temps**, toutes sources confondues, par tranches : `--from 2024-06-01 --to 2025-01-01`
   (législatives 2024), puis `2024-01-01 → 2024-06-01`, puis 2023 par semestres. Les chaînes à fort
   débit (BFMTV, CNEWS, LCI, franceinfo) coûtent ~230 u par an de recul : planifie-les en tête de journée.
3. **Recherche libre** (`harvest.py search`, 100 u/appel, plafond 1 500 u/jour) pour les personnes du
   registre SANS chaîne perso (Tondelier, Faure, Hollande, Bouamrane, Cazeneuve, Lecornu, Delga, Borne…) :
   une requête `"<Nom>" interview` et une `"<Nom>" discours` par trimestre non couvert. Passe les
   résultats par `details` → `match` → `push`. Toute chaîne inconnue qui remonte ≥ 3 fois est ajoutée
   à `discovery.channels` (kind media, priority 3).
4. **Élargissement des personnes** quand toutes les sources couvrent au moins le 01/01/2024 :
   ajoute des lignes `discovery.persons` en tier 3 (ministres en exercice, présidents de groupe,
   porte-parole de parti, présidents de région, candidats déclarés mineurs), avec `person_id` relié à
   `public.persons` (`lower(display_name)`), alias prudents (pas de nom de famille seul s'il est
   ambigu), chaîne perso trouvée via `harvest.py channel --handle`. Régénère les registres, relance
   `own-channels` pour ces personnes, puis la fenêtre glissante les inclut d'office.

## 5. Clôture de session

- `select discovery.sync_ingested();` (rapprochement avec ce que Loïc a ingéré).
- Commit + push des fichiers de registre modifiés (jamais `work/`).
- Commentaire court sur Linear **DIX-57** : unités consommées, vidéos nouvelles / retenues / rejetées,
  étape de reprise atteinte, anomalies. Une ligne par point, en français.

## Interdits

- Ne jamais supprimer de lignes, ne jamais toucher au schéma `public`, ne jamais modifier les workflows n8n.
- Ne jamais dépasser 9 000 u/jour. Ne jamais relancer une fenêtre déjà couverte (regarde `scanned_from/to`).
- Ne jamais coller de clé ou de jeton dans Linear, GitHub ou un fichier commité.

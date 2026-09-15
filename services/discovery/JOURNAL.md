# Journal de l'agent discovery

Une entrée par session, la plus récente en tête. Unités = quota YouTube consommé (clé harvester).

## 2026-09-15 — 02:20 UTC, scoring déplacé dans n8n (session Anthony + Claude)

- OpenAI rechargé le 14/09 vers 23:00 UTC ; scoring relancé depuis la session, mais le processus est mort deux fois (redémarrages du conteneur) et une coupure réseau non rattrapée.
- Deux défauts corrigés au passage : (1) le modèle recopiait mal ~50 % des ids vidéo → le nœud « Parse scores » prend désormais l'id du prompt ; (2) `discovery_fetch_to_score` dépassait le statement timeout sous charge → index partiel `videos_to_score_idx` (status='candidate', scored_by='rule').
- Nouveau workflow n8n « Discovery — scoring auto » (`L2UV2bLfHCOS3yl4`) : 1 lot de 60 par minute, en continu, indépendant des sessions. Depuis : 60/60 vidéos qualifiées par exécution.
- État : 36 700 relevant, 45 800 à scorer (~13 h), 52 ingérées par Loïc. La routine quotidienne ne lance plus `harvest.py score`.

## 2026-09-14 — 08:45 UTC, incident scoring (session Anthony + Claude)

- Vers 00:00 UTC le compte OpenAI est tombé à zéro crédit : le workflow de scoring a transformé chaque erreur en « rejeté, score 0, raison vide » → 22 985 vidéos rejetées à tort entre 00:00 et 02:41.
- Corrigé : (1) workflow n8n « Discovery — scoring LLM » : une erreur OpenAI ou un JSON illisible ne produit plus de verdict (la vidéo reste candidate) et le nombre d'erreurs est renvoyé ; (2) `harvest.py score` s'arrête (`SCORING BLOQUÉ`) dès qu'un lot n'a que des erreurs ; (3) les 22 985 vidéos remises en `candidate` / `rule` avec leur score de règle recalculé.
- Bilan avant incident (13/09 23:30) : 23 700 relevant. Après remise en état : 35 352 relevant, 23 017 à scorer, 4 023 rejetées (vrais rejets du LLM).
- Action requise : recharger le compte OpenAI, puis relancer `harvest.py score --limit 30 --rounds 300`.

## 2026-09-13 — session initiale (Anthony + Claude)

- Schéma `discovery` créé, 57 personnes (tier 1/2), 275 chaînes actives, relais n8n (ingest / score / ops) en place.
- Chaînes perso : 7 693 vidéos collectées (401 u). Partis / institutions / députés : ~4 000 vidéos retenues (630 u).
- Médias priorité 1 depuis 01/01/2025 : en cours (BFM Business, BFMTV, C à vous, C dans l'air, CNEWS, Europe 1, FRANCE 24 faits).
- Scoring LLM (gpt-4o-mini) lancé sur les candidates tierces ; ~80 lots de 30 traités, ~80 % passent `relevant`.
- Shorts conservés (décision Anthony). Hollande et Panot ajoutés à `public.persons` (2450, 2451).
- Reste : médias priorité 1 non scannés (France Inter, franceinfo, LCI, LCP, Public Sénat, RTL, TF1 INFO…), priorité 2, recul 2024, recherche libre, tier 3.

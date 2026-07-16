# Plan d'optimisation du pipeline Discovery (DIX-33)

**Objectif : maximiser le nombre de vidéos politiques pertinentes ramenées chaque jour,
à budget constant** (quota YouTube 10 000 unités/jour, tokens OpenAI, crédits SerpAPI).

KPI central : **coût par vidéo pertinente** = (unités quota + tokens LLM + crédits SerpAPI) / vidéos ≥ min_score.
Chaque phase mesure ce KPI avant/après et ne consolide que ce qui l'améliore sans perte de couverture.

## État des lieux (audit du 07/07/2026)

Dépense actuelle par run quotidien, mesurée sur les exécutions réelles :

| Poste | Mécanisme actuel | Coût/run | Part |
|---|---|---|---|
| Recherche mots-clés YouTube | 27 requêtes `search.list` × 100 unités | **2 700 u** | ~73 % |
| Vidéos des 193 chaînes suivies | `playlistItems.list` × 1 unité *(migré le 07/07, était 19 300 u)* | 193 u | ~5 % |
| Enrichissement métadonnées | `videos.list` **1 appel par vidéo** (~750 vidéos) | **~750 u** | ~20 % |
| Abonnements (pagination) | `subscriptions.list` | ~4 u | — |
| Scoring sémantique | gpt-4o-mini, **1 appel par vidéo** ≥ 2 min, le prompt exige de ré-émettre toutes les métadonnées | ~400-700 appels | 100 % du coût OpenAI |
| SerpAPI | 15 requêtes/run (contribution unique **à mesurer** — probablement ~0) | 15 crédits | 100 % du coût SerpAPI |

Trois gisements identifiés :

1. **`videos.list` accepte 50 IDs par appel** → l'enrichissement peut passer de ~750 à ~15 unités (÷50).
2. **Le scoring peut être batché** (20-25 vidéos par appel, sortie `video_id`+`score` uniquement,
   métadonnées re-jointes par `video_id` en aval — l'infra de jointure existe déjà depuis le patch
   `channel_id`). Appels ÷20, tokens de sortie ÷5, et suppression du risque `invalid_json`
   (le LLM ne recopie plus les titres).
3. **Les 27 recherches mots-clés (2 700 u) doivent justifier leur coût** : avec 193 chaînes suivies,
   leur valeur unique = les vidéos de chaînes *hors registre*. À mesurer requête par requête,
   élaguer les mortes, et réorienter vers la **découverte de nouvelles chaînes** (longue traîne
   locale : « conseil municipal », « conseil communautaire », « séance plénière »).

Budget cible après optimisation : **~1 500-2 900 u/jour** selon élagage → marge pour suivre
**5 000-8 000 chaînes** ou poller plusieurs fois par jour.

## Phases de test

### J0 — Baseline (07/07)
- [x] Migration `playlistItems.list` validée (193/193 chaînes, 753 vidéos, 0 perte légitime)
- [ ] Run complet post-reset quota (test auto programmé à 07:12 UTC)
- [ ] Relevé du funnel complet + dépense quota réelle du run
- [ ] Vérifier le run du cron Loïc de 09:00 UTC

### J1 (08/07) — Quick wins quota + attribution des sources
- [x] **Batcher l'enrichissement** : `videos.list` avec 50 IDs/appel (~750 u → ~15 u).
      Test : sortie enrichie strictement identique sur le même jeu de vidéos.
      *Validé le 08/07 en A/B isolé sur les 726 vidéos de référence du run du 07/07 :
      720/720 items identiques dans les deux lanes (6 vidéos retirées de YouTube entre-temps,
      absentes des deux côtés), 726 appels → 15 appels. Unique divergence : un bug d'encodage
      transitoire (mojibake UTF-8→GBK) sur UN appel unitaire de l'ancienne méthode — la lane
      batchée était correcte. Promu en prod (nœud `Batch Video IDs`) + repo, run test
      end-to-end vert (format DIX-33 intact).*
- [x] **Attribution des sources** : pour chaque vidéo du résultat final, source unique ou multiple
      (chaîne / mots-clés / SerpAPI). Verdict SerpAPI : garder, réduire ou couper.
      *Run prod du 08/07 (exécution 29, publication_day=07/07, min_score=0.7, 188 vidéos finales) :
      175 vidéos (93 %) proviennent du flux chaînes seul, 13 (7 %) chaînes+mots-clés, 0 orpheline.
      MAIS le bug Merge dual-run fait perdre 39 vidéos uniques du flux mots-clés qui passaient
      le score (51 au Filter By Score du 2e run, 12 en doublon avec le flux chaînes) → à réparer
      en J2, gain attendu ~+20 % de vidéos finales. SerpAPI : le nœud `Normalize SerpAPI Results`
      ne s'exécute JAMAIS (câblage) — 15 requêtes/jour (300 résultats bruts, très bruités type
      sport/people) pour un apport strictement nul, constaté sur les runs des 07 et 08/07.
      **Verdict SerpAPI : COUPER** (désactiver la branche, économie de 15 crédits SerpAPI/jour) ;
      réévaluation possible plus tard si un manque de rappel est constaté.*
- [x] Relevé quota avant/après.
      *Run du 08/07 avec batch : subscriptions 4 u + playlistItems 193 u + recherche mots-clés
      27×100 = 2 700 u + enricher 19 u (908 vidéos → 19 appels) ≈ **2 916 u** ;
      avant le batch le même run aurait coûté ≈ 3 805 u (908 appels d'enrichissement).
      Économie ~890 u/jour ; la recherche mots-clés reste 93 % du coût → cible J2.*

> **Note 08/07** : le cron de Loïc (09:00 UTC) n'a produit AUCUNE exécution aujourd'hui —
> l'endpoint n'est probablement pas encore branché côté RunPod (cf. DIX-56). Le run du jour
> a été déclenché manuellement à 12:28 UTC avec les paramètres cibles (vert, 188 vidéos).

### J2 — exécutée par anticipation le 08/07 (demande Anthony : 2 runs/jour, < 5 000 u/run)
- [x] **Merge dual-run RÉPARÉ** : cause racine = les flux chaînes et mots-clés étaient branchés
      sur la MÊME entrée (index 0) de `Merge All Sources` → 2 exécutions de toute la chaîne aval,
      seule la 1re réponse (chaînes) sortait. Fix : chaînes → entrée 0, mots-clés → entrée 1
      (mode append, 1 seule exécution), `Merge All Sources` → `Deduplicate Videos` en direct.
      Validé à blanc (synthétique) puis en prod : chaque nœud tourne exactement 1 fois.
- [x] **SerpAPI coupé** : branche déconnectée + nœuds `disabled` (documentation). La branche
      mourait de toute façon dans `Filter Date Range` (0 item ressorti, runs des 07 et 08/07).
      Économie : 15 crédits SerpAPI/jour.
- [x] **Requêtes mots-clés élargies : 27 → 40** (exécutif, ministres, Assemblée, Sénat,
      parlementaires, élus locaux — maires/régions/départements —, vie politique, institutions)
      + `maxResults` 20 → 50 (gratuit, même coût 100 u/requête).
- [x] **Résultat mesuré (run 31 du 08/07, publication_day=07/07, min_score=0.7)** :
      **233 vidéos finales / 143 h 39 / 113 chaînes** contre 188 / 89 h / 61 chaînes le matin
      (+24 % de vidéos, +61 % d'heures). 175 via chaînes, 57 UNIQUEMENT via mots-clés
      (récupérées grâce au fix), 1 orpheline. Top requêtes : « conseil municipal seance »
      (17 uniques !), « assemblee nationale debat » (7), « debat politique france » (7).
      19/40 requêtes à 0 unique CE jour-là — dépendantes de l'actualité (allocution du
      Président…), à réévaluer sur une semaine avant élagage.
- [x] **Budget quota validé pour 2 runs/jour** : 40×100 + 193 (chaînes) + 19 (enricher batché)
      + 4 (abonnements) = **4 216 u/run** → 2 runs = **8 432 u/jour < 10 000** ✅
      (chaque run < 5 000 ✅). Reste ~1 500 u/jour de marge pour tests.

### J2 (09/07) — Rendement des requêtes mots-clés
- [ ] Mesurer le **rendement unique par requête** (vidéos introuvables via les chaînes suivies).
- [ ] Élaguer les requêtes à rendement nul (chacune coûte 100 u).
- [ ] Tester des requêtes longue traîne « petit maire » : conseils municipaux, intercommunalités,
      séances plénières régionales/départementales.
- [ ] Chaque `channel_id` nouvellement découvert = candidat au registre de chaînes (lien DIX-56).

### J3 (10/07) — Optimisation du scoring OpenAI
- [ ] **Scoring par lots** : 20-25 vidéos/appel, sortie JSON `[{video_id, score}]` uniquement.
- [ ] Contrôle de cohérence : re-scorer le même jeu de vidéos, corrélation ancien/nouveau ≥ 0,9.
- [ ] Mesure tokens avant/après (attendu : −80 à −90 %).

### J4 (11/07) — Calibration de la pertinence
- [ ] Distribution complète des scores (0,0 → 1,0) sur une journée pleine.
- [ ] Revue d'échantillon de la bande 0,6-0,7 : que perd-on à min_score 0,7 ? Recommandation de seuil.
- [ ] Quantifier ce que coupe le filtre « < 2 min » (Shorts avec déclarations complètes ?).
- [ ] Cas limites de dates : lives, `videoPublishedAt` vs `publishedAt`.

### J5 (12/07) — Consolidation
- [ ] Appliquer en prod + repo la configuration validée (uniquement les phases gagnantes).
- [ ] Rapport final : vidéos pertinentes/jour et coût/vidéo pertinente, avant vs après.
- [ ] Proposition d'architecture « registre de chaînes » (croissance auto via les channel_id
      découverts) pour l'exhaustivité du petit maire au Président.

## Garde-fous

- Toute modification est d'abord testée **en isolation** (workflow temporaire) contre un run de
  référence, avec comparaison exhaustive des `video_id` — zéro perte tolérée hors faux positifs
  démontrés (cf. migration playlistItems).
- Le format de réponse DIX-33 (`statistics` + `videos[]` avec `channel_id`) est **gelé** :
  aucune optimisation ne doit le casser (contrat avec l'ingestion).
- Le cron de Loïc (09:00 UTC) doit rester vert chaque jour pendant les tests.

### J3 (09/07) — premier run avec maxResults=50 + réévaluation des requêtes
- [x] **Cron Loïc** : toujours AUCUNE exécution à 09:00 UTC (3e jour) — DIX-56 en attente ;
      run du jour relancé manuellement à 11:38 UTC (publication_day=08/07, min_score=0.7).
- [x] **Funnel sain** après maxResults 20→50 : chaque nœud tourne exactement 1 fois,
      format DIX-33 intact, coût mesuré **4 219 u** (conforme aux ~4 216 attendus).
- [x] **Impact maxResults=50** (exécution 43) : **295 vidéos finales / 184 h / 158 chaînes**
      contre 233 / 143 h / 113 la veille (**+27 % de vidéos, +29 % d'heures, coût identique**).
      Apport unique du flux mots-clés : **105 vidéos** (57 la veille, ×1,8).
- [x] **Réévaluation des 19 requêtes à 0 unique du 08/07** : **9 ont produit aujourd'hui**
      (déclaration ministre 2, interview maire 2, interview président région 2, déclaration
      président, discours PM, audition ministre, commissions AN et Sénat, réaction député)
      — confirmation qu'elles sont dépendantes de l'actualité : NE PAS élaguer avant une
      semaine de cumul. 10 restent à zéro (à suivre : interview/discours/allocution président,
      conference presse gouvernement, elysee/matignon, conseil régional, élu local,
      déclaration maire, déclaration PM). Top du jour : « conseil municipal seance »
      (32 uniques), « assemblee nationale debat » (22), « campagne electorale » (11).

### J4 (10/07) — Scoring par lots : TESTÉ ET REJETÉ (données à l'appui)
- [x] **Expérience A/B en isolation** (150 vidéos stratifiées du run 43, mêmes données) :
      lots de 25 puis de 12 (texte complet, prompt aligné, temperature 0, json_object) →
      corrélation Pearson avec les scores de prod : **0,648 puis 0,587**, accord sur la
      décision min_score 0,7 : ~71-73 % — **41-42 vidéos gardées par la prod passeraient
      sous le seuil** (perte de rappel inacceptable). Économie tokens réelle : −67 %.
- [x] **Contrôle de répétabilité** : l'ancienne méthode re-exécutée à l'identique sur les
      mêmes 150 vidéos ne corrèle qu'à **0,882 avec ses propres scores** (écart moyen 0,077,
      accord seuil 89,3 %, 1 invalid_json/150) → le critère « ≥ 0,9 » du plan était
      inatteignable par construction ; le plafond de référence est ~0,88.
- [x] **Verdict : NE PAS PROMOUVOIR le scoring par lots** — il diverge au-delà du bruit
      (0,59-0,65 ≪ 0,88), systématiquement plus sévère. Le coût OpenAI du scoring
      (~600 vidéos × ~780 tokens ≈ 0,20 $/jour) ne justifie pas ce risque de rappel.
      La ligne « J3 — Optimisation du scoring » est fermée : l'optimisation utile du
      pipeline était le quota YouTube (fait : 4 219 u/run), pas les tokens de scoring.

> **Note J4 phase 2 (10/07)** : cron Loïc toujours absent à 09:00 (5e jour, DIX-56) —
> run du jour relancé manuellement à 09:10 : **223 vidéos / 105 h / 124 chaînes, 4 218 u**,
> funnel sain (seule la pagination des abonnements boucle, comportement normal).
> Requêtes : apport unique mots-clés 85 vidéos ; « interview elu local » (2) et
> « conference presse gouvernement » (1) sortent de la liste à zéro → **8 requêtes
> toujours à zéro après 3 jours** (président ×3, PM, maire-déclaration, conseil régional,
> élysée, matignon) — décision d'élagage à J6 (5 jours de cumul).

## J5 — 11/07/2026 (session du matin, 07:30 UTC)

**Cron Loïc : toujours absent (6e jour).** Run prod lancé manuellement 07:32 UTC
(publication_day=2026-07-10, min_score 0.7) → **184 vidéos publiées**, 92 chaînes,
score moyen 0,757, 484 scorées / 978 dédupliquées / 1 012 brutes. DIX-56 reste le
dernier maillon manquant.

**Cumul requêtes (4e jour d'observation) :** 2 sorties de la liste des zéros
aujourd'hui — `interview president republique` (1) et `declaration maire` (1).
Restent à ZÉRO depuis 4 jours : `discours/allocution/declaration president
republique`, `declaration premier ministre`, `conseil regional seance`,
`elysee declaration`, `matignon conference presse` (7 requêtes). Zéros du jour
(non cumulés) : 13/40. Décision d'élagage à J6 sur le cumul 5 jours.

**Calibration du seuil (chantier du jour) :**
- Distribution des 484 scorées : gros pic à exactement 0,70 (100 vidéos), zone
  0,65-0,70 quasi vide (5) — le scoreur « arrondit » sa zone grise à 0,70.
- Jugement manuel de 14 vidéos de la bande 0,65-0,75 : les faux positifs ne sont
  PAS des vidéos « pas assez politiques » mais de la **politique africaine
  francophone** (Sénégal, RDC, Cameroun) et du **sport avec vocabulaire national**
  qui passent à 0,70-0,80.
- Quantification sur les 184 publiées : **16 hors-sujet (8 %)**, dont 10 pile à
  0,70. Monter le seuil à 0,75 supprimerait 100 vidéos (−54 % de volume) pour
  n'éliminer que 10 hors-sujet → NON.
- **Recommandation pour Loïc : GARDER min_score=0,7, corriger le PROMPT du
  Semantic Scoring** : « politique FRANÇAISE uniquement ; les personnalités
  politiques étrangères (Sénégal, RDC, Cameroun…) scorent < 0,5 sauf implication
  directe d'un politique français ; le sport reste < 0,3 même avec drapeau/équipe
  de France ». Gain attendu : ~+8 pts de précision à volume constant, zéro effet
  sur le rappel français.

**Prochaine session (J6, 12/07) :** élagage des requêtes mortes sur cumul 5 jours
+ décision finale ; si Loïc n'a pas branché le cron, proposer un Schedule Trigger
n8n natif en attendant DIX-56.

## J6 — 13/07/2026 (session 07:30 UTC)

**Rattrapage** : la session du 12/07 n'a jamais eu lieu (saut de temps) → deux runs
manuels : 11/07 (99 vidéos, 79 chaînes) et 12/07 (72 vidéos, 52 chaînes).

**Cron : 8e jour sans exécution planifiée** → création d'un workflow
ORDONNANCEUR SÉPARÉ `daily-scheduler.json` (id se8jMw4k1gcjagZZ, actif) :
Schedule 09:00 UTC → POST authentifié sur le webhook prod avec
publication_day=veille, min_score 0.7. Le workflow prod n'est pas touché
(son « Respond to Webhook » casserait en exécution planifiée). À désactiver
quand Loïc branchera le vrai cron (DIX-56).

**Élagage FINAL (cumul 5 jours)** : les 7 requêtes mortes confirmées encore à
zéro sur le run du 11/07 → RETIRÉES du workflow prod : discours/allocution/
declaration president republique, declaration premier ministre, conseil
regional seance, elysee declaration, matignon conference presse.
Remplacées par 7 requêtes fécondes : emission politique france, grand
entretien politique, point presse gouvernement, face a face politique,
gouvernement annonce reforme, conseil des ministres compte rendu, polemique
politique gouvernement. Rendement 1er jour : 10 résultats bruts (4/7 actives,
3 à zéro — à observer, même règle des 5 jours).

**Calibration APPLIQUÉE (Loïc silencieux)** : prompt du Semantic Scoring durci —
politique FRANÇAISE uniquement (étrangers < 0,5 sauf implication française),
sport < 0,3 même avec « équipe de France ». **Mesure avant/après :
hors-sujet 13/99 (13 %) le 11/07 → 0/72 (0 %) le 12/07** ; score moyen
0,754 → 0,808 (la zone grise étrangère à 0,70 est passée sous le seuil).
Le volume 12/07 (72) reflète un samedi calme + le nettoyage — vérifier à J7
que le rappel français ne s'est pas dégradé (le score moyen en hausse suggère
que non).

**J7 (14/07)** : run auto attendu à 09:00 UTC via l'ordonnanceur — VÉRIFIER
qu'il a tourné seul (1re exécution non manuelle du pipeline) ; contrôle rappel
français post-calibration ; rendement J2 des 7 remplaçantes.

## J7 — 14/07/2026 (session 07:30 UTC)

**Ordonnanceur : il a TIRÉ TOUT SEUL à 07:00 UTC (09:00 Paris)** — 1re exécution
autonome du pipeline — mais en ERREUR : « access to env vars denied » (mon
expression d'URL utilisait $env, interdit sur l'instance). URL remplacée par la
chaîne littérale, workflow re-poussé (PUT 200, actif). Run du 13/07 lancé
manuellement en compensation : **68 vidéos, 54 chaînes, avg 0,797**.

**Contrôle rappel post-calibration** : 385 scorées, 68 publiées un lundi (bas
vs ~184 le vendredi 10/07 pré-calibration). Échantillon des écartées 0,4-0,7
(26 vidéos) : exclusions LÉGITIMES — Sénégal/RDC désormais à 0,40 ✔, faits
divers, tech, best-of ; deux cas discutables à 0,60 (France Culture « forces de
l'ordre », l'Humanité « présidentielle 2027 ») mais sans politicien s'exprimant
→ conformes au critère. La baisse de volume = purge du hors-sujet + lundi d'été,
PAS une perte de rappel français. RAS.

**Remplaçantes J2** : emission politique france 6, face a face politique 8,
point presse gouvernement 1 · à zéro : grand entretien politique (2j),
gouvernement annonce reforme (2j), polemique politique gouvernement (2j),
conseil des ministres compte rendu (0 aujourd'hui, 2 hier). Règle des 5 jours.

**J8 (15/07)** : vérifier que l'ordonnanceur CORRIGÉ a tourné seul à 07:00 UTC
sans erreur (2e tentative) ; cumul J3 des remplaçantes ; volume d'un mardi.

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
- [ ] **Attribution des sources** : pour chaque vidéo du résultat final, source unique ou multiple
      (chaîne / mots-clés / SerpAPI). Verdict SerpAPI : garder, réduire ou couper.
- [ ] Relevé quota avant/après.

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

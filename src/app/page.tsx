/* =============================================================================
 * app/page.tsx
 *
 * Page d'accueil Dixipolis — 100 % données réelles.
 * Les statistiques globales (app_global_stats) et l'aperçu de recherche
 * (app_search_transcripts) sont récupérés côté serveur via le helper RPC
 * puis passés en props aux sections.
 *
 * Parcours de conversion :
 *   1. Hero — promesse + pipeline visuel + chiffres réels
 *   2. Stats — fond sombre, chiffres réels du corpus
 *   3. LivePreview — exemples réels tirés du corpus (masqué si pas de données)
 *   4. Features — 4 modules UX-oriented
 *   5. HowItWorks — 3 cas d'usage concrets
 *   6. SocialProof — personas + le corpus en chiffres
 *   7. CTA — conversion finale
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import LivePreview from "@/components/home/LivePreview";
import FeatureCards from "@/components/home/FeatureCards";
import HowItWorks from "@/components/home/HowItWorks";
import SocialProof from "@/components/home/SocialProof";
import CTASection from "@/components/home/CTASection";
import { rpc } from "@/lib/supabase-server";
import type { GlobalStats, TranscriptSearchResponse } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
export default async function Home() {
  /* Données réelles : stats globales + 2 extraits pour l'aperçu */
  const [stats, preview] = await Promise.all([
    rpc<GlobalStats>("app_global_stats"),
    rpc<TranscriptSearchResponse>("app_search_transcripts", {
      p_query: "pouvoir d'achat",
      p_person_id: null,
      p_from: null,
      p_to: null,
      p_limit: 2,
    }),
  ]);

  const previewResults = preview?.results?.slice(0, 2) ?? [];

  return (
    <>
      {/* 1 — Hero : "Chaque mot prononcé, transcrit et cherchable" + pipeline */}
      <HeroSection stats={stats} />

      {/* 2 — Stats : fond sombre, 6 chiffres réels */}
      <StatsSection stats={stats} />

      {/* 3 — Aperçu réel : extraits du corpus (masqué si pas de données) */}
      <LivePreview results={previewResults} query="pouvoir d'achat" />

      {/* 4 — Features : 4 modules (interroger, explorer, vérifier, API) */}
      <FeatureCards nSegments={stats?.n_segments ?? null} />

      {/* 5 — Cas d'usage : 3 scénarios concrets */}
      <HowItWorks />

      {/* 6 — Preuve sociale : personas + le corpus en chiffres */}
      <SocialProof stats={stats} />

      {/* 7 — CTA final : le vrai chiffre du corpus */}
      <CTASection nSegments={stats?.n_segments ?? null} />
    </>
  );
}

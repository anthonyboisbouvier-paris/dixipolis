/* =============================================================================
 * app/page.tsx
 *
 * Page d'accueil Dixipolis.
 * Parcours de conversion :
 *   1. Hero — promesse + pipeline visuel + chiffres
 *   2. Stats — fond sombre, chiffres lumineux (crédibilité)
 *   3. LivePreview — "Voyez par vous-même" (résultat concret)
 *   4. Features — 4 modules UX-oriented
 *   5. HowItWorks — 3 cas d'usage concrets
 *   6. SocialProof — personas + témoignages
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

/* -------------------------------------------------------------------------- */
export default function Home() {
  return (
    <>
      {/* 1 — Hero : "Chaque mot prononcé, transcrit et cherchable" + pipeline */}
      <HeroSection />

      {/* 2 — Stats : fond sombre, 6 chiffres lumineux */}
      <StatsSection />

      {/* 3 — Aperçu live : résultat concret pour rendre le produit tangible */}
      <LivePreview />

      {/* 4 — Features : 4 modules (interroger, explorer, vérifier, API) */}
      <FeatureCards />

      {/* 5 — Cas d'usage : 3 scénarios concrets */}
      <HowItWorks />

      {/* 6 — Preuve sociale : personas + témoignages */}
      <SocialProof />

      {/* 7 — CTA final : "45 000 discours vous attendent" */}
      <CTASection />
    </>
  );
}

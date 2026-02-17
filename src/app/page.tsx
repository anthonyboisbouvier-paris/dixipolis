/* =============================================================================
 * app/page.tsx
 *
 * Page d'accueil Dixipolis.
 * Parcours : accroche data-first > features > chiffres > cas d'usage > CTA.
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import StatsSection from "@/components/home/StatsSection";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

/* -------------------------------------------------------------------------- */
export default function Home() {
  return (
    <>
      {/* 1 — Hero : "Chaque mot prononcé, transcrit et cherchable" + pipeline */}
      <HeroSection />

      {/* 2 — Stats : fond sombre, chiffres lumineux (la base en chiffres) */}
      <StatsSection />

      {/* 3 — Features : 4 modules UX-oriented (interroger, explorer, vérifier, API) */}
      <FeatureCards />

      {/* 4 — Cas d'usage : 3 scénarios concrets avec exemples */}
      <HowItWorks />

      {/* 5 — CTA final : "45 000 discours vous attendent" */}
      <CTASection />
    </>
  );
}

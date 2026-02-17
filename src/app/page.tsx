/* =============================================================================
 * app/page.tsx
 *
 * Page d'accueil de l'application Dixipolis.
 * Composant serveur (Server Component) qui importe et assemble toutes les
 * sections de la page d'accueil dans l'ordre de defilement.
 *
 * Structure de la page :
 *   1. HeroSection    — Titre, sous-titre et CTA principal
 *   2. FeatureCards   — Grille des 4 fonctionnalites (Prompt, Analytique, Contenu, API)
 *   3. StatsSection   — Chiffres cles de la plateforme
 *   4. HowItWorks     — 3 etapes du processus utilisateur
 *   5. CTASection     — Appel a l'action final
 *
 * Chaque section est un composant autonome avec son propre style et contenu.
 * L'ordre est choisi pour guider le visiteur dans un parcours de decouverte :
 * accroche > fonctionnalites > credibilite > comprehension > conversion.
 * ============================================================================= */

import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import StatsSection from "@/components/home/StatsSection";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

/* --------------------------------------------------------------------------
 * Home — Composant de page principal
 *
 * Ce composant est le point d'entree de la route "/" (racine).
 * Il n'a pas de logique propre : il se contente d'orchestrer l'affichage
 * des sections dans l'ordre de defilement.
 *
 * Note : le <main> semantique est deja fourni par le layout racine
 * (app/layout.tsx). On utilise donc un Fragment React (<>) ici
 * pour eviter un <main> imbrique invalide en HTML.
 * -------------------------------------------------------------------------- */
export default function Home() {
  return (
    <>
      {/* Section 1 — Hero : accroche visuelle et proposition de valeur */}
      <HeroSection />

      {/* Section 2 — Fonctionnalites : les 4 outils de la plateforme */}
      <FeatureCards />

      {/* Section 3 — Statistiques : chiffres cles pour la credibilite */}
      <StatsSection />

      {/* Section 4 — Comment ca marche : processus en 3 etapes */}
      <HowItWorks />

      {/* Section 5 — CTA final : conversion du visiteur */}
      <CTASection />
    </>
  );
}

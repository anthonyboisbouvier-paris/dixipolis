/* =============================================================================
 * app/contenu/page.tsx
 *
 * Page "Contenu" de l'application Dixipolis.
 *
 * Cette page affiche l'ensemble des contenus generes par l'IA de la plateforme :
 * articles d'analyse, newsletters hebdomadaires, syntheses thematiques et
 * alertes sur l'actualite politique francaise.
 *
 * Architecture de la page :
 *   1. PageWrapper   : enveloppe commune a toutes les pages (centrage, padding)
 *   2. En-tete       : titre "Contenu" et sous-titre descriptif
 *   3. FeaturedContent : carte hero du contenu vedette (a la une)
 *   4. ContentGrid   : grille filtrable de tous les contenus generes
 *
 * Metadonnees SEO :
 *   - Titre : "Contenu | Dixipolis"
 *   - Description optimisee pour le referencement en francais
 *
 * Composant serveur (Server Component) par defaut dans Next.js 15+.
 * Les sous-composants interactifs (ContentGrid, ContentFilter) utilisent
 * "use client" individuellement.
 * ============================================================================= */

import type { Metadata } from "next";
import { Shield } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import FeaturedContent from "@/components/contenu/FeaturedContent";
import ContentGrid from "@/components/contenu/ContentGrid";

/* --------------------------------------------------------------------------
 * Metadonnees SEO de la page
 *
 * Exportees en tant que constante pour que Next.js les injecte
 * automatiquement dans le <head> de la page.
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "V\u00e9rification & Contenu | Dixipolis",
  description:
    "Fact-checking automatis\u00e9, d\u00e9tection de propagande, analyse \u00e9motionnelle et alertes g\u00e9n\u00e9r\u00e9s par l'IA Dixipolis sur le discours politique fran\u00e7ais.",
};

/* --------------------------------------------------------------------------
 * ContenuPage — Composant principal de la page
 *
 * Structure visuelle :
 *   - Fond gris clair (herite de body via globals.css)
 *   - Cartes blanches pour chaque section de contenu
 *   - Espacement vertical genereux entre les sections
 *
 * La page est composee de sections semantiques <section> pour
 * une meilleure accessibilite et un bon referencement.
 * -------------------------------------------------------------------------- */
export default function ContenuPage() {
  return (
    <PageWrapper className="py-8 sm:py-12">
      {/* ================================================================
       * EN-TETE DE PAGE
       *
       * Affiche le titre principal et le sous-titre descriptif.
       * L'icone "journal" (Newspaper) renforce visuellement la nature
       * editoriale de cette section de la plateforme.
       * ================================================================ */}
      <section className="mb-8 sm:mb-10" aria-label="Pr\u00e9sentation de la page V\u00e9rification">
        {/* Badge contextuel */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
          <Shield className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
          V&eacute;rification IA
        </div>

        {/* Titre */}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          V&eacute;rification &amp; Contenu
        </h1>

        {/* Sous-titre */}
        <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Fact-checking automatis&eacute;, d&eacute;tection de propagande, analyse
          &eacute;motionnelle et alertes de toxicit&eacute; &mdash; tout g&eacute;n&eacute;r&eacute;
          automatiquement par l&apos;IA Dixipolis.
        </p>
      </section>

      {/* ================================================================
       * CONTENU VEDETTE (A LA UNE)
       *
       * Carte hero affichant le contenu le plus recent ou le plus pertinent.
       * Se distingue des cartes de la grille par sa taille plus grande,
       * son degrade bleu a gauche et son resume complet.
       * ================================================================ */}
      <FeaturedContent />

      {/* ================================================================
       * GRILLE DE CONTENUS FILTRABLES
       *
       * Integre la barre de filtrage (ContentFilter) et la grille
       * responsive de cartes (ContentCard). Le filtrage par type et
       * par mot-cle est gere cote client via useState et useMemo.
       * ================================================================ */}
      <ContentGrid />
    </PageWrapper>
  );
}

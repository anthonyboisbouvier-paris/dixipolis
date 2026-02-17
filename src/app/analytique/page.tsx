/* =============================================================================
 * app/analytique/page.tsx
 *
 * Page Analytique — Tableau de bord principal de Dixipolis.
 *
 * Cette page presente une vue d'ensemble des donnees de la plateforme
 * sous forme de tableau de bord (dashboard) avec plusieurs sections :
 *
 *   1. En-tete de page : titre "Analytique" et sous-titre descriptif
 *   2. FilterBar : barre de filtres interactifs (periode, parti, theme)
 *   3. StatsOverview : 4 cartes statistiques en ligne (pleine largeur)
 *   4. ThemeBarChart + TopPoliticians : deux panneaux cote a cote
 *   5. ActivityTimeline : chronologie des activites recentes (pleine largeur)
 *
 * Metadata Next.js :
 *   - Titre et description optimises pour le SEO
 *   - Exportes en tant que constantes statiques (pas de generateMetadata)
 *
 * Architecture :
 *   - La page est un Server Component par defaut
 *   - Les composants interactifs (FilterBar, ThemeBarChart) sont marques "use client"
 *   - Les composants de donnees pures (StatsOverview, TopPoliticians, ActivityTimeline)
 *     sont des Server Components
 *   - PageWrapper fournit le conteneur centre avec padding pour le header fixe
 * ============================================================================= */

import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterBar from "@/components/analytique/FilterBar";
import StatsOverview from "@/components/analytique/StatsOverview";
import ThemeBarChart from "@/components/analytique/ThemeBarChart";
import TopPoliticians from "@/components/analytique/TopPoliticians";
import ActivityTimeline from "@/components/analytique/ActivityTimeline";

/* --------------------------------------------------------------------------
 * Metadata SEO pour la page Analytique
 * Utilisee par Next.js pour generer les balises <title> et <meta description>.
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Analytique | Dixipolis",
  description:
    "Tableau de bord analytique Dixipolis : statistiques, th&egrave;mes politiques, classement des politiciens et chronologie des activit&eacute;s.",
};

/* --------------------------------------------------------------------------
 * AnalytiquePage — Page principale du tableau de bord
 *
 * Disposition (layout) :
 *   - Pleine largeur : en-tete, filtres, statistiques, timeline
 *   - Grille 2 colonnes (lg) : graphique des themes + classement politiciens
 *   - Responsive : tout passe en colonne unique sur mobile
 * -------------------------------------------------------------------------- */
export default function AnalytiquePage() {
  return (
    <PageWrapper className="py-8">
      {/* ================================================================
       * SECTION 1 : En-tete de la page
       * Titre principal et sous-titre descriptif.
       * ================================================================ */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Analytique
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Vue d&apos;ensemble des donn&eacute;es politiques analys&eacute;es par Dixipolis.
          Explorez les tendances, les th&egrave;mes dominants et l&apos;activit&eacute;
          des personnalit&eacute;s politiques.
        </p>
      </div>

      {/* ================================================================
       * SECTION 2 : Barre de filtres
       * Composant client interactif avec selection de periode, parti et theme.
       * ================================================================ */}
      <div className="mb-6">
        <FilterBar />
      </div>

      {/* ================================================================
       * SECTION 3 : Cartes statistiques (pleine largeur)
       * 4 cartes affichant les metriques cles de la plateforme.
       * ================================================================ */}
      <div className="mb-6">
        <StatsOverview />
      </div>

      {/* ================================================================
       * SECTION 4 : Graphique des themes + Classement des politiciens
       * Disposition en grille : 2 colonnes sur grands ecrans,
       * 1 colonne sur mobile et tablette.
       * Le graphique des themes prend legerement plus de place (7/12)
       * que le classement des politiciens (5/12) pour equilibrer visuellement.
       * ================================================================ */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* -- Graphique a barres des themes (7 colonnes sur lg) -- */}
        <div className="lg:col-span-7">
          <ThemeBarChart />
        </div>

        {/* -- Classement des politiciens (5 colonnes sur lg) -- */}
        <div className="lg:col-span-5">
          <TopPoliticians />
        </div>
      </div>

      {/* ================================================================
       * SECTION 5 : Chronologie des activites recentes (pleine largeur)
       * Timeline verticale des derniers evenements politiques indexes.
       * ================================================================ */}
      <div>
        <ActivityTimeline />
      </div>
    </PageWrapper>
  );
}

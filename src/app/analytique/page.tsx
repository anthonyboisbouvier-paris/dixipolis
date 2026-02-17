/* =============================================================================
 * app/analytique/page.tsx
 *
 * Page Analytique — Dashboard complet Dixipolis.
 * Mise a jour avec les vraies metriques des tickets Linear :
 *   - 6 KPI (discours, politiciens, heures, fact-checks, propagande, toxicite)
 *   - Themes les plus abordes (barres visuelles)
 *   - Top politiciens par activite
 *   - Matrice de distance ideologique entre partis (DIX-31)
 *   - Mots sur-representes par politicien / word cloud (DIX-15)
 *   - Timeline d'activite
 *
 * Composant serveur (Server Component) — pas de "use client".
 * ============================================================================= */

import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import FilterBar from "@/components/analytique/FilterBar";
import StatsOverview from "@/components/analytique/StatsOverview";
import ThemeBarChart from "@/components/analytique/ThemeBarChart";
import TopPoliticians from "@/components/analytique/TopPoliticians";
import IdeologicalMatrix from "@/components/analytique/IdeologicalMatrix";
import WordCloudPreview from "@/components/analytique/WordCloudPreview";
import ActivityTimeline from "@/components/analytique/ActivityTimeline";

/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Analytique | Dixipolis",
  description:
    "Dashboard analytique Dixipolis : KPI discursifs, fact-checking, propagande, distance id\u00e9ologique et mots sur-repr\u00e9sent\u00e9s par politicien.",
};

/* -------------------------------------------------------------------------- */
export default function AnalytiquePage() {
  return (
    <PageWrapper className="py-8">
      {/* En-tete */}
      <section className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
          <BarChart3 className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
          Dashboard
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Analytique
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Vue d&apos;ensemble des m&eacute;triques discursives, fact-checking,
          propagande et distance id&eacute;ologique du corpus Dixipolis.
        </p>
      </section>

      {/* Filtres */}
      <div className="mb-6">
        <FilterBar />
      </div>

      {/* 6 KPI */}
      <div className="mb-6">
        <StatsOverview />
      </div>

      {/* Themes + Top Politiciens */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ThemeBarChart />
        </div>
        <div className="lg:col-span-5">
          <TopPoliticians />
        </div>
      </div>

      {/* Matrice ideologique + Word Cloud */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IdeologicalMatrix />
        <WordCloudPreview />
      </div>

      {/* Timeline */}
      <div>
        <ActivityTimeline />
      </div>
    </PageWrapper>
  );
}

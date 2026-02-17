/* =============================================================================
 * app/analytique/page.tsx
 *
 * Page Analytique — Dashboard complet Dixipolis.
 * Layout amélioré : header immersif, sections nommées, meilleur spacing.
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import type { Metadata } from "next";
import { BarChart3, TrendingUp, GitCompare, Activity } from "lucide-react";
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
      {/* En-tête immersif */}
      <section className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
          <BarChart3 className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
          Dashboard en temps r&eacute;el
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Analytique
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Explorez 45&nbsp;000+ discours politiques &mdash; th&egrave;mes, tendances,
          proximit&eacute; id&eacute;ologique et mots distinctifs de chaque politicien.
        </p>
      </section>

      {/* Filtres */}
      <div className="mb-6">
        <FilterBar />
      </div>

      {/* ── Section 1 : KPI ──────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel icon={<TrendingUp className="h-3.5 w-3.5" />} label="Indicateurs cl\u00e9s" />
        <StatsOverview />
      </div>

      {/* ── Section 2 : Thèmes + Top Politiciens ─────────────────────── */}
      <div className="mb-8">
        <SectionLabel icon={<BarChart3 className="h-3.5 w-3.5" />} label="Th\u00e8mes &amp; Classement" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ThemeBarChart />
          </div>
          <div className="lg:col-span-5">
            <TopPoliticians />
          </div>
        </div>
      </div>

      {/* ── Section 3 : Idéologie + Mots ─────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel icon={<GitCompare className="h-3.5 w-3.5" />} label="Analyse linguistique" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IdeologicalMatrix />
          <WordCloudPreview />
        </div>
      </div>

      {/* ── Section 4 : Timeline ──────────────────────────────────────── */}
      <div>
        <SectionLabel icon={<Activity className="h-3.5 w-3.5" />} label="Activit\u00e9 r\u00e9cente" />
        <ActivityTimeline />
      </div>
    </PageWrapper>
  );
}

/* --------------------------------------------------------------------------
 * SectionLabel — petit label au-dessus de chaque section du dashboard
 * -------------------------------------------------------------------------- */
function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span style={{ color: "var(--color-primary)" }}>{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <div className="flex-1 border-t" style={{ borderColor: "var(--color-border)" }} />
    </div>
  );
}

/* =============================================================================
 * components/analytique/PoliticianSpotlight.tsx
 *
 * Fiche détaillée d'un politicien avec KPI personnels.
 * Composant Client — sélecteur de politicien interactif.
 *
 * Affiche pour le politicien sélectionné :
 *   - Nombre de discours, heures de parole, thèmes principaux
 *   - Score de toxicité moyen, débit de parole, vocabulaire
 *   - Mini bar chart des thèmes du politicien
 *   - Dernières citations marquantes
 * ============================================================================= */

"use client";

import { useState } from "react";
import { User, Clock, FileText, Flame, MessageSquare, Zap, TrendingUp, ChevronDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { MOCK_POLITICIANS } from "@/lib/constants";

/* --------------------------------------------------------------------------
 * Mock des données individuelles par politicien (sera remplacé par l'API)
 * -------------------------------------------------------------------------- */
interface PoliticianStats {
  speechCount: number;
  totalHours: number;
  avgWordsPerMin: number;
  vocabularyDiversity: number;
  avgToxicity: number;
  factChecks: number;
  topThemes: { theme: string; percent: number; color: string }[];
  recentQuotes: { text: string; date: string; context: string }[];
}

const POLITICIAN_DATA: Record<string, PoliticianStats> = {
  "emmanuel-macron": {
    speechCount: 1245,
    totalHours: 892,
    avgWordsPerMin: 168,
    vocabularyDiversity: 0.74,
    avgToxicity: 0.18,
    factChecks: 287,
    topThemes: [
      { theme: "\u00c9conomie", percent: 28, color: "#2563eb" },
      { theme: "Europe", percent: 22, color: "#6366f1" },
      { theme: "R\u00e9formes", percent: 18, color: "#10b981" },
      { theme: "D\u00e9fense", percent: 15, color: "#f59e0b" },
      { theme: "\u00c9cologie", percent: 10, color: "#16a34a" },
    ],
    recentQuotes: [
      { text: "Nous devons r\u00e9industrialiser la France, c\u2019est un combat de long terme.", date: "15 jan. 2025", context: "Visite d\u2019usine, Nord" },
      { text: "L\u2019Europe est notre force, ne la br\u00fb lons pas.", date: "9 jan. 2025", context: "Conseil europ\u00e9en" },
    ],
  },
  "marine-le-pen": {
    speechCount: 987,
    totalHours: 654,
    avgWordsPerMin: 152,
    vocabularyDiversity: 0.61,
    avgToxicity: 0.42,
    factChecks: 198,
    topThemes: [
      { theme: "Immigration", percent: 32, color: "#ef4444" },
      { theme: "S\u00e9curit\u00e9", percent: 24, color: "#f59e0b" },
      { theme: "Souverainet\u00e9", percent: 20, color: "#8b5cf6" },
      { theme: "Pouvoir d\u2019achat", percent: 14, color: "#10b981" },
      { theme: "\u00c9conomie", percent: 8, color: "#2563eb" },
    ],
    recentQuotes: [
      { text: "Les Fran\u00e7ais en ont assez de l\u2019insecurity, ils veulent des actes.", date: "14 jan. 2025", context: "Assembl\u00e9e nationale" },
      { text: "Notre immigration est hors de contr\u00f4le depuis des ann\u00e9es.", date: "10 jan. 2025", context: "Interview BFM" },
    ],
  },
  "jean-luc-melenchon": {
    speechCount: 876,
    totalHours: 721,
    avgWordsPerMin: 185,
    vocabularyDiversity: 0.79,
    factChecks: 156,
    avgToxicity: 0.38,
    topThemes: [
      { theme: "Social", percent: 30, color: "#ef4444" },
      { theme: "\u00c9cologie", percent: 22, color: "#16a34a" },
      { theme: "\u00c9conomie", percent: 18, color: "#2563eb" },
      { theme: "6e R\u00e9publique", percent: 16, color: "#8b5cf6" },
      { theme: "International", percent: 9, color: "#f59e0b" },
    ],
    recentQuotes: [
      { text: "Les services publics ne sont pas une charge, c\u2019est un investissement.", date: "13 jan. 2025", context: "Assembl\u00e9e nationale" },
      { text: "Il faut une 6e R\u00e9publique, d\u00e9mocratique et participative.", date: "8 jan. 2025", context: "Meeting Marseille" },
    ],
  },
  "jordan-bardella": {
    speechCount: 543,
    totalHours: 312,
    avgWordsPerMin: 158,
    vocabularyDiversity: 0.58,
    avgToxicity: 0.35,
    factChecks: 89,
    topThemes: [
      { theme: "Immigration", percent: 35, color: "#ef4444" },
      { theme: "Europe", percent: 20, color: "#6366f1" },
      { theme: "Jeunesse", percent: 18, color: "#10b981" },
      { theme: "S\u00e9curit\u00e9", percent: 16, color: "#f59e0b" },
      { theme: "\u00c9conomie", percent: 8, color: "#2563eb" },
    ],
    recentQuotes: [
      { text: "La jeunesse de France m\u00e9rite mieux que ce qu\u2019on lui propose.", date: "12 jan. 2025", context: "Tribune presse" },
    ],
  },
  "gabriel-attal": {
    speechCount: 412,
    totalHours: 245,
    avgWordsPerMin: 172,
    vocabularyDiversity: 0.71,
    avgToxicity: 0.14,
    factChecks: 67,
    topThemes: [
      { theme: "\u00c9ducation", percent: 32, color: "#2563eb" },
      { theme: "Jeunesse", percent: 22, color: "#10b981" },
      { theme: "R\u00e9formes", percent: 20, color: "#f59e0b" },
      { theme: "Budget", percent: 15, color: "#8b5cf6" },
      { theme: "Num\u00e9rique", percent: 8, color: "#06b6d4" },
    ],
    recentQuotes: [
      { text: "L\u2019\u00e9ducation nationale doit redevenir le creuset r\u00e9publicain.", date: "11 jan. 2025", context: "Assembl\u00e9e nationale" },
    ],
  },
  "francois-ruffin": {
    speechCount: 389,
    totalHours: 287,
    avgWordsPerMin: 176,
    vocabularyDiversity: 0.82,
    avgToxicity: 0.31,
    factChecks: 45,
    topThemes: [
      { theme: "Travail", percent: 34, color: "#ef4444" },
      { theme: "Social", percent: 26, color: "#f59e0b" },
      { theme: "Industrie", percent: 18, color: "#2563eb" },
      { theme: "Ruralit\u00e9", percent: 14, color: "#16a34a" },
      { theme: "D\u00e9mocratie", percent: 6, color: "#8b5cf6" },
    ],
    recentQuotes: [
      { text: "Les conditions de travail dans l\u2019agro-alimentaire sont indignes.", date: "10 jan. 2025", context: "D\u00e9claration, Picardie" },
    ],
  },
};

/* -------------------------------------------------------------------------- */
export default function PoliticianSpotlight() {
  const [selectedSlug, setSelectedSlug] = useState("emmanuel-macron");

  const politician = MOCK_POLITICIANS.find((p) => p.slug === selectedSlug)!;
  const stats = POLITICIAN_DATA[selectedSlug];

  if (!stats || !politician) return null;

  const maxTheme = Math.max(...stats.topThemes.map((t) => t.percent));

  return (
    <section className="card overflow-hidden" aria-label="Fiche politicien d\u00e9taill\u00e9e">
      {/* Bande de couleur */}
      <div className="h-1.5" style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))" }} />

      <div className="p-6">
        {/* En-tête + sélecteur */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
              Fiche politicien
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              KPI discursifs d&eacute;taill&eacute;s par personne
            </p>
          </div>

          {/* Sélecteur de politicien */}
          <div className="relative">
            <label className="sr-only" htmlFor="politician-select">S&eacute;lectionner un politicien</label>
            <select
              id="politician-select"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="cursor-pointer appearance-none rounded-xl border py-2.5 pl-4 pr-10 text-sm font-semibold focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--color-bg-card)",
                borderColor: "var(--color-primary-200)",
                color: "var(--color-text-primary)",
              }}
            >
              {MOCK_POLITICIANS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.fullName} ({p.partyAbbreviation})
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
            />
          </div>
        </div>

        {/* Identité */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border p-4" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-subtle)" }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", color: "#fff" }}>
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{politician.fullName}</p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {politician.role} &middot; {politician.party}
            </p>
          </div>
        </div>

        {/* KPI grid — 6 métriques */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MiniStat icon={<FileText className="h-4 w-4" />} label="Discours" value={formatNumber(stats.speechCount)} color="var(--color-primary)" />
          <MiniStat icon={<Clock className="h-4 w-4" />} label="Heures" value={`${formatNumber(stats.totalHours)}h`} color="var(--color-success)" />
          <MiniStat icon={<Zap className="h-4 w-4" />} label="Mots/min" value={String(stats.avgWordsPerMin)} color="#8b5cf6" />
          <MiniStat icon={<MessageSquare className="h-4 w-4" />} label="Diversit\u00e9 vocab." value={`${(stats.vocabularyDiversity * 100).toFixed(0)}%`} color="#06b6d4" />
          <MiniStat icon={<Flame className="h-4 w-4" />} label="Toxicit\u00e9 moy." value={stats.avgToxicity.toFixed(2)} color={stats.avgToxicity > 0.35 ? "var(--color-error)" : "var(--color-warning)"} />
          <MiniStat icon={<TrendingUp className="h-4 w-4" />} label="Fact-checks" value={formatNumber(stats.factChecks)} color="#10b981" />
        </div>

        {/* Thèmes du politicien — bar chart horizontal */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            R&eacute;partition th&eacute;matique
          </p>
          <div className="space-y-2">
            {stats.topThemes.map((t) => (
              <div key={t.theme} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{t.theme}</span>
                <div className="relative h-6 flex-1 overflow-hidden rounded-md" style={{ backgroundColor: "var(--color-bg-section)" }}>
                  <div
                    className="absolute inset-y-0 left-0 rounded-md transition-all duration-700"
                    style={{ width: `${(t.percent / maxTheme) * 100}%`, backgroundColor: t.color, opacity: 0.8 }}
                  />
                  <span
                    className="absolute inset-y-0 left-2 flex items-center text-[11px] font-bold"
                    style={{ color: (t.percent / maxTheme) * 100 > 20 ? "#fff" : "var(--color-text-secondary)" }}
                  >
                    {t.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Citations récentes */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            Derni&egrave;res citations
          </p>
          <div className="space-y-3">
            {stats.recentQuotes.map((q, i) => (
              <div
                key={i}
                className="rounded-lg border border-dashed p-3"
                style={{ borderColor: "var(--color-primary-200)", backgroundColor: "var(--color-primary-light)" }}
              >
                <p className="text-sm italic leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                  &laquo;&nbsp;{q.text}&nbsp;&raquo;
                </p>
                <p className="mt-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {q.date} &middot; {q.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
function MiniStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: "var(--color-border)" }}>
      <div className="mb-1 flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-[11px] font-medium" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      </div>
      <p className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>{value}</p>
    </div>
  );
}

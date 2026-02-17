/* =============================================================================
 * components/analytique/ComparePoliticians.tsx
 *
 * Comparaison côte à côte de 2 politiciens.
 * Composant Client — 2 sélecteurs, 5 métriques comparées visuellement.
 * ============================================================================= */

"use client";

import { useState } from "react";
import { ChevronDown, ArrowLeftRight } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { MOCK_POLITICIANS } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
interface MetricData {
  speechCount: number;
  totalHours: number;
  avgWordsPerMin: number;
  vocabularyDiversity: number;
  avgToxicity: number;
}

const METRICS_DB: Record<string, MetricData> = {
  "emmanuel-macron": { speechCount: 1245, totalHours: 892, avgWordsPerMin: 168, vocabularyDiversity: 0.74, avgToxicity: 0.18 },
  "marine-le-pen": { speechCount: 987, totalHours: 654, avgWordsPerMin: 152, vocabularyDiversity: 0.61, avgToxicity: 0.42 },
  "jean-luc-melenchon": { speechCount: 876, totalHours: 721, avgWordsPerMin: 185, vocabularyDiversity: 0.79, avgToxicity: 0.38 },
  "jordan-bardella": { speechCount: 543, totalHours: 312, avgWordsPerMin: 158, vocabularyDiversity: 0.58, avgToxicity: 0.35 },
  "gabriel-attal": { speechCount: 412, totalHours: 245, avgWordsPerMin: 172, vocabularyDiversity: 0.71, avgToxicity: 0.14 },
  "francois-ruffin": { speechCount: 389, totalHours: 287, avgWordsPerMin: 176, vocabularyDiversity: 0.82, avgToxicity: 0.31 },
};

interface MetricRow {
  label: string;
  key: keyof MetricData;
  format: (v: number) => string;
  higherIsBetter: boolean;
}

const METRIC_ROWS: MetricRow[] = [
  { label: "Discours index\u00e9s", key: "speechCount", format: (v) => formatNumber(v), higherIsBetter: true },
  { label: "Heures de parole", key: "totalHours", format: (v) => `${formatNumber(v)}h`, higherIsBetter: true },
  { label: "D\u00e9bit (mots/min)", key: "avgWordsPerMin", format: (v) => String(v), higherIsBetter: true },
  { label: "Diversit\u00e9 vocab.", key: "vocabularyDiversity", format: (v) => `${(v * 100).toFixed(0)}%`, higherIsBetter: true },
  { label: "Toxicit\u00e9 moy.", key: "avgToxicity", format: (v) => v.toFixed(2), higherIsBetter: false },
];

/* -------------------------------------------------------------------------- */
export default function ComparePoliticians() {
  const [leftSlug, setLeftSlug] = useState("emmanuel-macron");
  const [rightSlug, setRightSlug] = useState("marine-le-pen");

  const leftP = MOCK_POLITICIANS.find((p) => p.slug === leftSlug)!;
  const rightP = MOCK_POLITICIANS.find((p) => p.slug === rightSlug)!;
  const leftM = METRICS_DB[leftSlug];
  const rightM = METRICS_DB[rightSlug];

  if (!leftM || !rightM) return null;

  function swap() {
    setLeftSlug(rightSlug);
    setRightSlug(leftSlug);
  }

  return (
    <section className="card overflow-hidden" aria-label="Comparer deux politiciens">
      <div className="h-1.5" style={{ background: "linear-gradient(90deg, #2563eb, #7c3aed)" }} />

      <div className="p-6">
        <h2 className="mb-1 text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
          Comparer deux politiciens
        </h2>
        <p className="mb-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
          S&eacute;lectionnez deux politiciens pour comparer leurs m&eacute;triques discursives
        </p>

        {/* Sélecteurs */}
        <div className="mb-6 flex items-center gap-3">
          <PoliticianSelect value={leftSlug} onChange={setLeftSlug} label="Politicien A" />
          <button
            type="button"
            onClick={swap}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-[var(--color-bg-section)]"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
            aria-label="Intervertir"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <PoliticianSelect value={rightSlug} onChange={setRightSlug} label="Politicien B" />
        </div>

        {/* Noms */}
        <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="text-center">
            <p className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>{leftP.fullName}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{leftP.partyAbbreviation}</p>
          </div>
          <span className="text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>VS</span>
          <div className="text-center">
            <p className="text-sm font-bold" style={{ color: "#7c3aed" }}>{rightP.fullName}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{rightP.partyAbbreviation}</p>
          </div>
        </div>

        {/* Métriques comparées */}
        <div className="space-y-3">
          {METRIC_ROWS.map((metric) => {
            const lv = leftM[metric.key];
            const rv = rightM[metric.key];
            const maxV = Math.max(lv, rv);
            const leftPct = maxV > 0 ? (lv / maxV) * 100 : 50;
            const rightPct = maxV > 0 ? (rv / maxV) * 100 : 50;
            const leftWins = metric.higherIsBetter ? lv >= rv : lv <= rv;
            const rightWins = !leftWins;

            return (
              <div key={metric.key} className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)" }}>
                <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                  {metric.label}
                </p>
                <div className="flex items-center gap-3">
                  {/* Valeur gauche */}
                  <span
                    className={cn("w-16 shrink-0 text-right text-sm font-bold")}
                    style={{ color: leftWins ? "var(--color-primary)" : "var(--color-text-secondary)" }}
                  >
                    {metric.format(lv)}
                  </span>

                  {/* Barres */}
                  <div className="flex flex-1 gap-1">
                    <div className="flex h-5 flex-1 justify-end overflow-hidden rounded-l-md" style={{ backgroundColor: "var(--color-bg-section)" }}>
                      <div
                        className="h-full rounded-l-md transition-all duration-500"
                        style={{
                          width: `${leftPct}%`,
                          backgroundColor: leftWins ? "var(--color-primary)" : "var(--color-primary-200)",
                        }}
                      />
                    </div>
                    <div className="flex h-5 flex-1 overflow-hidden rounded-r-md" style={{ backgroundColor: "var(--color-bg-section)" }}>
                      <div
                        className="h-full rounded-r-md transition-all duration-500"
                        style={{
                          width: `${rightPct}%`,
                          backgroundColor: rightWins ? "#7c3aed" : "#e0e7ff",
                        }}
                      />
                    </div>
                  </div>

                  {/* Valeur droite */}
                  <span
                    className={cn("w-16 shrink-0 text-left text-sm font-bold")}
                    style={{ color: rightWins ? "#7c3aed" : "var(--color-text-secondary)" }}
                  >
                    {metric.format(rv)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
function PoliticianSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="relative flex-1">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-xl border py-2.5 pl-3 pr-9 text-sm font-medium focus:outline-none focus:ring-2"
        style={{
          backgroundColor: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
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
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: "var(--color-text-muted)" }}
      />
    </div>
  );
}

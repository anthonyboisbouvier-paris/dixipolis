/* =============================================================================
 * components/analytique/ThemeCrossTable.tsx
 *
 * Tableau de croisement Thème × Politicien.
 * Montre combien chaque politicien a parlé de chaque thème.
 * Composant Client — interactif (tri par colonne).
 * ============================================================================= */

"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { MOCK_POLITICIANS, MOCK_THEMES } from "@/lib/constants";

/* --------------------------------------------------------------------------
 * Mock data de croisement : politicien × thème → nombre de mentions
 * (sera remplacé par l'API)
 * -------------------------------------------------------------------------- */
const CROSS_DATA: Record<string, Record<string, number>> = {
  "emmanuel-macron": { "\u00c9conomie": 348, "Immigration": 87, "\u00c9cologie": 165, "S\u00e9curit\u00e9": 92, "\u00c9ducation": 124, "Sant\u00e9": 89, "Europe": 312 },
  "marine-le-pen": { "\u00c9conomie": 134, "Immigration": 487, "\u00c9cologie": 23, "S\u00e9curit\u00e9": 389, "\u00c9ducation": 56, "Sant\u00e9": 67, "Europe": 98 },
  "jean-luc-melenchon": { "\u00c9conomie": 267, "Immigration": 112, "\u00c9cologie": 245, "S\u00e9curit\u00e9": 78, "\u00c9ducation": 198, "Sant\u00e9": 156, "Europe": 134 },
  "jordan-bardella": { "\u00c9conomie": 67, "Immigration": 312, "\u00c9cologie": 12, "S\u00e9curit\u00e9": 198, "\u00c9ducation": 34, "Sant\u00e9": 23, "Europe": 145 },
  "gabriel-attal": { "\u00c9conomie": 189, "Immigration": 56, "\u00c9cologie": 78, "S\u00e9curit\u00e9": 45, "\u00c9ducation": 287, "Sant\u00e9": 67, "Europe": 89 },
  "francois-ruffin": { "\u00c9conomie": 198, "Immigration": 34, "\u00c9cologie": 89, "S\u00e9curit\u00e9": 23, "\u00c9ducation": 67, "Sant\u00e9": 123, "Europe": 45 },
};

/* -------------------------------------------------------------------------- */
type SortConfig = { key: string; direction: "asc" | "desc" } | null;

export default function ThemeCrossTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const themes = MOCK_THEMES.map((t) => t.theme);
  const politicians = MOCK_POLITICIANS.slice(0, 6);

  /* Tri dynamique */
  const sortedPoliticians = [...politicians].sort((a, b) => {
    if (!sortConfig) return b.speechCount - a.speechCount;
    const aVal = sortConfig.key === "name"
      ? a.fullName
      : CROSS_DATA[a.slug]?.[sortConfig.key] ?? 0;
    const bVal = sortConfig.key === "name"
      ? b.fullName
      : CROSS_DATA[b.slug]?.[sortConfig.key] ?? 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortConfig.direction === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  function toggleSort(key: string) {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "desc" };
    });
  }

  /* Couleur de chaleur */
  const allValues = Object.values(CROSS_DATA).flatMap((row) => Object.values(row));
  const maxVal = Math.max(...allValues);

  function heatColor(val: number): string {
    const ratio = val / maxVal;
    if (ratio > 0.7) return "rgba(37,99,235,0.25)";
    if (ratio > 0.4) return "rgba(37,99,235,0.12)";
    if (ratio > 0.15) return "rgba(37,99,235,0.05)";
    return "transparent";
  }

  return (
    <section className="card overflow-hidden" aria-label="Croisement Th\u00e8me \u00d7 Politicien">
      <div className="p-6 pb-2">
        <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
          Croisement Th&egrave;me &times; Politicien
        </h2>
        <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Nombre de mentions par politicien et par th&egrave;me &mdash; cliquez sur une colonne pour trier
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th
                className="cursor-pointer px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}
                onClick={() => toggleSort("name")}
              >
                <span className="inline-flex items-center gap-1">
                  Politicien
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              {themes.map((theme) => (
                <th
                  key={theme}
                  className="cursor-pointer px-3 py-3 text-center text-xs font-bold uppercase tracking-wider"
                  style={{ color: sortConfig?.key === theme ? "var(--color-primary)" : "var(--color-text-muted)" }}
                  onClick={() => toggleSort(theme)}
                >
                  <span className="inline-flex items-center gap-1">
                    {theme}
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              ))}
              <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPoliticians.map((politician, rowIdx) => {
              const row = CROSS_DATA[politician.slug] ?? {};
              const total = themes.reduce((sum, t) => sum + (row[t] ?? 0), 0);
              return (
                <tr
                  key={politician.slug}
                  className="transition-colors hover:bg-[var(--color-bg-section)]"
                  style={{ borderBottom: rowIdx < sortedPoliticians.length - 1 ? "1px solid var(--color-border)" : "none" }}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{politician.fullName}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{politician.partyAbbreviation}</p>
                    </div>
                  </td>
                  {themes.map((theme) => {
                    const val = row[theme] ?? 0;
                    return (
                      <td key={theme} className="px-3 py-3 text-center">
                        <span
                          className={cn(
                            "inline-flex h-8 min-w-[48px] items-center justify-center rounded-lg text-xs font-bold",
                          )}
                          style={{
                            backgroundColor: heatColor(val),
                            color: val > maxVal * 0.4 ? "var(--color-primary)" : "var(--color-text-secondary)",
                          }}
                        >
                          {formatNumber(val)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {formatNumber(total)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 pb-4 pt-2">
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Cellules color&eacute;es par intensit&eacute; (plus le chiffre est &eacute;lev&eacute;, plus la cellule est bleue)
        </p>
      </div>
    </section>
  );
}

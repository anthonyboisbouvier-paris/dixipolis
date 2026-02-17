/* =============================================================================
 * components/analytique/FilterBar.tsx
 *
 * Composant Client : barre de filtres pour le tableau de bord analytique.
 * Filtres disponibles : periode, parti politique, theme.
 *
 * DESIGN PREMIUM :
 *   - Selects personnalises avec icones et chevron
 *   - Bouton de reinitialisation avec compteur de filtres actifs
 *   - Bouton export (decoratif)
 *   - CSS variables uniquement (pas de couleurs Tailwind brutes)
 *   - Disposition responsive : empile sur mobile, ligne sur desktop
 * ============================================================================= */

"use client";

import { useState } from "react";
import { Filter, Download, Calendar, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { POLITICAL_PARTIES, MOCK_THEMES } from "@/lib/constants";
/* --------------------------------------------------------------------------
 * Options de periode predefinies
 * -------------------------------------------------------------------------- */
const PERIOD_OPTIONS = [
  { value: "7d", label: "7 derniers jours" },
  { value: "30d", label: "30 derniers jours" },
  { value: "3m", label: "3 derniers mois" },
  { value: "6m", label: "6 derniers mois" },
  { value: "1y", label: "12 derniers mois" },
  { value: "all", label: "Tout" },
] as const;

/* --------------------------------------------------------------------------
 * Etat des filtres et valeurs par defaut
 * -------------------------------------------------------------------------- */
interface FilterState {
  period: string;
  party: string;
  theme: string;
}
const INITIAL_FILTERS: FilterState = { period: "30d", party: "", theme: "" };

/* --------------------------------------------------------------------------
 * FilterSelect — Select personnalise avec icone optionnelle
 * -------------------------------------------------------------------------- */
function FilterSelect({ label, value, onChange, options, icon }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <div
          className="pointer-events-none absolute left-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          {icon}
        </div>
      )}
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "cursor-pointer appearance-none rounded-lg border py-2 pr-8 text-sm",
          "focus:outline-none focus:ring-2",
          icon ? "pl-9" : "pl-3"
        )}
        style={{
          backgroundColor: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div
        className="pointer-events-none absolute right-2.5"
        style={{ color: "var(--color-text-muted)" }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * FilterBar — Barre de filtres principale du tableau de bord analytique
 *
 * Disposition :
 *   - Ligne horizontale sur desktop, empilee sur mobile
 *   - 3 selects (periode, parti, theme) + bouton reinitialiser + bouton export
 *   - Compteur de filtres actifs sur le bouton reinitialiser
 *
 * Etat local :
 *   - filters : FilterState (period, party, theme)
 *   - Reinitialisation vers INITIAL_FILTERS au clic sur le bouton reset
 * -------------------------------------------------------------------------- */
export default function FilterBar() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  /* Nombre de filtres modifies par rapport aux valeurs par defaut */
  const activeFilterCount = (
    [
      filters.period !== INITIAL_FILTERS.period,
      filters.party !== INITIAL_FILTERS.party,
      filters.theme !== INITIAL_FILTERS.theme,
    ] as boolean[]
  ).filter(Boolean).length;

  /* Options pour le select des partis politiques */
  const partyOptions: { value: string; label: string }[] = [
    { value: "", label: "Tous les partis" },
    ...POLITICAL_PARTIES.map((p) => ({
      value: p.abbreviation,
      label: p.name,
    })),
  ];

  /* Options pour le select des themes */
  const themeOptions: { value: string; label: string }[] = [
    { value: "", label: "Tous les th\u00e8mes" },
    ...MOCK_THEMES.map((t) => ({
      value: t.theme,
      label: t.theme,
    })),
  ];

  return (
    <div
      className={cn(
        "card flex flex-col gap-4 p-4",
        "sm:flex-row sm:items-center sm:flex-wrap"
      )}
    >
      {/* Icone de filtre + label visible uniquement sur desktop */}
      <div
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <Filter className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Filtres</span>
      </div>

      {/* Select : Periode */}
      <FilterSelect
        label="P\u00e9riode"
        value={filters.period}
        onChange={(v) => setFilters((prev) => ({ ...prev, period: v }))}
        options={PERIOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        icon={<Calendar className="h-4 w-4" />}
      />

      {/* Select : Parti politique */}
      <FilterSelect
        label="Parti politique"
        value={filters.party}
        onChange={(v) => setFilters((prev) => ({ ...prev, party: v }))}
        options={partyOptions}
      />

      {/* Select : Theme */}
      <FilterSelect
        label="Th\u00e8me"
        value={filters.theme}
        onChange={(v) => setFilters((prev) => ({ ...prev, theme: v }))}
        options={themeOptions}
      />

      {/* Spacer pour pousser les boutons a droite sur desktop */}
      <div className="hidden flex-1 sm:block" />

      {/* Bouton reinitialiser (visible uniquement si filtres modifies) */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={() => setFilters(INITIAL_FILTERS)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium",
            "transition-colors hover:bg-[var(--color-bg-section)]"
          )}
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          R&eacute;initialiser
          <span
            className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {activeFilterCount}
          </span>
        </button>
      )}

      {/* Bouton export (decoratif) */}
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium",
          "transition-colors hover:bg-[var(--color-bg-section)]"
        )}
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Exporter
      </button>
    </div>
  );
}

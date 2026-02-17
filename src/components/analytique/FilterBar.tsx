/* =============================================================================
 * components/analytique/FilterBar.tsx
 *
 * Composant Client : barre de filtres pour le tableau de bord analytique.
 * Permet a l'utilisateur de filtrer les donnees affichees selon :
 *   - La periode temporelle (7 jours, 30 jours, 3 mois, tout)
 *   - Le parti politique (tous ou un parti specifique)
 *   - Le theme (tous ou un theme specifique)
 *
 * "use client" est necessaire pour la gestion d'etat locale (useState).
 *
 * IMPORTANT : Ce composant est pour l'instant purement visuel (UI only).
 * Les filtres ne sont pas encore connectes au backend. L'architecture
 * est preparee pour recevoir des callbacks (onFilterChange) qui seront
 * branches sur les requetes API futures.
 * ============================================================================= */

"use client";

import { useState } from "react";
import { Filter, Download, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { POLITICAL_PARTIES, MOCK_THEMES } from "@/lib/constants";

/* --------------------------------------------------------------------------
 * Options de la periode temporelle
 * Chaque option correspond a un intervalle de temps pour filtrer les donnees.
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
 * Interface pour l'etat des filtres
 * Structure centralisee de tous les criteres de filtrage.
 * -------------------------------------------------------------------------- */
interface FilterState {
  /** Periode temporelle selectionnee */
  period: string;
  /** Abreviation du parti selectionne (vide = tous les partis) */
  party: string;
  /** Theme selectionne (vide = tous les themes) */
  theme: string;
}

/* --------------------------------------------------------------------------
 * Etat initial des filtres (aucun filtre actif = toutes les donnees)
 * -------------------------------------------------------------------------- */
const INITIAL_FILTERS: FilterState = {
  period: "30d",
  party: "",
  theme: "",
};

/* --------------------------------------------------------------------------
 * FilterSelect — Composant select personnalise avec style coherent
 * Encapsule un <select> natif avec un style Tailwind uniforme.
 * -------------------------------------------------------------------------- */
function FilterSelect({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  /** Label accessible du select (sr-only) */
  label: string;
  /** Valeur actuellement selectionnee */
  value: string;
  /** Callback appele quand la selection change */
  onChange: (value: string) => void;
  /** Liste des options disponibles */
  options: { value: string; label: string }[];
  /** Icone optionnelle affichee avant le select */
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center">
      {/* -- Icone decorative (a gauche du select) -- */}
      {icon && (
        <div className="pointer-events-none absolute left-3 text-gray-400">
          {icon}
        </div>
      )}

      {/* -- Label accessible (masque visuellement) -- */}
      <label className="sr-only">{label}</label>

      {/* -- Select natif avec style personnalise -- */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none rounded-lg border border-gray-200 bg-white",
          "py-2 pr-8 text-sm text-gray-700",
          "transition-colors hover:border-gray-300 focus:border-blue-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-100",
          "cursor-pointer",
          icon ? "pl-9" : "pl-3"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* -- Fleche du select (chevron personnalise) -- */}
      <div className="pointer-events-none absolute right-2.5 text-gray-400">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * FilterBar — Barre de filtres du tableau de bord
 * Composant principal exporte. Affiche les 3 filtres en ligne avec
 * un bouton d'export (non fonctionnel pour l'instant).
 * -------------------------------------------------------------------------- */
export default function FilterBar() {
  /* -- Etat local des filtres -- */
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  /* -- Nombre de filtres actifs (hors valeurs par defaut) -- */
  const activeFilterCount = [
    filters.period !== "30d",
    filters.party !== "",
    filters.theme !== "",
  ].filter(Boolean).length;

  /* -- Mise a jour d'un filtre individuel -- */
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /* -- Reinitialisation de tous les filtres -- */
  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  /* -- Options pour le filtre de parti -- */
  const partyOptions = [
    { value: "", label: "Tous les partis" },
    ...POLITICAL_PARTIES.map((p) => ({
      value: p.abbreviation,
      label: `${p.name} (${p.abbreviation})`,
    })),
  ];

  /* -- Options pour le filtre de theme -- */
  const themeOptions = [
    { value: "", label: "Tous les themes" },
    ...MOCK_THEMES.map((t) => ({
      value: t.theme,
      label: t.theme,
    })),
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-gray-100",
        "bg-white px-4 py-3 shadow-sm"
      )}
    >
      {/* -- Icone de filtre avec compteur de filtres actifs -- */}
      <div className="flex items-center gap-2 text-gray-500">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filtres</span>
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
            {activeFilterCount}
          </span>
        )}
      </div>

      {/* -- Separateur vertical -- */}
      <div className="hidden h-6 w-px bg-gray-200 sm:block" />

      {/* -- Filtre de periode temporelle -- */}
      <FilterSelect
        label="Selectionner la periode"
        value={filters.period}
        onChange={(v) => updateFilter("period", v)}
        options={PERIOD_OPTIONS.map((o) => ({
          value: o.value,
          label: o.label,
        }))}
        icon={<Calendar className="h-4 w-4" />}
      />

      {/* -- Filtre de parti politique -- */}
      <FilterSelect
        label="Selectionner le parti"
        value={filters.party}
        onChange={(v) => updateFilter("party", v)}
        options={partyOptions}
      />

      {/* -- Filtre de theme -- */}
      <FilterSelect
        label="Selectionner le theme"
        value={filters.theme}
        onChange={(v) => updateFilter("theme", v)}
        options={themeOptions}
      />

      {/* -- Bouton de reinitialisation (visible si des filtres sont actifs) -- */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className={cn(
            "text-xs font-medium text-blue-600 hover:text-blue-800",
            "transition-colors"
          )}
        >
          Reinitialiser
        </button>
      )}

      {/* -- Espaceur flexible pour pousser le bouton export a droite -- */}
      <div className="flex-1" />

      {/* -- Bouton d'export (non fonctionnel, placeholder) -- */}
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-gray-200",
          "bg-white px-3 py-2 text-sm font-medium text-gray-600",
          "transition-colors hover:bg-gray-50 hover:text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-blue-100"
        )}
        title="Exporter les donnees (bientot disponible)"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Exporter</span>
      </button>
    </div>
  );
}

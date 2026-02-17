/* =============================================================================
 * components/analytique/ThemeBarChart.tsx
 *
 * Composant Client : graphique a barres horizontales en CSS pur.
 * Affiche les themes politiques les plus abordes, classes par nombre
 * d'occurrences decroissant. Chaque barre montre :
 *   - Le nom du theme
 *   - Une barre de progression coloree (largeur proportionnelle au %)
 *   - Le nombre exact d'occurrences
 *   - Un indicateur de tendance (hausse / baisse / stable)
 *
 * "use client" est necessaire car ce composant pourra recevoir des
 * interactions futures (filtrage, animation d'entree, tooltips, etc.).
 * ============================================================================= */

"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { MOCK_THEMES } from "@/lib/constants";
import type { ThemeData } from "@/types";

/* --------------------------------------------------------------------------
 * Palette de couleurs pour les barres du graphique
 * Chaque theme recoit une couleur distincte pour une lecture rapide.
 * -------------------------------------------------------------------------- */
const BAR_COLORS: string[] = [
  "bg-blue-500",     // Economie
  "bg-rose-500",     // Immigration
  "bg-emerald-500",  // Ecologie
  "bg-orange-500",   // Securite
  "bg-violet-500",   // Education
  "bg-cyan-500",     // Sante
  "bg-amber-500",    // Europe
];

/* --------------------------------------------------------------------------
 * TrendBadge — Petit badge indiquant la tendance d'un theme
 * Affiche une fleche et un texte colore selon la direction de la tendance.
 * -------------------------------------------------------------------------- */
function TrendBadge({ trend }: { trend: ThemeData["trend"] }) {
  /* -- Configuration du badge selon la tendance -- */
  const config = {
    up: {
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      label: "En hausse",
      className: "text-emerald-600 bg-emerald-50",
    },
    down: {
      icon: <TrendingDown className="h-3.5 w-3.5" />,
      label: "En baisse",
      className: "text-rose-600 bg-rose-50",
    },
    stable: {
      icon: <Minus className="h-3.5 w-3.5" />,
      label: "Stable",
      className: "text-gray-500 bg-gray-50",
    },
  };

  const { icon, label, className } = config[trend];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        className
      )}
      title={label}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  );
}

/* --------------------------------------------------------------------------
 * ThemeBarRow — Ligne individuelle du graphique a barres
 * Affiche le nom du theme, la barre de progression, le compteur
 * et l'indicateur de tendance sur une seule ligne.
 * -------------------------------------------------------------------------- */
function ThemeBarRow({
  theme,
  colorClass,
  maxPercentage,
}: {
  theme: ThemeData;
  colorClass: string;
  maxPercentage: number;
}) {
  /* -- Largeur relative de la barre (normalisee par rapport au max) -- */
  const relativeWidth = (theme.percentage / maxPercentage) * 100;

  return (
    <div className="group flex items-center gap-3 py-2.5">
      {/* -- Nom du theme (largeur fixe pour alignement) -- */}
      <span className="w-28 shrink-0 text-sm font-medium text-gray-700">
        {theme.theme}
      </span>

      {/* -- Conteneur de la barre de progression -- */}
      <div className="relative flex-1">
        {/* Fond gris clair */}
        <div className="h-7 w-full rounded-md bg-gray-100" />

        {/* Barre coloree superposee avec transition fluide */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-md transition-all duration-500 ease-out",
            "group-hover:opacity-90",
            colorClass
          )}
          style={{ width: `${relativeWidth}%` }}
        />

        {/* Pourcentage affiche a l'interieur de la barre */}
        <span
          className={cn(
            "absolute inset-y-0 left-2 flex items-center text-xs font-semibold",
            relativeWidth > 15 ? "text-white" : "text-gray-600"
          )}
        >
          {theme.percentage}%
        </span>
      </div>

      {/* -- Nombre d'occurrences -- */}
      <span className="w-16 shrink-0 text-right text-sm font-semibold text-gray-800">
        {formatNumber(theme.count)}
      </span>

      {/* -- Indicateur de tendance -- */}
      <div className="w-8 shrink-0 flex justify-center">
        <TrendBadge trend={theme.trend} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * ThemeBarChart — Graphique a barres horizontales des themes
 * Composant principal exporte. Affiche un titre de section, un en-tete
 * de colonnes, puis la liste des barres pour chaque theme.
 * -------------------------------------------------------------------------- */
export default function ThemeBarChart() {
  /* -- Tri des themes par pourcentage decroissant -- */
  const sortedThemes = [...MOCK_THEMES].sort(
    (a, b) => b.percentage - a.percentage
  );

  /* -- Le pourcentage maximum sert de reference pour la largeur des barres -- */
  const maxPercentage = sortedThemes[0]?.percentage ?? 1;

  return (
    <section
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      )}
      aria-label="Repartition des themes"
    >
      {/* -- En-tete de la section -- */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Themes les plus abordes
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Repartition des discours par theme principal
          </p>
        </div>
      </div>

      {/* -- En-tete des colonnes (visible sur ecrans moyens et plus) -- */}
      <div className="mb-1 hidden items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-400 sm:flex">
        <span className="w-28 shrink-0">Theme</span>
        <span className="flex-1">Proportion</span>
        <span className="w-16 shrink-0 text-right">Total</span>
        <span className="w-8 shrink-0 text-center">Tend.</span>
      </div>

      {/* -- Separateur -- */}
      <div className="mb-1 border-t border-gray-100" />

      {/* -- Liste des barres de themes -- */}
      <div className="divide-y divide-gray-50">
        {sortedThemes.map((theme, index) => (
          <ThemeBarRow
            key={theme.theme}
            theme={theme}
            colorClass={BAR_COLORS[index % BAR_COLORS.length]}
            maxPercentage={maxPercentage}
          />
        ))}
      </div>

      {/* -- Note de bas de section -- */}
      <p className="mt-4 text-xs text-gray-400">
        Donnees basees sur l&apos;ensemble des discours indexes. Les tendances
        sont calculees sur les 30 derniers jours.
      </p>
    </section>
  );
}

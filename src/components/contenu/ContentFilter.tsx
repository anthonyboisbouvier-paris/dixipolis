/* =============================================================================
 * components/contenu/ContentFilter.tsx
 *
 * Composant client ("use client") qui fournit une barre de filtrage et de
 * recherche pour la liste des contenus generes.
 *
 * Responsabilites :
 *   - Onglets de filtrage par type de contenu :
 *     "Tout", "Articles", "Newsletters", "Syntheses", "Alertes"
 *   - Champ de recherche par mot-cle pour filtrer les contenus
 *   - Gestion de l'etat actif du filtre via useState
 *   - Communication avec le composant parent (ContentGrid) via un callback
 *     onFilterChange qui transmet le type selectionne et le terme de recherche
 *
 * Ce composant est interactif (onglets cliquables, champ de saisie) et
 * necessite donc la directive "use client".
 *
 * Utilisation :
 *   <ContentFilter
 *     onFilterChange={({ type, search }) => { ... }}
 *   />
 * ============================================================================= */

"use client";

import { useState } from "react";
import {
  FileText,
  Mail,
  BookOpen,
  Bell,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedContent } from "@/types";

/* --------------------------------------------------------------------------
 * Types — Parametres de filtrage transmis au parent
 * -------------------------------------------------------------------------- */

/** Valeurs possibles pour le filtre de type ("all" = tous les types) */
export type ContentTypeFilter = GeneratedContent["type"] | "all";

/** Structure du callback de changement de filtre */
export interface ContentFilterParams {
  /** Type de contenu selectionne (ou "all" pour tout afficher) */
  type: ContentTypeFilter;

  /** Terme de recherche saisi par l'utilisateur (chaine vide = pas de filtre) */
  search: string;
}

/* --------------------------------------------------------------------------
 * Props du composant ContentFilter
 * -------------------------------------------------------------------------- */
interface ContentFilterProps {
  /** Callback appele a chaque changement de filtre (type ou recherche) */
  onFilterChange: (params: ContentFilterParams) => void;
}

/* --------------------------------------------------------------------------
 * Configuration des onglets de filtrage
 *
 * Chaque onglet definit :
 *   - key   : valeur interne du filtre (correspond aux types GeneratedContent)
 *   - label : libelle affiche dans l'onglet (en francais)
 *   - icon  : icone Lucide associee a l'onglet
 *
 * L'onglet "all" est special : il affiche tous les types sans filtrage.
 * -------------------------------------------------------------------------- */
const FILTER_TABS: Array<{
  key: ContentTypeFilter;
  label: string;
  icon: typeof FileText;
}> = [
  { key: "all", label: "Tout", icon: Filter },
  { key: "fact-check", label: "Fact-checks", icon: CheckCircle },
  { key: "propaganda", label: "Propagande", icon: AlertTriangle },
  { key: "article", label: "Articles", icon: FileText },
  { key: "synthesis", label: "Synth\u00e8ses", icon: BookOpen },
  { key: "alert", label: "Alertes", icon: Bell },
  { key: "newsletter", label: "Newsletters", icon: Mail },
];

/* --------------------------------------------------------------------------
 * ContentFilter — Composant principal
 *
 * Structure :
 *   1. Barre d'onglets horizontale avec defilement sur mobile
 *   2. Champ de recherche avec icone loupe
 *
 * L'etat local gere le type actif et le terme de recherche.
 * A chaque modification, le callback onFilterChange est appele
 * pour notifier le parent (ContentGrid) des nouveaux parametres.
 * -------------------------------------------------------------------------- */
export default function ContentFilter({ onFilterChange }: ContentFilterProps) {
  /* ---- Etat local ---- */

  /** Type de contenu actuellement selectionne dans les onglets */
  const [activeType, setActiveType] = useState<ContentTypeFilter>("all");

  /** Terme de recherche saisi dans le champ texte */
  const [searchTerm, setSearchTerm] = useState("");

  /* --------------------------------------------------------------------------
   * handleTypeChange — Gestion du clic sur un onglet de type
   *
   * Met a jour l'etat local et notifie le parent du nouveau filtre.
   * Le terme de recherche est conserve lors du changement de type.
   * -------------------------------------------------------------------------- */
  const handleTypeChange = (type: ContentTypeFilter) => {
    setActiveType(type);
    onFilterChange({ type, search: searchTerm });
  };

  /* --------------------------------------------------------------------------
   * handleSearchChange — Gestion de la saisie dans le champ de recherche
   *
   * Met a jour l'etat local et notifie le parent du nouveau terme.
   * Le type selectionne est conserve lors de la saisie.
   * -------------------------------------------------------------------------- */
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({ type: activeType, search: value });
  };

  return (
    <div
      className={cn(
        /* Fond blanc avec bordure et coins arrondis (style carte) */
        "bg-[var(--color-bg-card)]",
        "border border-[var(--color-border)]",
        "rounded-[var(--radius-lg)]",
        "p-4",
        "shadow-[var(--shadow-sm)]",

        /* Disposition : colonne sur mobile, ligne sur tablette+ */
        "flex flex-col gap-4",
        "sm:flex-row sm:items-center sm:justify-between"
      )}
    >
      {/* ================================================================
       * ONGLETS DE TYPE
       *
       * Barre horizontale d'onglets avec defilement sur mobile.
       * Chaque onglet est un bouton avec une icone et un libelle.
       * L'onglet actif est mis en surbrillance avec le bleu primaire.
       * ================================================================ */}
      <div
        className={cn(
          /* Defilement horizontal sur mobile sans barre visible */
          "flex items-center gap-1",
          "overflow-x-auto",
          "-mx-1 px-1"
        )}
        role="tablist"
        aria-label="Filtrer par type de contenu"
      >
        {FILTER_TABS.map((tab) => {
          /* L'onglet est-il actuellement selectionne ? */
          const isActive = activeType === tab.key;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTypeChange(tab.key)}
              className={cn(
                /* Base : flex inline, centre, arrondi, transition */
                "inline-flex items-center gap-1.5",
                "whitespace-nowrap",
                "rounded-[var(--radius-md)]",
                "px-3 py-2 text-sm font-medium",
                "transition-all duration-[var(--transition-fast)]",
                "cursor-pointer",

                /* Etat inactif : fond transparent, texte secondaire */
                !isActive && [
                  "text-[var(--color-text-secondary)]",
                  "hover:bg-[var(--color-bg-section)]",
                  "hover:text-[var(--color-text-primary)]",
                ],

                /* Etat actif : fond bleu clair, texte bleu primaire */
                isActive && [
                  "bg-[var(--color-primary-light)]",
                  "text-[var(--color-primary)]",
                ]
              )}
            >
              {/* Icone de l'onglet (decorative) */}
              <TabIcon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================================================================
       * CHAMP DE RECHERCHE
       *
       * Input avec icone loupe a gauche pour filtrer par mot-cle.
       * La recherche est instantanee (pas de debounce pour le moment).
       * ================================================================ */}
      <div className="relative sm:w-64">
        {/* Icone de recherche positionnee a gauche dans le champ */}
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2",
            "h-4 w-4 text-[var(--color-text-muted)]",
            "pointer-events-none"
          )}
          aria-hidden="true"
        />

        {/* Champ de saisie avec padding gauche pour l'icone */}
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={cn(
            /* Dimensions et espacement */
            "h-9 w-full pl-9 pr-3 text-sm",

            /* Apparence : fond subtil, bordure, coins arrondis */
            "bg-[var(--color-bg-section)]",
            "border border-[var(--color-border)]",
            "rounded-[var(--radius-md)]",

            /* Couleurs de texte et placeholder */
            "text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-muted)]",

            /* Transition pour les changements d'etat */
            "transition-colors duration-[var(--transition-fast)]",

            /* Etat focus : bordure bleue + anneau */
            "focus:outline-none",
            "focus:border-[var(--color-primary)]",
            "focus:ring-2 focus:ring-[var(--color-primary)]/20",
            "focus:bg-[var(--color-bg-card)]"
          )}
          aria-label="Rechercher dans les contenus"
        />
      </div>
    </div>
  );
}

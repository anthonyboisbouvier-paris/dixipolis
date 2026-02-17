/* =============================================================================
 * components/ui/SearchBar.tsx
 *
 * Composant barre de recherche complète pour l'application Dixipolis.
 *
 * Ce composant central est utilisé sur la page d'accueil et la page Prompt
 * pour permettre aux utilisateurs de poser des questions en langage naturel
 * sur le discours politique.
 *
 * Fonctionnalités :
 *   - Champ de saisie avec icône de recherche
 *   - Bouton de soumission intégré
 *   - Puces de suggestions cliquables sous la barre (SEARCH_SUGGESTIONS)
 *   - Filtres rapides optionnels (toggles de thèmes, partis, etc.)
 *   - État de chargement pendant la requête
 *   - Entièrement contrôlé via les props (controlled component)
 *   - Accessibilité : formulaire avec rôle search, labels aria
 *
 * Utilisation :
 *   <SearchBar
 *     value={query}
 *     onChange={setQuery}
 *     onSubmit={handleSearch}
 *     placeholder="Posez votre question sur le discours politique..."
 *   />
 *
 *   <SearchBar
 *     value={query}
 *     onChange={setQuery}
 *     onSubmit={handleSearch}
 *     filters={["Économie", "Immigration", "Écologie"]}
 *     activeFilters={activeFilters}
 *     onFilterToggle={handleFilterToggle}
 *     showSuggestions
 *   />
 * ============================================================================= */

"use client";

import { useCallback, type FormEvent, type KeyboardEvent } from "react";
import { Search, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEARCH_SUGGESTIONS } from "@/lib/constants";

/* --------------------------------------------------------------------------
 * Props du composant SearchBar
 * -------------------------------------------------------------------------- */
export interface SearchBarProps {
  /** Valeur actuelle du champ de recherche (composant contrôlé) */
  value: string;

  /** Callback appelé à chaque modification du texte */
  onChange: (value: string) => void;

  /** Callback appelé lors de la soumission (Entrée ou clic sur le bouton) */
  onSubmit: (value: string) => void;

  /** Texte d'espace réservé dans le champ (défaut : message par défaut) */
  placeholder?: string;

  /** Indique si une recherche est en cours (affiche un état de chargement) */
  loading?: boolean;

  /** Affiche les puces de suggestions sous la barre (défaut : true) */
  showSuggestions?: boolean;

  /** Liste de filtres rapides à afficher sous la barre */
  filters?: string[];

  /** Filtres actuellement actifs (sélectionnés) */
  activeFilters?: string[];

  /** Callback appelé lors de l'activation/désactivation d'un filtre */
  onFilterToggle?: (filter: string) => void;

  /** Désactive le champ de saisie */
  disabled?: boolean;

  /** Taille de la barre : "default" ou "compact" pour les espaces restreints */
  size?: "default" | "compact";

  /** Classes CSS supplémentaires pour le conteneur principal */
  className?: string;
}

/* --------------------------------------------------------------------------
 * Composant SearchBar
 * -------------------------------------------------------------------------- */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Posez votre question sur le discours politique...",
  loading = false,
  showSuggestions = true,
  filters,
  activeFilters = [],
  onFilterToggle,
  disabled = false,
  size = "default",
  className,
}: SearchBarProps) {
  /* ---- Gestion de la soumission du formulaire ---- */
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      /* On ne soumet que si le texte n'est pas vide et qu'on n'est pas en chargement */
      const trimmed = value.trim();
      if (trimmed && !loading && !disabled) {
        onSubmit(trimmed);
      }
    },
    [value, loading, disabled, onSubmit]
  );

  /* ---- Clic sur une suggestion : remplit le champ et soumet ---- */
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      if (!loading && !disabled) {
        onChange(suggestion);
        onSubmit(suggestion);
      }
    },
    [loading, disabled, onChange, onSubmit]
  );

  /* ---- Vider le champ de recherche ---- */
  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  /* ---- Gestion du clavier sur les suggestions (accessibilité) ---- */
  const handleSuggestionKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, suggestion: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSuggestionClick(suggestion);
      }
    },
    [handleSuggestionClick]
  );

  /* Détermine si le bouton de soumission doit être actif */
  const canSubmit = value.trim().length > 0 && !loading && !disabled;

  /* Classes conditionnelles selon la taille */
  const isCompact = size === "compact";

  return (
    <div className={cn("w-full", className)}>
      {/* ================================================================
       * FORMULAIRE DE RECHERCHE
       * Le rôle "search" améliore la sémantique pour les lecteurs d'écran.
       * ================================================================ */}
      <form
        role="search"
        aria-label="Rechercher dans les discours politiques"
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div
          className={cn(
            /* Conteneur flex avec fond blanc, bordure et arrondi */
            "relative flex items-center",
            "bg-[var(--color-bg-card)]",
            "border border-[var(--color-border)]",
            "shadow-[var(--shadow-sm)]",
            "transition-all duration-[var(--transition-normal)]",

            /* Focus-within : met en avant toute la barre lors de la saisie */
            "focus-within:border-[var(--color-primary)]",
            "focus-within:shadow-[var(--shadow-md)]",
            "focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10",

            /* Taille : compact ou standard */
            isCompact
              ? "rounded-[var(--radius-md)] h-10"
              : "rounded-[var(--radius-lg)] h-12 sm:h-14",

            /* État désactivé */
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* ---- Icône de recherche (préfixe) ---- */}
          <span
            className={cn(
              "flex items-center justify-center shrink-0",
              "text-[var(--color-text-muted)]",
              isCompact ? "pl-3" : "pl-4"
            )}
            aria-hidden="true"
          >
            <Search className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
          </span>

          {/* ---- Champ de saisie ---- */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || loading}
            aria-label="Votre question"
            className={cn(
              "flex-1 bg-transparent border-none outline-none",
              "text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-muted)]",
              isCompact
                ? "px-2 text-sm"
                : "px-3 text-sm sm:text-base"
            )}
          />

          {/* ---- Bouton de suppression du texte (visible si du texte est saisi) ---- */}
          {value.length > 0 && !loading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Effacer la recherche"
              className={cn(
                "flex items-center justify-center shrink-0",
                "text-[var(--color-text-muted)]",
                "hover:text-[var(--color-text-secondary)]",
                "transition-colors duration-[var(--transition-fast)]",
                "p-1 mr-1 rounded-full",
                "hover:bg-[var(--color-bg-section)]"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* ---- Bouton de soumission ---- */}
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="Lancer la recherche"
            className={cn(
              "flex items-center justify-center shrink-0",
              "bg-[var(--color-primary)] text-[var(--color-text-on-primary)]",
              "transition-all duration-[var(--transition-fast)]",

              /* Hover : fond plus foncé */
              "hover:bg-[var(--color-primary-hover)]",

              /* Taille du bouton */
              isCompact
                ? "h-7 w-7 rounded-[var(--radius-sm)] mr-1.5"
                : "h-9 w-9 sm:h-10 sm:w-10 rounded-[var(--radius-md)] mr-1.5 sm:mr-2",

              /* État désactivé : opacité réduite */
              !canSubmit && "opacity-40 cursor-not-allowed"
            )}
          >
            {loading ? (
              /* Animation de chargement : spinner rotatif */
              <span
                className={cn(
                  "border-2 border-white/30 border-t-white rounded-full animate-spin",
                  isCompact ? "h-3.5 w-3.5" : "h-4 w-4"
                )}
                aria-hidden="true"
              />
            ) : (
              <ArrowRight className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4 sm:h-5 sm:w-5"} />
            )}
          </button>
        </div>
      </form>

      {/* ================================================================
       * FILTRES RAPIDES (optionnels)
       *
       * Affichés sous la barre de recherche sous forme de toggles.
       * Chaque filtre peut être activé/désactivé indépendamment.
       * ================================================================ */}
      {filters && filters.length > 0 && onFilterToggle && (
        <div
          className={cn(
            "flex flex-wrap gap-2",
            isCompact ? "mt-2" : "mt-3"
          )}
          role="group"
          aria-label="Filtres de recherche"
        >
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter);
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onFilterToggle(filter)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center",
                  "px-3 py-1.5 text-xs font-medium",
                  "rounded-[var(--radius-full)]",
                  "border transition-all duration-[var(--transition-fast)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1",

                  /* Style actif vs inactif */
                  isActive
                    ? [
                        "bg-[var(--color-primary)] text-[var(--color-text-on-primary)]",
                        "border-[var(--color-primary)]",
                        "hover:bg-[var(--color-primary-hover)]",
                      ]
                    : [
                        "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)]",
                        "border-[var(--color-border)]",
                        "hover:bg-[var(--color-bg-section)]",
                        "hover:border-[var(--color-text-muted)]",
                      ]
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      )}

      {/* ================================================================
       * PUCES DE SUGGESTIONS
       *
       * Affiche les exemples de recherche issus de SEARCH_SUGGESTIONS.
       * Un clic remplit le champ et lance immédiatement la recherche.
       * Masquées lorsqu'un texte est déjà saisi dans le champ.
       * ================================================================ */}
      {showSuggestions && value.length === 0 && (
        <div
          className={cn(
            "flex flex-wrap gap-2",
            isCompact ? "mt-3" : "mt-4"
          )}
        >
          {/* Label de la section (pour le contexte) */}
          <span
            className={cn(
              "text-xs text-[var(--color-text-muted)] w-full",
              isCompact ? "mb-0.5" : "mb-1"
            )}
          >
            Suggestions :
          </span>

          {SEARCH_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => handleSuggestionKeyDown(e, suggestion)}
              disabled={disabled || loading}
              className={cn(
                "inline-flex items-center",
                "px-3 py-1.5 text-xs",
                "rounded-[var(--radius-full)]",
                "bg-[var(--color-bg-card)]",
                "text-[var(--color-text-secondary)]",
                "border border-[var(--color-border)]",
                "transition-all duration-[var(--transition-fast)]",

                /* Hover : fond légèrement coloré, bordure plus visible */
                "hover:bg-[var(--color-primary-light)]",
                "hover:text-[var(--color-primary)]",
                "hover:border-[var(--color-primary)]/30",

                /* Focus accessible */
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                "focus-visible:ring-offset-1",

                /* État désactivé */
                (disabled || loading) && "opacity-50 cursor-not-allowed"
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

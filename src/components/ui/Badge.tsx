/* =============================================================================
 * components/ui/Badge.tsx
 *
 * Composant badge / tag réutilisable pour l'application Dixipolis.
 *
 * Utilisé pour afficher des thèmes, des catégories, des statuts ou tout
 * label court nécessitant une mise en avant visuelle.
 *
 * Fonctionnalités :
 *   - 4 variantes : default (bleu), success (vert), warning (orange), error (rouge)
 *   - 2 tailles : sm (petit) et md (moyen, par défaut)
 *   - Icône optionnelle à gauche du texte
 *   - Peut être rendu en tant que bouton cliquable (via onClick)
 *   - Compatible avec les overrides de classes via className
 *
 * Utilisation :
 *   <Badge>Économie</Badge>
 *   <Badge variant="success">Vérifié</Badge>
 *   <Badge variant="warning" size="sm">En attente</Badge>
 *   <Badge variant="error" icon={<AlertCircle />}>Erreur</Badge>
 *   <Badge onClick={() => handleFilter("Écologie")}>Écologie</Badge>
 * ============================================================================= */

import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Types — Variantes et tailles
 * -------------------------------------------------------------------------- */

/** Les 4 variantes visuelles du badge */
type BadgeVariant = "default" | "success" | "warning" | "error";

/** Les 2 tailles disponibles */
type BadgeSize = "sm" | "md";

/* --------------------------------------------------------------------------
 * Props du composant Badge
 * -------------------------------------------------------------------------- */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Variante visuelle du badge (défaut : "default") */
  variant?: BadgeVariant;

  /** Taille du badge (défaut : "md") */
  size?: BadgeSize;

  /** Icône optionnelle affichée à gauche du texte */
  icon?: ReactNode;

  /** Contenu du badge (texte du tag / thème) */
  children: ReactNode;

  /** Classes CSS supplémentaires */
  className?: string;
}

/* --------------------------------------------------------------------------
 * Styles — Classes Tailwind par variante
 *
 * Chaque variante utilise un fond pastel et un texte de couleur foncée
 * correspondante pour garantir un bon contraste et une cohérence visuelle.
 * -------------------------------------------------------------------------- */
const variantClasses: Record<BadgeVariant, string> = {
  /* Défaut : bleu Dixipolis — utilisé pour les thèmes et tags génériques */
  default: cn(
    "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
  ),

  /* Succès : vert — utilisé pour les statuts positifs, vérifications */
  success: cn(
    "bg-green-50 text-[var(--color-success)]"
  ),

  /* Avertissement : jaune/orange — utilisé pour les statuts en attente */
  warning: cn(
    "bg-yellow-50 text-[var(--color-warning)]"
  ),

  /* Erreur : rouge — utilisé pour les alertes, erreurs, contradictions */
  error: cn(
    "bg-red-50 text-[var(--color-error)]"
  ),
};

/* Classes par taille */
const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

/* --------------------------------------------------------------------------
 * Composant Badge
 * -------------------------------------------------------------------------- */
export function Badge({
  variant = "default",
  size = "md",
  icon,
  children,
  className,
  onClick,
  ...restProps
}: BadgeProps) {
  /*
   * Si un onClick est fourni, le badge devient interactif.
   * On ajoute alors un curseur pointer et un effet hover.
   */
  const isClickable = Boolean(onClick);

  return (
    <span
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              /* Permet l'activation au clavier (Entrée / Espace) */
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(e as unknown as React.MouseEvent<HTMLSpanElement>);
              }
            }
          : undefined
      }
      className={cn(
        /* Base : inline-flex, centré, arrondi en pilule, police medium */
        "inline-flex items-center font-medium",
        "rounded-[var(--radius-full)]",
        "whitespace-nowrap select-none",

        /* Transition pour les états interactifs */
        "transition-colors duration-[var(--transition-fast)]",

        /* Variante et taille */
        variantClasses[variant],
        sizeClasses[size],

        /* Styles interactifs : ajoutés uniquement si onClick est défini */
        isClickable && [
          "cursor-pointer",
          "hover:opacity-80",
          "active:opacity-70",
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1",
        ],

        /* Override de classes personnalisées */
        className
      )}
      {...restProps}
    >
      {/* Icône optionnelle à gauche */}
      {icon && (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Texte du badge */}
      {children}
    </span>
  );
}

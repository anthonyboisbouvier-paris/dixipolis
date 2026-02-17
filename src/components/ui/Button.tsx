/* =============================================================================
 * components/ui/Button.tsx
 *
 * Composant bouton réutilisable pour l'application Dixipolis.
 *
 * Fonctionnalités :
 *   - 4 variantes visuelles : primary, secondary, outline, ghost
 *   - 3 tailles : sm (petit), md (moyen), lg (grand)
 *   - Support de l'état désactivé (disabled)
 *   - Support de l'état de chargement (loading) avec animation
 *   - Possibilité d'ajouter une icône à gauche ou à droite
 *   - Mode lien : rendu en <a> au lieu de <button> via la prop "href"
 *   - Compatible avec les overrides de classes via className
 *
 * Utilisation :
 *   <Button variant="primary" size="md" onClick={handleClick}>
 *     Valider
 *   </Button>
 *
 *   <Button variant="outline" size="sm" iconLeft={<Search />}>
 *     Rechercher
 *   </Button>
 *
 *   <Button href="/contact" variant="ghost">
 *     Nous contacter
 *   </Button>
 * ============================================================================= */

"use client";

import { forwardRef } from "react";
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Types — Variantes et tailles disponibles
 * -------------------------------------------------------------------------- */

/** Les 4 variantes visuelles du bouton */
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

/** Les 3 tailles du bouton */
type ButtonSize = "sm" | "md" | "lg";

/* --------------------------------------------------------------------------
 * Props partagées — Communes aux modes bouton et lien
 * -------------------------------------------------------------------------- */
interface ButtonBaseProps {
  /** Variante visuelle du bouton (défaut : "primary") */
  variant?: ButtonVariant;

  /** Taille du bouton (défaut : "md") */
  size?: ButtonSize;

  /** Affiche un indicateur de chargement et désactive le bouton */
  loading?: boolean;

  /** Icône à afficher à gauche du texte */
  iconLeft?: ReactNode;

  /** Icône à afficher à droite du texte */
  iconRight?: ReactNode;

  /** Contenu du bouton (texte, icônes, etc.) */
  children: ReactNode;

  /** Classes CSS supplémentaires */
  className?: string;
}

/* --------------------------------------------------------------------------
 * Props conditionnelles — Bouton natif OU lien (<a>)
 * Si "href" est fourni, le composant se comporte comme un lien.
 * Sinon, il se comporte comme un <button> HTML standard.
 * -------------------------------------------------------------------------- */
type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    /** Pas de href => rendu en <button> */
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    /** Présence de href => rendu en <a> */
    href: string;
  };

/** Props finales du composant : union discriminée par la présence de "href" */
export type ButtonProps = ButtonAsButton | ButtonAsLink;

/* --------------------------------------------------------------------------
 * Styles — Classes Tailwind mappées par variante et taille
 * -------------------------------------------------------------------------- */

/**
 * Classes par variante.
 * Chaque variante définit les couleurs de fond, texte, bordure
 * et les états hover / focus / active.
 */
const variantClasses: Record<ButtonVariant, string> = {
  /* Bouton principal — fond bleu, texte blanc */
  primary: cn(
    "bg-[var(--color-primary)] text-[var(--color-text-on-primary)]",
    "hover:bg-[var(--color-primary-hover)]",
    "active:bg-[var(--color-primary-800)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
  ),

  /* Bouton secondaire — fond bleu clair, texte bleu */
  secondary: cn(
    "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
    "hover:bg-[var(--color-primary-100)]",
    "active:bg-[var(--color-primary-100)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
  ),

  /* Bouton contour — fond transparent, bordure visible */
  outline: cn(
    "bg-transparent text-[var(--color-text-primary)]",
    "border border-[var(--color-border)]",
    "hover:bg-[var(--color-bg-section)] hover:border-[var(--color-text-muted)]",
    "active:bg-[var(--color-primary-light)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
  ),

  /* Bouton fantôme — aucun fond, aucun contour par défaut */
  ghost: cn(
    "bg-transparent text-[var(--color-text-secondary)]",
    "hover:bg-[var(--color-bg-section)] hover:text-[var(--color-text-primary)]",
    "active:bg-[var(--color-primary-light)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
  ),
};

/**
 * Classes par taille.
 * Contrôlent le padding, la taille de police et la hauteur.
 */
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-base gap-2.5 rounded-[var(--radius-md)]",
};

/* --------------------------------------------------------------------------
 * Composant Button
 * Utilise forwardRef pour permettre le passage de ref depuis le parent.
 * -------------------------------------------------------------------------- */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    iconLeft,
    iconRight,
    children,
    className,
    ...restProps
  } = props;

  /* Désactivé si la prop disabled est true OU si loading est actif */
  const isDisabled =
    loading || ("disabled" in restProps ? restProps.disabled : false);

  /* Classes communes à toutes les configurations */
  const sharedClasses = cn(
    /* Base : flex inline, centré, police medium, transition */
    "inline-flex items-center justify-center font-medium",
    "transition-all duration-[var(--transition-fast)]",
    "select-none whitespace-nowrap",

    /* Variante et taille */
    variantClasses[variant],
    sizeClasses[size],

    /* État désactivé : opacité réduite, curseur interdit */
    isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",

    /* Classes personnalisées (override) */
    className
  );

  /* ---- Contenu interne du bouton ---- */
  const innerContent = (
    <>
      {/* Icône de chargement : remplace l'icône gauche si loading */}
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        iconLeft && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {iconLeft}
          </span>
        )
      )}

      {/* Texte / contenu principal */}
      <span>{children}</span>

      {/* Icône droite (masquée pendant le chargement) */}
      {!loading && iconRight && (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </>
  );

  /* ---- Rendu conditionnel : lien ou bouton ---- */

  /* Si "href" est fourni, on rend un <a> */
  if ("href" in props && props.href !== undefined) {
    const { href, variant: _variant, size: _size, loading: _loading, iconLeft: _il, iconRight: _ir, ...linkProps } = props as ButtonAsLink;
    void _variant; void _size; void _loading; void _il; void _ir;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={sharedClasses}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
        {...linkProps}
      >
        {innerContent}
      </a>
    );
  }

  /* Sinon, on rend un <button> classique */
  const { variant: _variant2, size: _size2, loading: _loading2, iconLeft: _il2, iconRight: _ir2, ...buttonProps } = restProps as Omit<ButtonAsButton, "children" | "className">;
  void _variant2; void _size2; void _loading2; void _il2; void _ir2;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={"type" in buttonProps ? buttonProps.type : "button"}
      className={sharedClasses}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {innerContent}
    </button>
  );
});

/* Nom d'affichage pour le débogage dans React DevTools */
Button.displayName = "Button";

/* =============================================================================
 * components/ui/Input.tsx
 *
 * Composant champ de saisie réutilisable pour l'application Dixipolis.
 *
 * Fonctionnalités :
 *   - Label optionnel positionné au-dessus du champ
 *   - Message d'erreur avec mise en évidence visuelle
 *   - Texte d'aide optionnel (hint) sous le champ
 *   - Icône préfixe à gauche du champ (ex: icône de recherche)
 *   - Compatible avec tous les types HTML natifs (text, email, password, etc.)
 *   - Accessibilité : liaison label/input via id, aria-describedby, aria-invalid
 *   - Override de classes via className
 *
 * Utilisation :
 *   <Input
 *     label="Adresse e-mail"
 *     type="email"
 *     placeholder="nom@exemple.fr"
 *     error="Veuillez entrer un e-mail valide"
 *   />
 *
 *   <Input
 *     label="Recherche"
 *     iconPrefix={<Search className="h-4 w-4" />}
 *     placeholder="Chercher un politicien..."
 *   />
 * ============================================================================= */

"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Props du composant Input
 * Étend les attributs natifs <input> pour une compatibilité totale.
 * -------------------------------------------------------------------------- */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  /** Label affiché au-dessus du champ */
  label?: string;

  /** Message d'erreur affiché sous le champ (active aussi le style d'erreur) */
  error?: string;

  /** Texte d'aide affiché sous le champ (masqué si une erreur est présente) */
  hint?: string;

  /** Icône affichée à gauche dans le champ (préfixe) */
  iconPrefix?: ReactNode;

  /** Classes CSS supplémentaires pour le conteneur principal */
  containerClassName?: string;

  /** Classes CSS supplémentaires pour l'élément <input> */
  className?: string;
}

/* --------------------------------------------------------------------------
 * Composant Input
 * Utilise forwardRef pour permettre l'accès direct au <input> DOM.
 * -------------------------------------------------------------------------- */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      iconPrefix,
      containerClassName,
      className,
      id: externalId,
      disabled,
      ...inputProps
    },
    ref
  ) {
    /*
     * Génération d'un ID unique via useId() de React 18+.
     * Permet de lier le <label> au <input> sans risque de collision.
     * Si un id externe est fourni, il est prioritaire.
     */
    const generatedId = useId();
    const inputId = externalId ?? generatedId;

    /* ID pour le message d'erreur ou d'aide (utilisé par aria-describedby) */
    const descriptionId = `${inputId}-description`;

    /* Détermine si le champ est en état d'erreur */
    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {/* ---- Label ---- */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium",
              "text-[var(--color-text-primary)]",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}

        {/* ---- Conteneur du champ avec icône ---- */}
        <div className="relative">
          {/* Icône préfixe positionnée à gauche dans le champ */}
          {iconPrefix && (
            <span
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "text-[var(--color-text-muted)]",
                "pointer-events-none",
                hasError && "text-[var(--color-error)]"
              )}
              aria-hidden="true"
            >
              {iconPrefix}
            </span>
          )}

          {/* ---- Champ de saisie ---- */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={
              error || hint ? descriptionId : undefined
            }
            className={cn(
              /* Base : taille, espacement, police */
              "h-10 w-full px-3 text-sm",
              "rounded-[var(--radius-md)]",
              "font-[var(--font-sans)]",

              /* Couleurs par défaut */
              "bg-[var(--color-bg-card)]",
              "text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-muted)]",

              /* Bordure */
              "border border-[var(--color-border)]",

              /* Transition fluide pour les changements d'état */
              "transition-colors duration-[var(--transition-fast)]",

              /* État focus : bordure bleue + anneau */
              "focus:outline-none",
              "focus:border-[var(--color-primary)]",
              "focus:ring-2 focus:ring-[var(--color-primary)]/20",

              /* État erreur : bordure et anneau rouges */
              hasError && [
                "border-[var(--color-error)]",
                "focus:border-[var(--color-error)]",
                "focus:ring-[var(--color-error)]/20",
              ],

              /* État désactivé */
              disabled && "opacity-50 cursor-not-allowed bg-[var(--color-bg-section)]",

              /* Padding supplémentaire si une icône préfixe est présente */
              iconPrefix && "pl-10",

              /* Classes personnalisées */
              className
            )}
            {...inputProps}
          />
        </div>

        {/* ---- Message d'erreur OU texte d'aide ---- */}
        {(error || hint) && (
          <p
            id={descriptionId}
            className={cn(
              "text-xs",
              hasError
                ? "text-[var(--color-error)]"
                : "text-[var(--color-text-muted)]"
            )}
            role={hasError ? "alert" : undefined}
          >
            {/* L'erreur est prioritaire sur le hint */}
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

/* Nom d'affichage pour React DevTools */
Input.displayName = "Input";

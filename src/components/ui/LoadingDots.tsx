/* =============================================================================
 * components/ui/LoadingDots.tsx
 *
 * Composant d'animation de chargement sous forme de 3 points pulsants.
 *
 * Utilisé comme indicateur visuel de chargement dans l'application Dixipolis,
 * notamment dans :
 *   - L'interface de chat/prompt (pendant la génération d'une réponse IA)
 *   - Les listes de résultats en cours de chargement
 *   - Les boutons en état de chargement (alternative au spinner)
 *
 * L'animation utilise les keyframes "pulse-dot" définis dans globals.css :
 *   - Les 3 points pulsent en séquence avec un décalage de 0.2s entre chaque
 *   - L'opacité varie de 0.3 à 1 pour un effet de vague fluide
 *   - L'échelle varie de 0.8 à 1 pour accentuer la pulsation
 *
 * Fonctionnalités :
 *   - 2 tailles : sm (petit) et md (moyen, par défaut)
 *   - Couleur personnalisable via la prop color
 *   - Accessible : rôle "status" et label aria pour les lecteurs d'écran
 *   - Compatible avec les overrides de classes via className
 *
 * Utilisation :
 *   <LoadingDots />
 *   <LoadingDots size="sm" />
 *   <LoadingDots color="text-white" />
 *   <LoadingDots label="Génération en cours..." />
 * ============================================================================= */

import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Types — Tailles disponibles
 * -------------------------------------------------------------------------- */
type LoadingDotsSize = "sm" | "md";

/* --------------------------------------------------------------------------
 * Props du composant LoadingDots
 * -------------------------------------------------------------------------- */
export interface LoadingDotsProps {
  /** Taille des points (défaut : "md") */
  size?: LoadingDotsSize;

  /** Classe Tailwind pour la couleur des points (défaut : couleur text-muted) */
  color?: string;

  /** Label pour l'accessibilité (défaut : "Chargement en cours") */
  label?: string;

  /** Classes CSS supplémentaires pour le conteneur */
  className?: string;
}

/* --------------------------------------------------------------------------
 * Styles par taille
 * Contrôlent la dimension des points et l'espacement.
 * -------------------------------------------------------------------------- */
const sizeClasses: Record<LoadingDotsSize, { dot: string; gap: string }> = {
  sm: { dot: "h-1.5 w-1.5", gap: "gap-1" },
  md: { dot: "h-2 w-2", gap: "gap-1.5" },
};

/* --------------------------------------------------------------------------
 * Composant LoadingDots
 *
 * Rend 3 points circulaires animés en séquence.
 * L'animation est pilotée par les classes CSS "loading-dot" de globals.css
 * qui appliquent le keyframe "pulse-dot" avec des délais différés.
 * -------------------------------------------------------------------------- */
export function LoadingDots({
  size = "md",
  color,
  label = "Chargement en cours",
  className,
}: LoadingDotsProps) {
  const { dot, gap } = sizeClasses[size];

  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-flex items-center",
        gap,
        className
      )}
    >
      {/*
       * Les 3 points de chargement.
       * Chaque point utilise la classe "loading-dot" de globals.css
       * qui applique l'animation pulse-dot avec un délai croissant :
       *   - Point 1 : délai 0s (défaut)
       *   - Point 2 : délai 0.2s (:nth-child(2))
       *   - Point 3 : délai 0.4s (:nth-child(3))
       */}
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            "loading-dot rounded-full",
            dot,
            /* Couleur : utilise la couleur personnalisée ou le gris muted */
            color ?? "bg-[var(--color-text-muted)]"
          )}
          aria-hidden="true"
        />
      ))}

      {/* Texte masqué pour les lecteurs d'écran */}
      <span className="sr-only">{label}</span>
    </span>
  );
}

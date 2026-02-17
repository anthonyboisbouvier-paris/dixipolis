/* =============================================================================
 * hooks/useMediaQuery.ts
 *
 * Hook React pour détecter les media queries (responsive design).
 * Permet de conditionner le rendu selon la taille de l'écran.
 * ============================================================================= */

"use client";

import { useState, useEffect } from "react";

/**
 * useMediaQuery — Retourne true si la media query correspond.
 * @param query - Media query CSS (ex: "(min-width: 768px)")
 * @returns boolean
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

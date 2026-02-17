/* =============================================================================
 * hooks/useMediaQuery.ts
 *
 * Hook React pour détecter les media queries (responsive design).
 * Permet de conditionner le rendu selon la taille de l'écran.
 * ============================================================================= */

"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * useMediaQuery — Retourne true si la media query correspond.
 *
 * Utilise useSyncExternalStore (React 18+) pour souscrire aux changements
 * de media query sans appeler setState dans un useEffect, ce qui est
 * conforme aux règles react-hooks/set-state-in-effect.
 *
 * @param query - Media query CSS (ex: "(min-width: 768px)")
 * @returns boolean
 */
export function useMediaQuery(query: string): boolean {
  // Souscription aux changements de la media query
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    [query]
  );

  // Snapshot côté client : valeur actuelle de la media query
  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  // Snapshot côté serveur (SSR) : toujours false
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

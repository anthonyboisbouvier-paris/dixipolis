/* =============================================================================
 * app/error.tsx
 *
 * Page d'erreur globale affichée en cas d'erreur non gérée.
 * Doit être un Client Component (requis par Next.js).
 * ============================================================================= */

"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /* Log l'erreur pour le monitoring (futur Sentry) */
  useEffect(() => {
    console.error("Erreur applicative :", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icône d'erreur */}
        <div
          className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: "var(--color-error-light)" }}
        >
          <AlertTriangle
            className="w-8 h-8"
            style={{ color: "var(--color-error)" }}
          />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          Une erreur est survenue
        </h1>

        <p
          className="mb-8 text-base"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Nous sommes désolés, quelque chose s&apos;est mal passé.
          Veuillez réessayer ou revenir à l&apos;accueil.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-primary"
          >
            <RotateCcw className="w-4 h-4" />
            Réessayer
          </button>

          <Link href="/" className="btn-secondary">
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

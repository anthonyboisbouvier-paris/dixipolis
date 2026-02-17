/* =============================================================================
 * app/not-found.tsx
 *
 * Page 404 personnalisée pour Dixipolis.
 * Affichée automatiquement par Next.js quand une route n'existe pas.
 * ============================================================================= */

import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* ----- Code d'erreur ----- */}
        <p className="text-8xl font-bold" style={{ color: "var(--color-primary)" }}>
          404
        </p>

        {/* ----- Titre ----- */}
        <h1 className="mt-4 text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
          Page introuvable
        </h1>

        {/* ----- Description ----- */}
        <p className="mt-3 text-base" style={{ color: "var(--color-text-secondary)" }}>
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          Peut-être qu&apos;une recherche dans notre base de discours politiques
          vous aidera à trouver ce que vous cherchez.
        </p>

        {/* ----- Boutons d'action ----- */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Retour à l'accueil */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg text-white transition-colors"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>

          {/* Aller au Prompt */}
          <Link
            href="/prompt"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg border transition-colors"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            <Search className="w-4 h-4" />
            Rechercher un discours
          </Link>
        </div>

        {/* ----- Lien retour ----- */}
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1 text-sm transition-colors"
          style={{ color: "var(--color-text-muted)" }}
        >
          Retourner à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

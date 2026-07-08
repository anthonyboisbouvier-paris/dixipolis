/* =============================================================================
 * components/home/LivePreview.tsx
 *
 * Section "Aperçu" — vitrine honnête : montre 2 résultats RÉELS de recherche
 * (app_search_transcripts, requête "pouvoir d'achat") passés en props depuis
 * app/page.tsx, avec leur vraie source et lien YouTube horodaté.
 * Si aucune donnée n'est disponible, la section est masquée.
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import { Play, Clock, User, ExternalLink, Search } from "lucide-react";
import { formatDate, formatTimecode } from "@/lib/utils";
import type { TranscriptResult } from "@/lib/supabase-server";

/* -------------------------------------------------------------------------- */
export default function LivePreview({
  results,
  query,
}: {
  results: TranscriptResult[];
  query: string;
}) {
  /* Pas de données réelles → on masque la section (honnêteté avant tout) */
  if (results.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: "var(--color-bg-page)" }}
      aria-label="Exemples réels tirés du corpus Dixipolis"
    >
      <div className="page-container">
        {/* En-tête */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--color-text-primary)" }}>
            Voyez par vous-m&ecirc;me
          </h2>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Voici ce que retourne Dixipolis quand vous posez une question.
            Chaque r&eacute;sultat est sourc&eacute; avec vid&eacute;o et timecode.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {/* Requête réellement exécutée sur le corpus */}
          <div
            className="mb-6 flex items-center gap-3 rounded-2xl border-2 px-5 py-4"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-bg-card)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Search className="h-5 w-5 shrink-0" style={{ color: "var(--color-primary)" }} />
            <p className="text-base font-medium" style={{ color: "var(--color-text-primary)" }}>
              {query}
            </p>
          </div>

          {/* Label d'honnêteté */}
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
              Exemple r&eacute;el tir&eacute; du corpus
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              &middot; {results.length} extrait{results.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Résultats réels */}
          <div className="space-y-4">
            {results.map((result) => (
              <a
                key={result.segment_id}
                href={`https://www.youtube.com/watch?v=${result.youtube_id}&t=${Math.max(0, Math.floor(result.start_sec))}s`}
                target="_blank"
                rel="noopener noreferrer"
                className="card block overflow-hidden p-5 transition-shadow duration-300 hover:shadow-lg"
              >
                {/* Header du résultat */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />
                    <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {result.person_name ?? "Locuteur non identifié"}
                    </span>
                  </div>
                  {result.party && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {result.party}
                    </span>
                  )}
                  {result.published_at && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      <Clock className="h-3 w-3" />
                      {formatDate(result.published_at)}
                    </span>
                  )}
                </div>

                {/* Citation réelle */}
                <div
                  className="mb-3 rounded-lg border-l-4 py-2 pl-4"
                  style={{
                    borderColor: "var(--color-primary)",
                    backgroundColor: "var(--color-primary-light)",
                  }}
                >
                  <p className="text-sm italic leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                    &laquo;&nbsp;{result.text.trim()}&nbsp;&raquo;
                  </p>
                </div>

                {/* Source vidéo réelle */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-md"
                    style={{ backgroundColor: "var(--color-error-light)", color: "var(--color-error)" }}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      {result.video_title}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                      {result.channel ?? "Chaîne inconnue"} &middot; &agrave; {formatTimecode(result.start_sec)}
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 * app/videos/page.tsx
 *
 * Bibliothèque des vidéos transcrites du corpus Dixipolis.
 *
 * Composant serveur (Server Component, force-dynamic). Les données viennent
 * d'un appel RPC Supabase (app_list_videos) : recherche via ?q= (formulaire
 * GET) et pagination via ?page=. Chaque carte pointe vers la page transcript
 * /video/<youtube_id>. Miniatures YouTube en lazy loading.
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Mic2,
  Search,
  SearchX,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { rpc } from "@/lib/supabase-server";
import { formatDate, formatDuration, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vidéos | Dixipolis",
  description:
    "Bibliothèque des vidéos politiques transcrites par Dixipolis : assemblées, interviews, meetings — chaque vidéo avec sa transcription complète.",
};

/* --------------------------------------------------------------------------
 * Types du contrat RPC app_list_videos
 * -------------------------------------------------------------------------- */
interface VideoListItem {
  title: string;
  channel: string | null;
  duration: number | null;
  published_at: string;
  youtube_id: string;
  n_segments: number;
}

interface VideoListResponse {
  total: number;
  page: number;
  videos: VideoListItem[];
}

const PER_PAGE = 12;

/* --------------------------------------------------------------------------
 * Helper : URL de pagination en conservant la recherche
 * -------------------------------------------------------------------------- */
function pageHref(page: number, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/videos?${qs}` : "/videos";
}

/* -------------------------------------------------------------------------- */
export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: rawPage } = await searchParams;
  const query = (q ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  /* Données réelles — un seul appel RPC */
  const data = await rpc<VideoListResponse>("app_list_videos", {
    p_page: page,
    p_per_page: PER_PAGE,
    p_query: query || null,
  });

  const videos = data?.videos ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <PageWrapper className="py-8">
      {/* ── En-tête avec compteur réel ──────────────────────────────────── */}
      <section className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
          <Film className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
          {data ? `${formatNumber(total)} vidéos transcrites` : "Bibliothèque du corpus"}
        </div>
        <h1 className="mb-2 text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Vid&eacute;os
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          Toutes les vid&eacute;os politiques transcrites mot &agrave; mot.
          Ouvrez une vid&eacute;o pour lire son transcript complet, locuteur par
          locuteur.
        </p>
      </section>

      {/* ── Barre de recherche (formulaire GET, sans JS) ────────────────── */}
      <form action="/videos" method="get" className="mb-8" role="search">
        <div className="flex max-w-xl items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 shadow-sm transition-shadow focus-within:border-[var(--color-primary)] focus-within:shadow-md">
          <Search className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder="Rechercher une vidéo (titre, chaîne…)"
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
            aria-label="Rechercher une vidéo"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Rechercher
          </button>
        </div>
      </form>

      {/* ── Grille de cartes / états vides ──────────────────────────────── */}
      {videos.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center shadow-sm">
          <SearchX className="mx-auto mb-3 h-8 w-8 text-[var(--color-text-muted)]" aria-hidden="true" />
          <h2 className="mb-1 text-base font-semibold text-[var(--color-text-primary)]">
            {data === null ? "Données indisponibles" : "Aucune vidéo trouvée"}
          </h2>
          <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
            {data === null
              ? "Impossible de joindre la base. Réessayez dans un instant."
              : query
                ? `Aucun résultat pour « ${query} ».`
                : "La bibliothèque est vide pour le moment."}
          </p>
          {query && (
            <Link
              href="/videos"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Voir toutes les vid&eacute;os
            </Link>
          )}
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <li key={v.youtube_id}>
                <Link
                  href={`/video/${v.youtube_id}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-bg-section)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${v.youtube_id}/mqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {v.duration ? (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {formatDuration(v.duration)}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-text-primary)]">
                      {v.title}
                    </p>
                    <p className="truncate text-xs text-[var(--color-text-secondary)]">
                      {v.channel ?? "Chaîne inconnue"}
                      {v.published_at ? ` · ${formatDate(v.published_at)}` : ""}
                    </p>
                    <p className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[11px] text-[var(--color-text-muted)]">
                      <Mic2 className="h-3 w-3" aria-hidden="true" />
                      {formatNumber(v.n_segments)} segment{v.n_segments > 1 ? "s" : ""} transcrit{v.n_segments > 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Pagination précédent / suivant ──────────────────────────── */}
          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-3"
              aria-label="Pagination des vidéos"
            >
              <Link
                href={hasPrev ? pageHref(page - 1, query) : "#"}
                aria-disabled={!hasPrev}
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-sm font-medium shadow-sm transition-shadow hover:shadow-md ${
                  hasPrev
                    ? "text-[var(--color-text-primary)]"
                    : "pointer-events-none opacity-40"
                }`}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Pr&eacute;c&eacute;dent
              </Link>
              <span className="text-sm text-[var(--color-text-secondary)]">
                Page {page} / {totalPages}
              </span>
              <Link
                href={hasNext ? pageHref(page + 1, query) : "#"}
                aria-disabled={!hasNext}
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-sm font-medium shadow-sm transition-shadow hover:shadow-md ${
                  hasNext
                    ? "text-[var(--color-text-primary)]"
                    : "pointer-events-none opacity-40"
                }`}
              >
                Suivant
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </nav>
          )}
        </>
      )}
    </PageWrapper>
  );
}

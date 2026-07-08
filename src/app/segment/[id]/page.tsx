/* =============================================================================
 * app/segment/[id]/page.tsx
 *
 * Vérification en contexte d'un extrait — l'anti « sorti de son contexte ».
 *
 * Composant serveur (Server Component, force-dynamic). Un appel RPC Supabase
 * (app_segment_context) renvoie la vidéo source et les segments entourant
 * l'extrait cible dans une fenêtre de ±N secondes (90 s par défaut,
 * élargissable via ?window=, borné à 300 s). Le segment cible est surligné.
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  Play,
  Quote,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { rpc } from "@/lib/supabase-server";
import { formatDate, formatTimecode } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Extrait en contexte | Dixipolis",
  description:
    "Vérifiez un extrait politique dans son contexte : les secondes qui précèdent et qui suivent, avec la vidéo source horodatée.",
};

/* --------------------------------------------------------------------------
 * Types du contrat RPC app_segment_context
 * -------------------------------------------------------------------------- */
interface ContextSegment {
  id: number;
  text: string;
  start_sec: number;
  is_target: boolean;
  person_name: string | null;
}

interface SegmentContext {
  video: {
    title: string;
    youtube_id: string;
    published_at: string;
  };
  segments: ContextSegment[];
}

const DEFAULT_WINDOW = 90;
const MIN_WINDOW = 90;
const MAX_WINDOW = 300;

/* -------------------------------------------------------------------------- */
export default async function SegmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ window?: string }>;
}) {
  const [{ id }, { window: rawWindow }] = await Promise.all([
    params,
    searchParams,
  ]);

  const segmentId = Number.parseInt(id, 10);
  if (!Number.isFinite(segmentId) || segmentId <= 0) notFound();

  /* Fenêtre de contexte lue depuis ?window=, bornée [90, 300] secondes */
  const parsedWindow = Number.parseInt(rawWindow ?? "", 10);
  const windowSec = Math.min(
    MAX_WINDOW,
    Math.max(MIN_WINDOW, Number.isFinite(parsedWindow) ? parsedWindow : DEFAULT_WINDOW)
  );

  const data = await rpc<SegmentContext | null>("app_segment_context", {
    p_segment_id: segmentId,
    p_window_sec: windowSec,
  });
  if (!data || !data.video) notFound();

  const { video, segments } = data;
  const target = segments.find((s) => s.is_target);
  const canWiden = windowSec < MAX_WINDOW;
  const canNarrow = windowSec > MIN_WINDOW;

  return (
    <PageWrapper className="py-8">
      <div className="mx-auto max-w-3xl">
        {/* ── En-tête ───────────────────────────────────────────────────── */}
        <section className="mb-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
            <Quote className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
            V&eacute;rification en contexte
          </div>
          <h1 className="mb-2 text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            L&apos;extrait dans son contexte
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Les {windowSec} secondes qui entourent l&apos;extrait, dans
            l&apos;ordre chronologique. Le passage cible est surlign&eacute;.
          </p>
        </section>

        {/* ── Vidéo source ──────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-sm">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
              {video.title}
            </p>
            {video.published_at && (
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                {formatDate(video.published_at)}
              </p>
            )}
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtube_id}&t=${Math.max(0, Math.floor(target?.start_sec ?? 0))}s`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-md"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Voir &agrave; {formatTimecode(target?.start_sec ?? 0)}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>

        {/* ── Boutons ±90 s de contexte ─────────────────────────────────── */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={canNarrow ? `/segment/${segmentId}?window=${windowSec - 90}` : "#"}
            aria-disabled={!canNarrow}
            className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3.5 py-1.5 text-xs font-medium shadow-sm transition-shadow hover:shadow-md ${
              canNarrow ? "text-[var(--color-text-primary)]" : "pointer-events-none opacity-40"
            }`}
          >
            <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
            &minus;90&nbsp;s de contexte
          </Link>
          <Link
            href={canWiden ? `/segment/${segmentId}?window=${windowSec + 90}` : "#"}
            aria-disabled={!canWiden}
            className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3.5 py-1.5 text-xs font-medium shadow-sm transition-shadow hover:shadow-md ${
              canWiden ? "text-[var(--color-text-primary)]" : "pointer-events-none opacity-40"
            }`}
          >
            <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
            +90&nbsp;s de contexte
          </Link>
        </div>

        {/* ── Segments dans l'ordre, cible surlignée ────────────────────── */}
        <ol className="space-y-2">
          {segments.map((s) => (
            <li
              key={s.id}
              className={
                s.is_target
                  ? "rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-primary-light)] p-4 shadow-sm"
                  : "rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-sm"
              }
              aria-current={s.is_target ? "true" : undefined}
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`font-semibold ${
                    s.is_target
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {s.person_name ?? "Locuteur non identifié"}
                </span>
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtube_id}&t=${Math.max(0, Math.floor(s.start_sec))}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto font-mono text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:underline"
                >
                  {formatTimecode(s.start_sec)}
                </a>
                {s.is_target && (
                  <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                    Extrait cit&eacute;
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                {s.text.trim()}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-[11px] text-[var(--color-text-muted)]">
          Transcription automatique &mdash; v&eacute;rifiez toujours avec la
          vid&eacute;o source horodat&eacute;e.
        </p>
      </div>
    </PageWrapper>
  );
}

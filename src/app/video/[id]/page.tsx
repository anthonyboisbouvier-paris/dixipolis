/* =============================================================================
 * app/video/[id]/page.tsx
 *
 * Transcript complet d'une vidéo — la feature phare du corpus Dixipolis.
 *
 * Composant serveur (Server Component, force-dynamic). Un unique appel RPC
 * Supabase (app_video_transcript) renvoie la vidéo et TOUS ses segments
 * (jusqu'à 2500, ordonnés). Les segments successifs d'un même speaker_label
 * sont regroupés côté serveur en « tours de parole » : rendu 100 % serveur,
 * aucun JavaScript client, même pour les très longs transcripts.
 *
 * Chaque tour affiche : le locuteur résolu (lien vers sa fiche) ou son label
 * de diarisation, le timecode de début (lien YouTube horodaté) et le texte
 * fusionné. Un sommaire sticky récapitule tours et intervenants identifiés.
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  MicOff,
  Play,
  Radio,
  Users,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { rpc } from "@/lib/supabase-server";
import {
  formatDate,
  formatDuration,
  formatNumber,
  formatTimecode,
  slugify,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transcription vidéo | Dixipolis",
  description:
    "Transcription complète et horodatée d'une vidéo politique : chaque prise de parole attribuée à son auteur, avec liens YouTube minutés.",
};

/* --------------------------------------------------------------------------
 * Types du contrat RPC app_video_transcript
 * -------------------------------------------------------------------------- */
interface TranscriptSegment {
  id: number;
  text: string;
  start_sec: number;
  end_sec: number;
  speaker_label: string | null;
  person_name: string | null;
  party: string | null;
}

interface VideoTranscript {
  video: {
    title: string;
    channel: string | null;
    duration: number | null;
    published_at: string;
    youtube_id: string;
    description: string | null;
  };
  segments: TranscriptSegment[];
}

/* --------------------------------------------------------------------------
 * Regroupement : segments successifs du même speaker_label → tour de parole
 * -------------------------------------------------------------------------- */
interface SpeakingTurn {
  key: number;
  speaker_label: string | null;
  person_name: string | null;
  party: string | null;
  start_sec: number;
  text: string;
}

function groupBySpeaker(segments: TranscriptSegment[]): SpeakingTurn[] {
  const turns: SpeakingTurn[] = [];
  for (const seg of segments) {
    const last = turns[turns.length - 1];
    if (last && last.speaker_label === seg.speaker_label) {
      last.text += ` ${seg.text.trim()}`;
    } else {
      turns.push({
        key: seg.id,
        speaker_label: seg.speaker_label,
        person_name: seg.person_name,
        party: seg.party,
        start_sec: seg.start_sec,
        text: seg.text.trim(),
      });
    }
  }
  return turns;
}

/* -------------------------------------------------------------------------- */
export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* ID YouTube : 11 caractères alphanumériques (+ "-" et "_") */
  if (!/^[\w-]{5,20}$/.test(id)) notFound();

  const data = await rpc<VideoTranscript | null>("app_video_transcript", {
    p_youtube_id: id,
  });
  if (!data || !data.video) notFound();

  const { video, segments } = data;
  const turns = groupBySpeaker(segments ?? []);
  const identifiedSpeakers = new Set(
    turns.map((t) => t.person_name).filter(Boolean)
  ).size;

  const watchUrl = (startSec?: number) =>
    `https://www.youtube.com/watch?v=${video.youtube_id}${
      startSec !== undefined ? `&t=${Math.max(0, Math.floor(startSec))}s` : ""
    }`;

  return (
    <PageWrapper className="py-8">
      <div className="mx-auto max-w-3xl">
        {/* ── En-tête : miniature + métadonnées ─────────────────────────── */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-sm">
          <div className="relative aspect-video w-full bg-[var(--color-bg-section)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-5">
            <h1 className="mb-3 text-2xl md:text-3xl font-bold tracking-tight leading-snug text-[var(--color-text-primary)]">
              {video.title}
            </h1>
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                {video.channel ?? "Chaîne inconnue"}
              </span>
              {video.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                  {formatDate(video.published_at)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                {formatDuration(video.duration)}
              </span>
            </div>
            <a
              href={watchUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-md"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Voir sur YouTube
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* ── Sommaire sticky discret ───────────────────────────────────── */}
        <div
          className="sticky z-10 mb-6 flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]/95 px-4 py-2.5 text-xs text-[var(--color-text-secondary)] shadow-sm"
          style={{ top: "calc(var(--header-height) + 8px)" }}
        >
          <span className="font-semibold text-[var(--color-text-primary)]">
            Transcript complet
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Play className="h-3 w-3 text-[var(--color-primary)]" aria-hidden="true" />
            {formatNumber(turns.length)} tour{turns.length > 1 ? "s" : ""} de parole
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3 w-3 text-[var(--color-primary)]" aria-hidden="true" />
            {identifiedSpeakers} intervenant{identifiedSpeakers > 1 ? "s" : ""} identifi&eacute;{identifiedSpeakers > 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Transcript groupé par locuteur consécutif ─────────────────── */}
        {turns.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center shadow-sm">
            <MicOff className="mx-auto mb-3 h-8 w-8 text-[var(--color-text-muted)]" aria-hidden="true" />
            <h2 className="mb-1 text-base font-semibold text-[var(--color-text-primary)]">
              Transcription en attente
            </h2>
            <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
              Aucun segment transcrit pour cette vid&eacute;o pour le moment.
            </p>
            <Link
              href="/videos"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Retour aux vid&eacute;os
            </Link>
          </div>
        ) : (
          <ol className="space-y-4">
            {turns.map((turn) => (
              <li
                key={turn.key}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-sm"
              >
                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  {turn.person_name ? (
                    <Link
                      href={`/politicien/${slugify(turn.person_name)}`}
                      className="font-bold text-[var(--color-primary)] hover:underline"
                    >
                      {turn.person_name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-[var(--color-text-secondary)]">
                      {turn.speaker_label
                        ? `Intervenant ${turn.speaker_label}`
                        : "Intervenant non identifié"}
                    </span>
                  )}
                  {turn.party && (
                    <span className="rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
                      {turn.party}
                    </span>
                  )}
                  <a
                    href={watchUrl(turn.start_sec)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--color-border)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    aria-label={`Regarder à ${formatTimecode(turn.start_sec)} sur YouTube`}
                  >
                    <Play className="h-2.5 w-2.5" aria-hidden="true" />
                    {formatTimecode(turn.start_sec)}
                  </a>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                  {turn.text}
                </p>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-8 text-center text-[11px] text-[var(--color-text-muted)]">
          Transcription automatique (Whisper + diarisation) &mdash; des erreurs
          d&apos;attribution ou de transcription sont possibles. V&eacute;rifiez
          toujours avec la vid&eacute;o source horodat&eacute;e.
        </p>
      </div>
    </PageWrapper>
  );
}

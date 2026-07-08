/* =============================================================================
 * app/politicien/[slug]/page.tsx
 *
 * Page de profil d'un politicien — 100 % données réelles.
 *
 * Composant serveur async : le profil vient d'un unique appel RPC Supabase
 * (app_person_profile) exécuté côté serveur. Si la personne n'existe pas
 * dans la base → notFound(). Page dynamique (pas de generateStaticParams).
 *
 * Affichage :
 *   - Avatar (image ou initiale), nom, parti, fonction, lien Wikipedia
 *   - 3 stats réelles : temps de parole, vidéos, prises de parole
 *   - Dernières prises de parole (extraits réels avec lien YouTube horodaté)
 * ============================================================================= */

import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Film,
  Mic2,
  Quote,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { rpc } from "@/lib/supabase-server";
import { formatDate, formatNumber, formatTimecode } from "@/lib/utils";

export const dynamic = "force-dynamic";

/* --------------------------------------------------------------------------
 * Types du contrat RPC app_person_profile
 * -------------------------------------------------------------------------- */
interface PersonProfile {
  person: {
    id: number;
    name: string;
    party: string | null;
    position: string | null;
    avatar: string | null;
    birth_date: string | null;
    wikipedia: string | null;
  };
  stats: {
    speak_sec: number;
    n_videos: number;
    n_slots: number;
  };
  recent_segments: {
    segment_id: number;
    text: string;
    start_sec: number;
    video_title: string;
    youtube_id: string;
    published_at: string;
    channel: string | null;
  }[];
}

/* --------------------------------------------------------------------------
 * Helpers d'affichage
 * -------------------------------------------------------------------------- */
function fmtDuration(sec: number | null): string {
  if (!sec || sec <= 0) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}` : `${m} min`;
}

/* -------------------------------------------------------------------------- */
export default async function PoliticienPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await rpc<PersonProfile | null>("app_person_profile", {
    p_slug: slug,
  });

  /* Personne absente de la base (ou base indisponible) → 404 */
  if (!profile || !profile.person) {
    notFound();
  }

  const { person, stats, recent_segments: segments } = profile;

  return (
    <PageWrapper className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        {/* ── En-tête du profil ─────────────────────────────────────────── */}
        <section className="card mb-6 flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left">
          {person.avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={person.avatar}
              alt={`Portrait de ${person.name}`}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-3xl font-bold text-[var(--color-primary)]">
              {person.name.slice(0, 1)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              {person.name}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {[person.party, person.position].filter(Boolean).join(" · ") ||
                "Affiliation inconnue"}
            </p>
            {person.birth_date && (
              <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-muted)] sm:justify-start">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                N&eacute;{"(e)"} le {formatDate(person.birth_date)}
              </p>
            )}
            {person.wikipedia && (
              <a
                href={person.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Wikipedia
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </section>

        {/* ── Stats réelles ─────────────────────────────────────────────── */}
        <section className="mb-8 grid grid-cols-3 gap-3" aria-label="Statistiques dans le corpus">
          <div className="card flex flex-col items-center gap-1 p-4 text-center">
            <Clock className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
            <span className="text-lg font-bold text-[var(--color-text-primary)]">
              {fmtDuration(stats.speak_sec)}
            </span>
            <span className="text-[11px] leading-tight text-[var(--color-text-secondary)]">
              temps de parole
            </span>
          </div>
          <div className="card flex flex-col items-center gap-1 p-4 text-center">
            <Film className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
            <span className="text-lg font-bold text-[var(--color-text-primary)]">
              {formatNumber(stats.n_videos)}
            </span>
            <span className="text-[11px] leading-tight text-[var(--color-text-secondary)]">
              vid&eacute;os
            </span>
          </div>
          <div className="card flex flex-col items-center gap-1 p-4 text-center">
            <Mic2 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
            <span className="text-lg font-bold text-[var(--color-text-primary)]">
              {formatNumber(stats.n_slots)}
            </span>
            <span className="text-[11px] leading-tight text-[var(--color-text-secondary)]">
              prises de parole
            </span>
          </div>
        </section>

        {/* ── Dernières prises de parole ────────────────────────────────── */}
        <section aria-label="Dernières prises de parole">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
            <Quote className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
            Derni&egrave;res prises de parole
          </h2>

          {stats.n_slots === 0 || segments.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Aucune prise de parole identifi&eacute;e pour cette personne dans le
              corpus actuel.
            </p>
          ) : (
            <ul className="space-y-3">
              {segments.map((s) => (
                <li key={s.segment_id} className="card p-4">
                  <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                    &laquo;&nbsp;{s.text.trim()}&nbsp;&raquo;
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={`https://www.youtube.com/watch?v=${s.youtube_id}&t=${Math.max(0, Math.floor(s.start_sec))}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:underline"
                    >
                      <span className="truncate">
                        &#9654; {s.video_title} &mdash; &agrave; {formatTimecode(s.start_sec)}
                      </span>
                    </a>
                    <span className="shrink-0 text-[11px] text-[var(--color-text-muted)]">
                      {s.channel ?? "Chaîne inconnue"}
                      {s.published_at ? ` · ${formatDate(s.published_at)}` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}

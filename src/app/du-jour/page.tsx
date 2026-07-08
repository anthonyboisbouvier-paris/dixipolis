/* =============================================================================
 * app/du-jour/page.tsx
 *
 * Mini-app mobile « Du jour » — les vidéos politiques transcrites de la
 * journée, avec stats, intervenants identifiés, thèmes abordés et extraits
 * mentionnant des textes de loi.
 *
 * Composant serveur (Server Component). Les données viennent d'un unique
 * appel RPC Supabase (`app_daily_digest`) exécuté côté serveur : aucune clé
 * n'est exposée au navigateur. Navigation par jour via ?date=YYYY-MM-DD.
 *
 * Variables d'environnement requises (Vercel → Settings → Environment
 * Variables) : SUPABASE_URL, SUPABASE_ANON_KEY — scopées Production ET Preview,
 * puis REDÉPLOYER la preview (les env vars sont figées au build).
 * ============================================================================= */

import type { Metadata } from "next";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  Mic2,
  Radio,
  Scale,
  Tags,
  TriangleAlert,
  Users,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Du jour | Dixipolis",
  description:
    "Les vidéos politiques transcrites de la journée : intervenants, thèmes et textes de loi évoqués.",
  manifest: "/manifest.webmanifest",
};

/* --------------------------------------------------------------------------
 * Types du digest renvoyé par app_daily_digest
 * -------------------------------------------------------------------------- */
interface Digest {
  day: string | null;
  available_days: string[];
  stats: {
    n_videos: number;
    total_sec: number;
    n_channels: number;
    n_segments: number;
  };
  videos: {
    title: string;
    channel: string | null;
    duration: number | null;
    published_at: string;
    youtube_id: string;
    n_segments: number;
    n_speakers: number;
  }[];
  speakers: {
    name: string;
    party: string | null;
    position: string | null;
    avatar: string | null;
    speak_sec: number;
    n_videos: number;
  }[];
  topics: { topic: string; n: number }[];
  laws: {
    excerpt: string;
    start_sec: number;
    video_title: string;
    youtube_id: string;
  }[];
}

/* --------------------------------------------------------------------------
 * Libellés français des thèmes (codes Manifesto/CAP)
 * -------------------------------------------------------------------------- */
const TOPIC_LABELS_FR: Record<string, string> = {
  "104": "Défense (pro)",
  "105": "Défense (critique)",
  "107": "International",
  "108": "Union européenne (pro)",
  "110": "Union européenne (critique)",
  "202": "Démocratie",
  "304": "Corruption politique",
  "305": "Autorité politique",
  "403": "Régulation des marchés",
  "411": "Technologies & infrastructures",
  "502": "Culture",
  "504": "Protection sociale",
  "605": "Ordre public & justice",
  "701": "Travail & syndicats",
  "703": "Agriculture",
};

function topicLabel(raw: string): string {
  const code = raw.match(/^(\d{3})/)?.[1];
  if (code && TOPIC_LABELS_FR[code]) return TOPIC_LABELS_FR[code];
  return raw.replace(/^\d{3}\s*-\s*/, "");
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

function fmtDayFr(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtTimecode(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* --------------------------------------------------------------------------
 * Récupération du digest (RPC Supabase, côté serveur uniquement)
 * -------------------------------------------------------------------------- */
async function fetchDigest(day?: string): Promise<Digest | { error: string }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return { error: "env" };

  try {
    const res = await fetch(`${url}/rest/v1/rpc/app_daily_digest`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(day ? { p_day: day } : {}),
      cache: "no-store",
    });
    if (!res.ok) return { error: `Supabase HTTP ${res.status}` };
    return (await res.json()) as Digest;
  } catch {
    return { error: "network" };
  }
}

/* --------------------------------------------------------------------------
 * Petits composants de présentation
 * -------------------------------------------------------------------------- */
function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-3 text-center">
      <span className="text-[var(--color-primary)]">{icon}</span>
      <span className="text-lg font-bold text-[var(--color-text-primary)]">{value}</span>
      <span className="text-[11px] leading-tight text-[var(--color-text-secondary)]">{label}</span>
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--color-text-primary)]">
      <span className="text-[var(--color-primary)]">{icon}</span>
      {children}
    </h2>
  );
}

/* -------------------------------------------------------------------------- */
export default async function DuJourPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const digest = await fetchDigest(date);

  /* --- Écrans d'état (configuration manquante / erreur) ------------------ */
  if ("error" in digest) {
    return (
      <PageWrapper className="py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 text-center">
          <TriangleAlert className="mx-auto mb-3 h-8 w-8 text-amber-500" aria-hidden="true" />
          {digest.error === "env" ? (
            <>
              <h1 className="mb-2 text-lg font-semibold">Configuration requise</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Ajoutez les variables <code>SUPABASE_URL</code> et{" "}
                <code>SUPABASE_ANON_KEY</code> dans Vercel (Settings → Environment
                Variables), puis redéployez.
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-lg font-semibold">Données indisponibles</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Impossible de joindre la base ({digest.error}). Réessayez dans un instant.
              </p>
            </>
          )}
        </div>
      </PageWrapper>
    );
  }

  const { day, available_days: days, stats, videos, speakers, topics, laws } = digest;

  /* --- Navigation jour précédent / suivant -------------------------------- */
  const idx = day ? days.indexOf(day) : -1;
  const prevDay = idx >= 0 && idx < days.length - 1 ? days[idx + 1] : null;
  const nextDay = idx > 0 ? days[idx - 1] : null;

  return (
    <PageWrapper className="max-w-lg py-6">
      {/* En-tête + navigation par jour */}
      <section className="mb-5">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)]">
          <Radio className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
          Le fil politique transcrit
        </div>
        <div className="flex items-center justify-between gap-2">
          <a
            href={prevDay ? `/du-jour?date=${prevDay}` : "#"}
            aria-disabled={!prevDay}
            className={`rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 ${prevDay ? "text-[var(--color-text-primary)]" : "pointer-events-none opacity-30"}`}
            aria-label="Jour précédent"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </a>
          <h1 className="flex items-center gap-2 text-center text-lg font-bold capitalize text-[var(--color-text-primary)]">
            <CalendarDays className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
            {day ? fmtDayFr(day) : "Aucune donnée"}
          </h1>
          <a
            href={nextDay ? `/du-jour?date=${nextDay}` : "#"}
            aria-disabled={!nextDay}
            className={`rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 ${nextDay ? "text-[var(--color-text-primary)]" : "pointer-events-none opacity-30"}`}
            aria-label="Jour suivant"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Tuiles de stats */}
      <section className="mb-6 grid grid-cols-4 gap-2">
        <StatTile icon={<Film className="h-4 w-4" aria-hidden="true" />} value={String(stats.n_videos)} label="vidéos" />
        <StatTile icon={<Clock className="h-4 w-4" aria-hidden="true" />} value={fmtDuration(stats.total_sec)} label="de contenu" />
        <StatTile icon={<Radio className="h-4 w-4" aria-hidden="true" />} value={String(stats.n_channels)} label="chaînes" />
        <StatTile icon={<Mic2 className="h-4 w-4" aria-hidden="true" />} value={String(stats.n_segments)} label="segments" />
      </section>

      {/* Vidéos transcrites */}
      <section className="mb-8">
        <SectionTitle icon={<Film className="h-4 w-4" aria-hidden="true" />}>
          Vidéos transcrites
        </SectionTitle>
        {videos.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Aucune vidéo transcrite ce jour. Le pipeline de collecte vient d&apos;être
            restauré — les journées se rempliront automatiquement.
          </p>
        ) : (
          <ul className="space-y-3">
            {videos.map((v) => (
              <li key={v.youtube_id}>
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 transition-shadow hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${v.youtube_id}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-[68px] w-[120px] shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-text-primary)]">
                      {v.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
                      {v.channel ?? "Chaîne inconnue"} · {fmtDuration(v.duration)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
                      {v.n_segments} segments{v.n_speakers > 0 ? ` · ${v.n_speakers} intervenants` : ""}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Intervenants identifiés */}
      {speakers.length > 0 && (
        <section className="mb-8">
          <SectionTitle icon={<Users className="h-4 w-4" aria-hidden="true" />}>
            Qui a parlé
          </SectionTitle>
          <ul className="space-y-2">
            {speakers.map((s) => (
              <li
                key={s.name}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3"
              >
                {s.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={s.avatar} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-sm font-bold text-[var(--color-primary)]">
                    {s.name.slice(0, 1)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{s.name}</p>
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    {[s.party, s.position].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-[var(--color-text-secondary)]">
                  {fmtDuration(s.speak_sec)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Thèmes du jour */}
      {topics.length > 0 && (
        <section className="mb-8">
          <SectionTitle icon={<Tags className="h-4 w-4" aria-hidden="true" />}>
            Thèmes abordés
          </SectionTitle>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <span
                key={t.topic}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)]"
              >
                {topicLabel(t.topic)}
                <span className="ml-1.5 text-[var(--color-primary)]">{t.n}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Lois & textes évoqués */}
      <section className="mb-8">
        <SectionTitle icon={<Scale className="h-4 w-4" aria-hidden="true" />}>
          Lois &amp; textes évoqués
        </SectionTitle>
        {laws.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Aucune mention de texte de loi détectée ce jour.
          </p>
        ) : (
          <ul className="space-y-3">
            {laws.map((l, i) => (
              <li
                key={`${l.youtube_id}-${i}`}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3"
              >
                <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                  «&nbsp;{l.excerpt.trim()}…&nbsp;»
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${l.youtube_id}&t=${l.start_sec}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block truncate text-xs font-medium text-[var(--color-primary)]"
                >
                  ▶ {l.video_title} — à {fmtTimecode(l.start_sec)}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="pb-4 text-center text-[11px] text-[var(--color-text-secondary)]">
        Données : pipeline Dixipolis (discovery n8n + transcription Whisper + diarisation).
        <br />
        Astuce : « Ajouter à l&apos;écran d&apos;accueil » pour l&apos;utiliser comme une app.
      </p>
    </PageWrapper>
  );
}

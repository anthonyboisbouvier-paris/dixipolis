/* =============================================================================
 * app/analytique/page.tsx
 *
 * Page Analytique — données réelles du corpus Dixipolis.
 *
 * Composant serveur async : cinq appels RPC Supabase côté serveur
 * (app_global_stats, app_top_speakers, app_theme_stats, app_party_stats,
 * app_videos_per_day) via le helper rpc.
 *
 * Sections :
 *   1. KPI réels (6 tuiles, mêmes chiffres que la page d'accueil)
 *   2. Top intervenants (temps de parole réel, lien vers /politicien/<slug>)
 *   3. Thèmes classifiés (barres réelles + disclaimer de couverture)
 *   4. Temps de parole par parti (barres horizontales, badge nb d'orateurs)
 *   5. Activité du corpus (mini bar-chart CSS pur, 60 derniers jours)
 *   6. Carte "Analyses avancées : en construction"
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Clock,
  Construction,
  FileText,
  Landmark,
  Mic2,
  Radio,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { rpc } from "@/lib/supabase-server";
import type { GlobalStats } from "@/lib/supabase-server";
import { topicLabel } from "@/lib/topics";
import { formatNumber, slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Analytique | Dixipolis",
  description:
    "Données réelles du corpus Dixipolis : indicateurs clés, top intervenants et thèmes classifiés.",
};

/* --------------------------------------------------------------------------
 * Types des contrats RPC
 * -------------------------------------------------------------------------- */
interface TopSpeaker {
  person_id: number;
  name: string;
  party: string | null;
  position: string | null;
  avatar: string | null;
  speak_sec: number;
  n_videos: number;
}

interface ThemeStats {
  coverage: { slots_classified: number; slots_total: number };
  topics: { topic: string; n: number }[];
}

/** Élément de app_party_stats() */
interface PartyStat {
  party: string;
  speak_sec: number;
  n_persons: number;
}

/** Élément de app_videos_per_day(p_days) — ordre chronologique */
interface DayActivity {
  day: string;
  n_videos: number;
  hours: number;
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
    day: "numeric",
    month: "short",
  });
}

/* --------------------------------------------------------------------------
 * Petits composants de présentation
 * -------------------------------------------------------------------------- */
function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span style={{ color: "var(--color-primary)" }}>{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <div className="flex-1 border-t" style={{ borderColor: "var(--color-border)" }} />
    </div>
  );
}

function KpiTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="card p-5">
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
        {value}
      </p>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
export default async function AnalytiquePage() {
  /* Données réelles — cinq RPC en parallèle */
  const [stats, speakers, themes, parties, activity] = await Promise.all([
    rpc<GlobalStats>("app_global_stats"),
    rpc<TopSpeaker[]>("app_top_speakers", { p_limit: 10 }),
    rpc<ThemeStats>("app_theme_stats"),
    rpc<PartyStat[]>("app_party_stats"),
    rpc<DayActivity[]>("app_videos_per_day", { p_days: 60 }),
  ]);

  const kpis = [
    { icon: <FileText className="h-5 w-5" />, value: stats ? formatNumber(stats.n_segments) : "—", label: "segments transcrits" },
    { icon: <Clock className="h-5 w-5" />, value: stats ? `${formatNumber(stats.total_hours)}h` : "—", label: "heures de vidéo" },
    { icon: <Users className="h-5 w-5" />, value: stats ? formatNumber(stats.n_persons) : "—", label: "personnalités référencées" },
    { icon: <Mic2 className="h-5 w-5" />, value: stats ? formatNumber(stats.n_speakers_resolved) : "—", label: "orateurs identifiés" },
    { icon: <Video className="h-5 w-5" />, value: stats ? formatNumber(stats.n_videos) : "—", label: "vidéos" },
    { icon: <Radio className="h-5 w-5" />, value: stats ? formatNumber(stats.n_channels) : "—", label: "chaînes suivies" },
  ];

  const topTopics = themes?.topics ? [...themes.topics].sort((a, b) => b.n - a.n) : [];
  const maxTopic = topTopics[0]?.n ?? 1;

  /* Partis triés par temps de parole décroissant */
  const partyStats = parties ? [...parties].sort((a, b) => b.speak_sec - a.speak_sec) : [];
  const maxPartySec = partyStats[0]?.speak_sec ?? 1;

  /* Activité du corpus : hauteur des colonnes proportionnelle aux heures */
  const days = activity ?? [];
  const maxHours = days.reduce((m, d) => Math.max(m, d.hours), 0) || 1;

  return (
    <PageWrapper className="py-8">
      {/* En-tête honnête */}
      <section className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
          <BarChart3 className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
          Donn&eacute;es r&eacute;elles du corpus
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Analytique
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Les indicateurs ci-dessous sont calcul&eacute;s directement sur la base
          Dixipolis : rien n&apos;est simul&eacute;.
        </p>
      </section>

      {/* ── Section 1 : KPI réels ─────────────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel icon={<TrendingUp className="h-3.5 w-3.5" />} label="Indicateurs clés" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <KpiTile key={kpi.label} icon={kpi.icon} value={kpi.value} label={kpi.label} />
          ))}
        </div>
      </div>

      {/* ── Section 2 : Top intervenants ──────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel icon={<Mic2 className="h-3.5 w-3.5" />} label="Top intervenants" />
        <section className="card p-6" aria-label="Top intervenants du corpus">
          <div className="mb-5">
            <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Intervenants les plus pr&eacute;sents
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Class&eacute;s par temps de parole identifi&eacute; dans le corpus
            </p>
          </div>
          {!speakers || speakers.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Aucun intervenant identifi&eacute; pour le moment.
            </p>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {speakers.map((s, index) => (
                <li key={s.person_id}>
                  <Link
                    href={`/politicien/${slugify(s.name)}`}
                    className="group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-[var(--color-bg-section)]"
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                      style={{
                        backgroundColor: "var(--color-bg-section)",
                        color: "var(--color-text-muted)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      {index + 1}
                    </span>
                    {s.avatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={s.avatar} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-sm font-bold text-[var(--color-primary)]">
                        {s.name.slice(0, 1)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {s.name}
                      </p>
                      <p className="truncate text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {[s.party, s.position].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                        {fmtDuration(s.speak_sec)}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {s.n_videos} vid&eacute;o{s.n_videos > 1 ? "s" : ""}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ── Section 3 : Thèmes classifiés ─────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel icon={<BarChart3 className="h-3.5 w-3.5" />} label="Thèmes classifiés" />
        <section className="card p-6" aria-label="Thèmes classifiés du corpus">
          <div className="mb-5">
            <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Th&egrave;mes les plus abord&eacute;s
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
              R&eacute;partition des tours de parole classifi&eacute;s (codes Manifesto)
            </p>
          </div>
          {topTopics.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Aucun th&egrave;me classifi&eacute; pour le moment.
            </p>
          ) : (
            <div className="space-y-2">
              {topTopics.map((t) => (
                <div key={t.topic} className="flex items-center gap-3">
                  <span
                    className="w-40 shrink-0 truncate text-sm font-medium sm:w-56"
                    style={{ color: "var(--color-text-primary)" }}
                    title={topicLabel(t.topic)}
                  >
                    {topicLabel(t.topic)}
                  </span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-md" style={{ backgroundColor: "var(--color-bg-section)" }}>
                    <div
                      className="absolute inset-y-0 left-0 rounded-md"
                      style={{
                        width: `${Math.max(4, (t.n / maxTopic) * 100)}%`,
                        backgroundColor: "var(--color-primary)",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {formatNumber(t.n)}
                  </span>
                </div>
              ))}
            </div>
          )}
          {themes && (
            <p className="mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
              {formatNumber(themes.coverage.slots_classified)} tours de parole
              classifi&eacute;s sur {formatNumber(themes.coverage.slots_total)} &mdash;
              couverture partielle.
            </p>
          )}
        </section>
      </div>

      {/* ── Section 4 : Temps de parole par parti ─────────────────────── */}
      <div className="mb-8">
        <SectionLabel icon={<Landmark className="h-3.5 w-3.5" />} label="Partis politiques" />
        <section className="card p-6" aria-label="Temps de parole par parti">
          <div className="mb-5">
            <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Temps de parole par parti
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Temps de parole identifi&eacute; cumul&eacute; des orateurs de chaque parti
            </p>
          </div>
          {partyStats.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Aucune donn&eacute;e de parti disponible pour le moment.
            </p>
          ) : (
            <div className="space-y-2">
              {partyStats.map((p) => (
                <div key={p.party} className="flex items-center gap-3">
                  <span
                    className="flex w-40 shrink-0 items-center gap-2 sm:w-56"
                    title={p.party}
                  >
                    <span className="truncate text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {p.party}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                      }}
                      title={`${p.n_persons} orateur${p.n_persons > 1 ? "s" : ""} identifié${p.n_persons > 1 ? "s" : ""}`}
                    >
                      {p.n_persons}
                    </span>
                  </span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-md" style={{ backgroundColor: "var(--color-bg-section)" }}>
                    <div
                      className="absolute inset-y-0 left-0 rounded-md"
                      style={{
                        width: `${Math.max(2, (p.speak_sec / maxPartySec) * 100)}%`,
                        backgroundColor: "var(--color-primary)",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {fmtDuration(p.speak_sec)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Section 5 : Activité du corpus (60 derniers jours) ────────── */}
      <div className="mb-8">
        <SectionLabel icon={<Activity className="h-3.5 w-3.5" />} label="Activité du corpus" />
        <section className="card p-6" aria-label="Activité du corpus sur 60 jours">
          <div className="mb-5">
            <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Vid&eacute;os transcrites par jour
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Heures de contenu ajout&eacute;es au corpus sur les 60 derniers jours
            </p>
          </div>
          {days.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Aucune activit&eacute; enregistr&eacute;e sur la p&eacute;riode.
            </p>
          ) : (
            <>
              {/* Mini bar-chart 100 % CSS : une colonne par jour, tooltip natif */}
              <div className="overflow-x-auto pb-1">
                <div className="flex h-32 min-w-[480px] items-end gap-[3px]">
                  {days.map((d) => (
                    <div
                      key={d.day}
                      className="group flex h-full min-w-[6px] flex-1 items-end"
                      title={`${fmtDayFr(d.day)} : ${d.n_videos} vidéo${d.n_videos > 1 ? "s" : ""}, ${Math.round(d.hours * 10) / 10}h`}
                    >
                      <div
                        className="w-full rounded-t-sm transition-opacity group-hover:opacity-100"
                        style={{
                          height: `${Math.max(d.hours > 0 ? 4 : 1, (d.hours / maxHours) * 100)}%`,
                          backgroundColor: d.hours > 0 ? "var(--color-primary)" : "var(--color-border)",
                          opacity: d.hours > 0 ? 0.8 : 1,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex min-w-[480px] justify-between text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                  <span>{fmtDayFr(days[0].day)}</span>
                  <span>{fmtDayFr(days[days.length - 1].day)}</span>
                </div>
              </div>
              <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                {formatNumber(days.reduce((s, d) => s + d.n_videos, 0))} vid&eacute;os
                sur la p&eacute;riode &mdash; survolez une colonne pour le d&eacute;tail.
              </p>
            </>
          )}
        </section>
      </div>

      {/* ── Section 6 : Analyses avancées (en construction) ───────────── */}
      <div
        className="flex items-start gap-3 rounded-2xl border border-dashed p-5"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg-card)" }}
      >
        <Construction className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--color-warning)" }} aria-hidden="true" />
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Analyses avanc&eacute;es (comparaisons, matrice id&eacute;ologique, timeline)&nbsp;:
          en construction &mdash; n&eacute;cessitent l&apos;enrichissement du corpus.
        </p>
      </div>
    </PageWrapper>
  );
}

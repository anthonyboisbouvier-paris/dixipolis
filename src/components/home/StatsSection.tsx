/* =============================================================================
 * components/home/StatsSection.tsx
 *
 * Section "La base en chiffres" — fond sombre, chiffres lumineux.
 * Affiche les 6 statistiques RÉELLES du corpus (app_global_stats) passées
 * en prop depuis app/page.tsx. Si les stats sont indisponibles → "—".
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import { Video, Users, FileText, Clock, Mic2, Radio } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { GlobalStats } from "@/lib/supabase-server";

/* -------------------------------------------------------------------------- */
interface StatItem {
  id: string;
  value: string;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function fmtDayFr(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildStats(stats: GlobalStats | null): StatItem[] {
  const v = (n: number | undefined, suffix = ""): string =>
    stats && typeof n === "number" ? formatNumber(n) + suffix : "—";

  return [
    {
      id: "segments",
      value: v(stats?.n_segments),
      label: "Segments transcrits",
      detail: "Transcription mot à mot avec horodatage",
      icon: FileText,
      color: "#60a5fa",
    },
    {
      id: "hours",
      value: v(stats?.total_hours, "h"),
      label: "Heures de vidéo",
      detail: "Interviews, plateaux, assemblées",
      icon: Clock,
      color: "#34d399",
    },
    {
      id: "persons",
      value: v(stats?.n_persons),
      label: "Personnalités référencées",
      detail: "Base de personnalités politiques françaises",
      icon: Users,
      color: "#a78bfa",
    },
    {
      id: "speakers",
      value: v(stats?.n_speakers_resolved),
      label: "Orateurs identifiés",
      detail: "Prises de parole attribuées à leur auteur",
      icon: Mic2,
      color: "#fb923c",
    },
    {
      id: "videos",
      value: v(stats?.n_videos),
      label: "Vidéos",
      detail: "Vidéos transcrites dans le corpus",
      icon: Video,
      color: "#f472b6",
    },
    {
      id: "channels",
      value: v(stats?.n_channels),
      label: "Chaînes suivies",
      detail: "Chaînes YouTube politiques et médias",
      icon: Radio,
      color: "#fbbf24",
    },
  ];
}

/* -------------------------------------------------------------------------- */
export default function StatsSection({ stats }: { stats: GlobalStats | null }) {
  const items = buildStats(stats);

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
      aria-label="La base de données Dixipolis en chiffres"
    >
      {/* Formes décoratives — dégradés radiaux statiques (sans filter) */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="page-container relative">
        {/* En-tête */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70">
            {stats ? (
              <>
                Corpus&nbsp;: {fmtDayFr(stats.first_day)} &rarr; {fmtDayFr(stats.last_day)}
              </>
            ) : (
              <>Corpus&nbsp;: p&eacute;riode indisponible</>
            )}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Le discours politique fran&ccedil;ais, transcrit et sourc&eacute;
          </h2>
          <p className="text-lg text-white/60">
            Notre pipeline d&eacute;couvre et transcrit les prises de parole
            politiques. Voici l&apos;&eacute;tat r&eacute;el du corpus.
          </p>
        </div>

        {/* Grille 3×2 */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {items.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] sm:p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: stat.color + "15", color: stat.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mb-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-white/80">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
 * components/home/StatsSection.tsx
 *
 * Section "La base en chiffres" — fond sombre, chiffres lumineux.
 * Message clé : l'ampleur et la fraîcheur de la base de données.
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import { Video, Users, FileText, Clock, RefreshCw, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
interface StatItem {
  id: string;
  value: string;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const stats: StatItem[] = [
  {
    id: "speeches",
    value: formatNumber(45230) + "+",
    label: "Discours transcrits",
    detail: "Assembl\u00e9e, S\u00e9nat, interviews, meetings",
    icon: FileText,
    color: "#60a5fa",
  },
  {
    id: "hours",
    value: formatNumber(10500) + "h",
    label: "De vid\u00e9o analys\u00e9es",
    detail: "Transcription mot \u00e0 mot avec horodatage",
    icon: Clock,
    color: "#34d399",
  },
  {
    id: "politicians",
    value: formatNumber(2048) + "+",
    label: "Politiciens suivis",
    detail: "D\u00e9put\u00e9s, s\u00e9nateurs, eurod\u00e9put\u00e9s, maires",
    icon: Users,
    color: "#a78bfa",
  },
  {
    id: "videos",
    value: formatNumber(18700) + "+",
    label: "Vid\u00e9os index\u00e9es",
    detail: "YouTube, sites institutionnels, m\u00e9dias",
    icon: Video,
    color: "#fb923c",
  },
  {
    id: "daily",
    value: "150+",
    label: "Nouvelles entr\u00e9es / jour",
    detail: "Ingestion automatique quotidienne",
    icon: RefreshCw,
    color: "#f472b6",
  },
  {
    id: "growth",
    value: "+8%",
    label: "Croissance mensuelle",
    detail: "La base grandit chaque jour",
    icon: TrendingUp,
    color: "#fbbf24",
  },
];

/* -------------------------------------------------------------------------- */
export default function StatsSection() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
      aria-label="La base de donn\u00e9es Dixipolis en chiffres"
    >
      {/* Formes décoratives */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-[0.06] blur-3xl"
        style={{ background: "#3b82f6" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "#8b5cf6" }}
        aria-hidden="true"
      />

      <div className="page-container relative">
        {/* En-tête */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#34d399]" aria-hidden="true" />
            Mis &agrave; jour en continu
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            La base la plus compl&egrave;te du discours politique fran&ccedil;ais
          </h2>
          <p className="text-lg text-white/60">
            Chaque jour, notre pipeline d&eacute;couvre et transcrit automatiquement
            les nouvelles prises de parole. Rien ne nous &eacute;chappe.
          </p>
        </div>

        {/* Grille 3×2 */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] sm:p-6"
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

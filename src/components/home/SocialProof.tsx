/* =============================================================================
 * components/home/SocialProof.tsx
 *
 * Section "Qui utilise Dixipolis" — personas + le corpus en chiffres.
 * Les anciens témoignages fictifs ont été supprimés : ils sont remplacés
 * par 3 cartes de chiffres RÉELS du corpus (app_global_stats, prop de
 * app/page.tsx). Si les stats sont indisponibles → "—".
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import { Newspaper, GraduationCap, Users, Briefcase, Clock, Mic2, CalendarRange } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { GlobalStats } from "@/lib/supabase-server";

/* -------------------------------------------------------------------------- */
interface Persona {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

const PERSONAS: Persona[] = [
  {
    icon: Newspaper,
    title: "Journalistes",
    description: "Vérifiez en 30 secondes ce qu’un politique a vraiment dit. Retrouvez la source vidéo avec le timecode exact.",
    gradient: "linear-gradient(135deg, #2563eb, #6366f1)",
  },
  {
    icon: GraduationCap,
    title: "Chercheurs",
    description: "Analysez des milliers de segments transcrits : temps de parole, thèmes abordés, évolution du vocabulaire.",
    gradient: "linear-gradient(135deg, #16a34a, #10b981)",
  },
  {
    icon: Users,
    title: "Citoyens engagés",
    description: "Ne vous fiez plus aux extraits tronqués. Accédez au discours complet et formez votre propre opinion.",
    gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
  },
  {
    icon: Briefcase,
    title: "Développeurs",
    description: "Intégrez Dixipolis dans vos apps via notre API : recherche sémantique, inventaire vidéo, résolution d’entités.",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  },
];

/* -------------------------------------------------------------------------- */
function fmtDayFr(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
export default function SocialProof({ stats }: { stats: GlobalStats | null }) {
  const corpusFigures = [
    {
      icon: Clock,
      value: stats ? `${formatNumber(stats.total_hours)}h` : "—",
      label: "de vidéo transcrites",
      color: "#2563eb",
    },
    {
      icon: Mic2,
      value: stats ? formatNumber(stats.n_speakers_resolved) : "—",
      label: "orateurs identifiés",
      color: "#16a34a",
    },
    {
      icon: CalendarRange,
      value: stats ? `${fmtDayFr(stats.first_day)} → ${fmtDayFr(stats.last_day)}` : "—",
      label: "période couverte",
      color: "#7c3aed",
    },
  ];

  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: "var(--color-bg-page)" }}
      aria-label="Qui utilise Dixipolis"
    >
      <div className="page-container">
        {/* En-tête */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--color-text-primary)" }}>
            Fait pour ceux qui veulent la v&eacute;rit&eacute;
          </h2>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Journalistes, chercheurs, d&eacute;veloppeurs et citoyens utilisent Dixipolis
            pour acc&eacute;der aux discours politiques sans filtre.
          </p>
        </div>

        {/* Personas — 4 colonnes */}
        <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="card group flex flex-col items-center p-6 text-center"
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                  style={{ background: p.gradient }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Le corpus en chiffres — 3 cartes réelles */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h3 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Le corpus en chiffres
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {corpusFigures.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="card flex flex-col items-center p-6 text-center">
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: f.color + "15", color: f.color }}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-1 text-xl font-extrabold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                  {f.value}
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {f.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

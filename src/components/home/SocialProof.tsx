/* =============================================================================
 * components/home/SocialProof.tsx
 *
 * Section "Qui utilise Dixipolis" — preuve sociale + personas.
 * Montre les profils utilisateurs et des citations-témoignages.
 * Composant serveur (Server Component).
 * ============================================================================= */

import { Newspaper, GraduationCap, Users, Briefcase, Quote } from "lucide-react";

/* -------------------------------------------------------------------------- */
interface Persona {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

const PERSONAS: Persona[] = [
  {
    icon: Newspaper,
    title: "Journalistes",
    description: "V\u00e9rifiez en 30 secondes ce qu\u2019un politique a vraiment dit. Retrouvez la source vid\u00e9o avec le timecode exact.",
    gradient: "linear-gradient(135deg, #2563eb, #6366f1)",
  },
  {
    icon: GraduationCap,
    title: "Chercheurs",
    description: "Analysez des milliers de discours : distance id\u00e9ologique, \u00e9volution du vocabulaire, fr\u00e9quence th\u00e9matique.",
    gradient: "linear-gradient(135deg, #16a34a, #10b981)",
  },
  {
    icon: Users,
    title: "Citoyens engag\u00e9s",
    description: "Ne vous fiez plus aux extraits tronqu\u00e9s. Acc\u00e9dez au discours complet et formez votre propre opinion.",
    gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
  },
  {
    icon: Briefcase,
    title: "D\u00e9veloppeurs",
    description: "Int\u00e9grez Dixipolis dans vos apps via notre API : recherche s\u00e9mantique, inventaire vid\u00e9o, r\u00e9solution d\u2019entit\u00e9s.",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Dixipolis m\u2019a fait gagner des heures sur mes v\u00e9rifications. Je retrouve la citation exacte avec la vid\u00e9o en quelques secondes.",
    name: "Cl\u00e9ment D.",
    role: "Journaliste politique, M\u00e9diapart",
    initials: "CD",
    color: "#2563eb",
  },
  {
    quote: "La matrice id\u00e9ologique est impressionnante. On visualise enfin les convergences et divergences r\u00e9elles entre partis.",
    name: "Sophie M.",
    role: "Chercheuse en sciences politiques, Sciences Po",
    initials: "SM",
    color: "#16a34a",
  },
  {
    quote: "J\u2019ai int\u00e9gr\u00e9 l\u2019API dans notre chatbot en 2 heures. La doc est claire et les r\u00e9sultats sont excellents.",
    name: "Thomas L.",
    role: "D\u00e9veloppeur full-stack",
    initials: "TL",
    color: "#7c3aed",
  },
];

/* -------------------------------------------------------------------------- */
export default function SocialProof() {
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
                className="card group flex flex-col items-center p-6 text-center transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110"
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

        {/* Témoignages — 3 colonnes */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="card relative flex flex-col p-6"
            >
              <Quote
                className="mb-3 h-6 w-6 opacity-20"
                style={{ color: t.color }}
                aria-hidden="true"
              />
              <p
                className="mb-5 flex-1 text-sm italic leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                &laquo;&nbsp;{t.quote}&nbsp;&raquo;
              </p>
              <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

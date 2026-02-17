/* =============================================================================
 * components/home/FeatureCards.tsx
 *
 * 4 modules Dixipolis — approche UX "ce que l'utilisateur peut FAIRE".
 * Design audacieux : icônes larges, couleurs fortes, texte orienté action.
 * Chaque carte répond à la question "Qu'est-ce que je peux faire avec ça ?"
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import Link from "next/link";
import {
  MessageSquare,
  BarChart3,
  Shield,
  Code,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
interface FeatureCardData {
  id: string;
  title: string;
  tagline: string;
  description: string;
  userActions: string[];
  href: string;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  gradient: string;
}

/* -------------------------------------------------------------------------- */
const features: FeatureCardData[] = [
  {
    id: "prompt",
    title: "Interroger la base",
    tagline: "Posez une question, obtenez des preuves",
    description:
      "Un agent IA qui fouille 45 000+ discours pour retrouver exactement ce qu\u2019un politique a dit \u2014 avec l\u2019extrait vid\u00e9o horodat\u00e9.",
    userActions: [
      "Rechercher par le sens ou par citation exacte",
      "Obtenir l\u2019extrait vid\u00e9o avec timecode",
      "Croiser les d\u00e9clarations de plusieurs politiciens",
    ],
    href: "/prompt",
    ctaLabel: "Poser une question",
    icon: MessageSquare,
    accentColor: "#2563eb",
    accentBg: "rgba(37,99,235,0.08)",
    accentBorder: "rgba(37,99,235,0.2)",
    gradient: "linear-gradient(135deg, #2563eb 0%, #6366f1 100%)",
  },
  {
    id: "analytique",
    title: "Explorer les donn\u00e9es",
    tagline: "Tableaux de bord du discours politique",
    description:
      "Visualisez qui parle de quoi, la distance id\u00e9ologique entre partis, les mots sur-repr\u00e9sent\u00e9s et l\u2019\u00e9volution dans le temps.",
    userActions: [
      "Comparer les th\u00e8mes par politicien et par parti",
      "Voir la matrice de proximit\u00e9 id\u00e9ologique",
      "Suivre l\u2019\u00e9volution des sujets dans le temps",
    ],
    href: "/analytique",
    ctaLabel: "Voir le dashboard",
    icon: BarChart3,
    accentColor: "#16a34a",
    accentBg: "rgba(22,163,74,0.08)",
    accentBorder: "rgba(22,163,74,0.2)",
    gradient: "linear-gradient(135deg, #16a34a 0%, #10b981 100%)",
  },
  {
    id: "contenu",
    title: "V\u00e9rifier les faits",
    tagline: "Fact-checking et d\u00e9tection de propagande",
    description:
      "Chaque assertion politique est v\u00e9rifi\u00e9e automatiquement. L\u2019IA d\u00e9tecte les techniques de manipulation et le ton \u00e9motionnel.",
    userActions: [
      "Lire les fact-checks automatis\u00e9s avec verdict",
      "D\u00e9tecter les techniques de propagande",
      "Mesurer la toxicit\u00e9 et le ton \u00e9motionnel",
    ],
    href: "/contenu",
    ctaLabel: "Voir les v\u00e9rifications",
    icon: Shield,
    accentColor: "#d97706",
    accentBg: "rgba(217,119,6,0.08)",
    accentBorder: "rgba(217,119,6,0.2)",
    gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
  },
  {
    id: "api-pro",
    title: "Int\u00e9grer via API",
    tagline: "5 endpoints pour vos applications",
    description:
      "Int\u00e9grez la puissance de Dixipolis dans vos propres outils : recherche s\u00e9mantique, inventaire vid\u00e9o, r\u00e9solution d\u2019entit\u00e9s.",
    userActions: [
      "Recherche s\u00e9mantique + textuelle en une requ\u00eate",
      "Lister les vid\u00e9os par politicien ou th\u00e8me",
      "R\u00e9soudre automatiquement personnes et partis",
    ],
    href: "/api-pro",
    ctaLabel: "Voir la doc API",
    icon: Code,
    accentColor: "#7c3aed",
    accentBg: "rgba(124,58,237,0.08)",
    accentBorder: "rgba(124,58,237,0.2)",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
  },
];

/* -------------------------------------------------------------------------- */
export default function FeatureCards() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: "var(--color-bg-page)" }}
      aria-label="Ce que vous pouvez faire avec Dixipolis"
    >
      <div className="page-container">
        {/* En-tête */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: "var(--color-border)", color: "var(--color-primary)", backgroundColor: "var(--color-primary-light)" }}>
            4 modules
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--color-text-primary)" }}>
            Qu&apos;est-ce que vous pouvez faire ?
          </h2>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Quatre fa&ccedil;ons d&apos;exploiter la plus grande base de donn&eacute;es
            du discours politique fran&ccedil;ais.
          </p>
        </div>

        {/* Grille 2×2 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
function FeatureCard({ feature }: { feature: FeatureCardData }) {
  const {
    title,
    tagline,
    description,
    userActions,
    href,
    ctaLabel,
    icon: Icon,
    accentColor,
    accentBg,
    accentBorder,
    gradient,
  } = feature;

  return (
    <Link
      href={href}
      className="card card-interactive group flex flex-col overflow-hidden"
      aria-label={ctaLabel}
    >
      {/* Bande de couleur en haut */}
      <div className="h-1.5" style={{ background: gradient }} />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Icône + tagline */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: gradient, color: "#fff" }}
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {title}
            </h3>
            <p className="text-xs font-medium" style={{ color: accentColor }}>
              {tagline}
            </p>
          </div>
        </div>

        {/* Description */}
        <p
          className="mb-5 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>

        {/* Actions utilisateur */}
        <div
          className="mb-6 flex-1 rounded-xl border p-4"
          style={{
            backgroundColor: accentBg,
            borderColor: accentBorder,
          }}
        >
          <p
            className="mb-2.5 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Ce que vous pouvez faire
          </p>
          <ul className="space-y-2">
            {userActions.map((action) => (
              <li
                key={action}
                className="flex items-start gap-2 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span
                  className={cn(
                    "mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  )}
                  style={{ backgroundColor: accentColor }}
                  aria-hidden="true"
                />
                {action}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div
          className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-200 group-hover:shadow-lg"
          style={{ background: gradient }}
        >
          {ctaLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

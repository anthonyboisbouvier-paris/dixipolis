/* =============================================================================
 * components/home/FeatureCards.tsx
 *
 * Section de presentation des 4 fonctionnalites principales de Dixipolis.
 * Mise a jour pour refleter les vraies capacites du produit :
 *   1. Agent IA — Recherche semantique + textuelle via agent LLM
 *   2. Analytique — Metriques discursives, distance ideologique, word clouds
 *   3. Contenu — Fact-checking, detection propagande, alertes
 *   4. API Pro — 5 endpoints pour developpeurs (search, text, videos, context, entities)
 *
 * Composant serveur (Server Component) — pas de "use client".
 * ============================================================================= */

import Link from "next/link";
import {
  MessageSquare,
  BarChart3,
  Shield,
  Code,
  ArrowRight,
  Brain,
  Target,
  Scale,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  illustrationIcon: React.ComponentType<{ className?: string }>;
  highlights: string[];
  iconBgClass: string;
  iconTextClass: string;
  illustrationBgClass: string;
  illustrationIconClass: string;
}

/* --------------------------------------------------------------------------
 * Les 4 fonctionnalites principales, alignees avec les tickets Linear.
 * -------------------------------------------------------------------------- */
const features: FeatureCardData[] = [
  {
    id: "prompt",
    title: "Agent IA",
    description:
      "Un agent intelligent qui combine recherche s\u00e9mantique et textuelle pour retrouver ce que les politiques ont vraiment dit, avec sources vid\u00e9o horodat\u00e9es.",
    highlights: [
      "Recherche par le sens (embeddings)",
      "Citations mot-pour-mot",
      "Contexte complet du discours",
    ],
    href: "/prompt",
    icon: MessageSquare,
    illustrationIcon: Brain,
    iconBgClass: "bg-[#dbeafe]",
    iconTextClass: "text-[#2563eb]",
    illustrationBgClass: "bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]",
    illustrationIconClass: "text-[#2563eb]",
  },
  {
    id: "analytique",
    title: "Analytique",
    description:
      "Tableaux de bord avec m\u00e9triques discursives : temps de parole, d\u00e9bit, diversit\u00e9 du vocabulaire, distance id\u00e9ologique entre politiciens.",
    highlights: [
      "M\u00e9triques mensuelles par politicien",
      "Matrice de distance id\u00e9ologique",
      "Mots sur-repr\u00e9sent\u00e9s (word cloud)",
    ],
    href: "/analytique",
    icon: BarChart3,
    illustrationIcon: Target,
    iconBgClass: "bg-[#dcfce7]",
    iconTextClass: "text-[#16a34a]",
    illustrationBgClass: "bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]",
    illustrationIconClass: "text-[#16a34a]",
  },
  {
    id: "contenu",
    title: "V\u00e9rification",
    description:
      "Fact-checking automatis\u00e9 des assertions politiques, d\u00e9tection de propagande et analyse du ton \u00e9motionnel de chaque discours.",
    highlights: [
      "Fact-checking via Factiverse",
      "D\u00e9tection de propagande",
      "Analyse \u00e9motionnelle et toxicit\u00e9",
    ],
    href: "/contenu",
    icon: Shield,
    illustrationIcon: Scale,
    iconBgClass: "bg-[#fef3c7]",
    iconTextClass: "text-[#d97706]",
    illustrationBgClass: "bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]",
    illustrationIconClass: "text-[#d97706]",
  },
  {
    id: "api-pro",
    title: "API Pro",
    description:
      "5 endpoints pour int\u00e9grer Dixipolis dans vos apps : recherche s\u00e9mantique, textuelle, inventaire vid\u00e9o, contexte et r\u00e9solution d\u2019entit\u00e9s.",
    highlights: [
      "Recherche s\u00e9mantique + textuelle",
      "Liste vid\u00e9os par politicien/th\u00e8me",
      "R\u00e9solution d\u2019entit\u00e9s (personne/parti/th\u00e8me)",
    ],
    href: "/api-pro",
    icon: Code,
    illustrationIcon: Database,
    iconBgClass: "bg-[#e0e7ff]",
    iconTextClass: "text-[#4f46e5]",
    illustrationBgClass: "bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff]",
    illustrationIconClass: "text-[#4f46e5]",
  },
];

/* -------------------------------------------------------------------------- */
export default function FeatureCards() {
  return (
    <section
      className="bg-[var(--color-bg-page)] py-16 sm:py-20 lg:py-24"
      aria-label="Fonctionnalit\u00e9s principales de Dixipolis"
    >
      <div className="page-container">
        {/* En-tete de section */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Quatre outils pour d&eacute;crypter le politique
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            De l&apos;ing&eacute;stion vid&eacute;o au fact-checking, chaque module
            exploite l&apos;IA pour vous donner un acc&egrave;s clair et sourc&eacute;
            au discours politique fran&ccedil;ais.
          </p>
        </div>

        {/* Grille responsive */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
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
    description,
    href,
    highlights,
    icon: Icon,
    illustrationIcon: IllustrationIcon,
    iconBgClass,
    iconTextClass,
    illustrationBgClass,
    illustrationIconClass,
  } = feature;

  return (
    <Link
      href={href}
      className="card card-interactive group flex flex-col p-6"
      aria-label={`D\u00e9couvrir ${title}`}
    >
      {/* Badge icone */}
      <div
        className={cn(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]",
          iconBgClass
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-5 w-5", iconTextClass)} />
      </div>

      {/* Titre */}
      <h3 className="mb-2 text-lg font-bold text-[var(--color-text-primary)]">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>

      {/* Points cles */}
      <ul className="mb-5 space-y-1.5">
        {highlights.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]"
          >
            <span
              className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>

      {/* Zone illustration */}
      <div
        className={cn(
          "mb-5 flex h-28 items-center justify-center rounded-[var(--radius-lg)]",
          illustrationBgClass
        )}
        aria-hidden="true"
      >
        <IllustrationIcon
          className={cn(
            "h-10 w-10 opacity-40 transition-transform duration-300 group-hover:scale-110",
            illustrationIconClass
          )}
        />
      </div>

      {/* Bouton CTA */}
      <div className="flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-[var(--transition-fast)] group-hover:bg-[var(--color-primary-hover)]">
        <span>D&eacute;couvrir</span>
        <ArrowRight
          className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

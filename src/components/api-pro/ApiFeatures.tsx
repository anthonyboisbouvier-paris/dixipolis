/* =============================================================================
 * components/api-pro/ApiFeatures.tsx
 *
 * Grille des 6 fonctionnalites principales de l'API Dixipolis.
 * Mise a jour pour refleter les vrais outils des tickets Linear.
 *
 * Composant serveur (Server Component) — pas de "use client".
 * ============================================================================= */

import {
  Globe,
  FileSearch,
  Video,
  Layers,
  Users,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
interface ApiFeatureData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconTextClass: string;
}

/* --------------------------------------------------------------------------
 * 6 features alignees sur les tickets (DIX-17 a DIX-21 + securite).
 * -------------------------------------------------------------------------- */
const apiFeatures: ApiFeatureData[] = [
  {
    id: "semantic-search",
    title: "Recherche s\u00e9mantique",
    description:
      "Retrouvez des passages par le sens, m\u00eame si les mots exacts ne correspondent pas. Id\u00e9al pour des questions comme \u00ab Que dit Macron sur le pouvoir d\u2019achat ? \u00bb.",
    icon: Globe,
    iconBgClass: "bg-[#dbeafe]",
    iconTextClass: "text-[#2563eb]",
  },
  {
    id: "text-search",
    title: "Recherche textuelle",
    description:
      "Trouvez les citations exactes, chiffres et expressions pr\u00e9cises prononc\u00e9s dans les discours. Preuve litt\u00e9rale pour le fact-checking.",
    icon: FileSearch,
    iconBgClass: "bg-[#fef3c7]",
    iconTextClass: "text-[#d97706]",
  },
  {
    id: "video-inventory",
    title: "Inventaire vid\u00e9o",
    description:
      "Listez les vid\u00e9os par politicien, parti ou th\u00e8me sur une p\u00e9riode donn\u00e9e. Construisez des corpus cibl\u00e9s avant toute analyse.",
    icon: Video,
    iconBgClass: "bg-[#dcfce7]",
    iconTextClass: "text-[#16a34a]",
  },
  {
    id: "context-expand",
    title: "Enrichissement contextuel",
    description:
      "R\u00e9cup\u00e9rez le contexte complet d\u2019un segment : tour de parole seul, tours adjacents, ou transcript int\u00e9gral de la vid\u00e9o.",
    icon: Layers,
    iconBgClass: "bg-[#fce7f3]",
    iconTextClass: "text-[#db2777]",
  },
  {
    id: "entity-resolution",
    title: "R\u00e9solution d\u2019entit\u00e9s",
    description:
      "Mappez un nom vers un ID en base avec score de confiance. Fonctionne pour les personnes, partis et th\u00e9matiques.",
    icon: Users,
    iconBgClass: "bg-[#e0e7ff]",
    iconTextClass: "text-[#4f46e5]",
  },
  {
    id: "auth-security",
    title: "S\u00e9curit\u00e9 & Performance",
    description:
      "Cl\u00e9s API, HTTPS, rate limiting configurable. Chaque endpoint est d\u00e9terministe, rapide et compatible avec un usage interactif par un agent IA.",
    icon: Shield,
    iconBgClass: "bg-[#f3e8ff]",
    iconTextClass: "text-[#9333ea]",
  },
];

/* -------------------------------------------------------------------------- */
export default function ApiFeatures() {
  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Fonctionnalit\u00e9s de l'API Dixipolis"
    >
      <div className="page-container">
        {/* En-tete */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Outils pour agents IA
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Chaque endpoint est con&ccedil;u comme un outil d&eacute;terministe
            pour un agent LLM : entr&eacute;es claires, sorties sourc&eacute;es,
            filtres structur&eacute;s.
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {apiFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
function FeatureCard({ feature }: { feature: ApiFeatureData }) {
  const { title, description, icon: Icon, iconBgClass, iconTextClass } = feature;

  return (
    <div className="card group p-6">
      <div
        className={cn(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]",
          iconBgClass
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-5 w-5", iconTextClass)} />
      </div>

      <h3 className="mb-2 text-lg font-bold text-[var(--color-text-primary)]">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>
    </div>
  );
}

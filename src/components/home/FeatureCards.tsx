/* =============================================================================
 * components/home/FeatureCards.tsx
 *
 * Section de presentation des 4 fonctionnalites principales de Dixipolis.
 * Affiche une grille responsive de cartes interactives :
 *   1. Prompt — Interface conversationnelle IA
 *   2. Analytique — Tableaux de bord et statistiques
 *   3. Contenu — Articles et syntheses generes
 *   4. API Pro — Acces programmatique aux donnees
 *
 * Composant serveur (Server Component) — pas de "use client".
 * Chaque carte contient un badge d'icone colore, un titre, une description,
 * une zone d'illustration et un bouton "Decouvrir".
 * ============================================================================= */

import Link from "next/link";
import {
  MessageSquare,
  BarChart3,
  Play,
  Code,
  ArrowRight,
  Search,
  Brain,
  FileText,
  Database,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Interface locale pour definir la structure d'une carte fonctionnalite.
 * Chaque carte possede ses propres couleurs de teinte et son icone.
 * -------------------------------------------------------------------------- */
interface FeatureCardData {
  /** Identifiant unique de la fonctionnalite */
  id: string;
  /** Titre affiche en gras sur la carte */
  title: string;
  /** Description courte de la fonctionnalite */
  description: string;
  /** Route Next.js vers la page dediee */
  href: string;
  /** Composant icone Lucide pour le badge principal */
  icon: React.ComponentType<{ className?: string }>;
  /** Composant icone Lucide pour la zone d'illustration */
  illustrationIcon: React.ComponentType<{ className?: string }>;
  /** Classe Tailwind pour la couleur de fond du badge d'icone */
  iconBgClass: string;
  /** Classe Tailwind pour la couleur du texte de l'icone */
  iconTextClass: string;
  /** Classe Tailwind pour le fond de la zone d'illustration */
  illustrationBgClass: string;
  /** Classe Tailwind pour la couleur de l'icone d'illustration */
  illustrationIconClass: string;
}

/* --------------------------------------------------------------------------
 * Donnees statiques des 4 cartes fonctionnalites.
 *
 * Palette de teintes par fonctionnalite :
 *   - Prompt   : Bleu clair (#dbeafe / #2563eb) — confiance, IA
 *   - Analytique : Vert clair (#dcfce7 / #16a34a) — donnees, croissance
 *   - Contenu  : Rose/violet clair (#fce7f3 / #db2777) — creativite, contenu
 *   - API Pro  : Bleu indigo (#e0e7ff / #4f46e5) — technique, pro
 * -------------------------------------------------------------------------- */
const features: FeatureCardData[] = [
  {
    id: "prompt",
    title: "Prompt",
    description:
      "Posez vos questions en langage naturel. Notre IA analyse des milliers d'heures de discours et vous repond avec des extraits sources.",
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
      "Explorez les tendances du discours politique avec des tableaux de bord interactifs, graphiques temporels et comparaisons thematiques.",
    href: "/analytique",
    icon: BarChart3,
    illustrationIcon: Search,
    iconBgClass: "bg-[#dcfce7]",
    iconTextClass: "text-[#16a34a]",
    illustrationBgClass: "bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]",
    illustrationIconClass: "text-[#16a34a]",
  },
  {
    id: "contenu",
    title: "Contenu",
    description:
      "Consultez des articles, syntheses et newsletters generes automatiquement a partir des declarations politiques les plus recentes.",
    href: "/contenu",
    icon: Play,
    illustrationIcon: FileText,
    iconBgClass: "bg-[#fce7f3]",
    iconTextClass: "text-[#db2777]",
    illustrationBgClass: "bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3]",
    illustrationIconClass: "text-[#db2777]",
  },
  {
    id: "api-pro",
    title: "API Pro",
    description:
      "Integrez les donnees Dixipolis dans vos applications grace a notre API RESTful. Documentation complete, SDK et support dedie.",
    href: "/api-pro",
    icon: Code,
    illustrationIcon: Database,
    iconBgClass: "bg-[#e0e7ff]",
    iconTextClass: "text-[#4f46e5]",
    illustrationBgClass: "bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff]",
    illustrationIconClass: "text-[#4f46e5]",
  },
];

/* --------------------------------------------------------------------------
 * FeatureCards — Composant principal de la grille de fonctionnalites
 *
 * Layout responsive :
 *   - Mobile  (< 640px)  : 1 colonne
 *   - Tablette (640-1023px) : 2 colonnes
 *   - Desktop (>= 1024px) : 4 colonnes
 *
 * Chaque carte est un lien cliquable avec effet de survol (card-interactive).
 * -------------------------------------------------------------------------- */
export default function FeatureCards() {
  return (
    <section
      className="bg-[var(--color-bg-page)] py-16 sm:py-20 lg:py-24"
      aria-label="Fonctionnalites principales de Dixipolis"
    >
      <div className="page-container">
        {/* ----------------------------------------------------------------
         * En-tete de section avec titre et sous-titre
         * Centre, avec espacement genereux avant la grille de cartes.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Quatre outils pour decrypter le politique
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Chaque module exploite l&apos;intelligence artificielle pour vous donner
            un acces clair, rapide et source au discours politique francais.
          </p>
        </div>

        {/* ----------------------------------------------------------------
         * Grille responsive de cartes
         * Utilise CSS Grid avec gap uniforme pour un alignement parfait.
         * ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * FeatureCard — Carte individuelle d'une fonctionnalite
 *
 * Structure interne :
 *   1. Badge d'icone colore (coin superieur gauche)
 *   2. Titre en gras
 *   3. Description textuelle
 *   4. Zone d'illustration avec icone decorative
 *   5. Bouton "Decouvrir" avec fleche directionnelle
 *
 * La carte entiere est cliquable via le lien enveloppant.
 * L'effet card-interactive (defini dans globals.css) applique un
 * deplacement vertical et une ombre au survol.
 * -------------------------------------------------------------------------- */
function FeatureCard({ feature }: { feature: FeatureCardData }) {
  const {
    title,
    description,
    href,
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
      aria-label={`Decouvrir la fonctionnalite ${title}`}
    >
      {/* ----------------------------------------------------------------
       * Badge d'icone — Petit carre arrondi avec icone coloree
       * Fond colore translucide, icone dans la teinte associee.
       * ---------------------------------------------------------------- */}
      <div
        className={cn(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]",
          iconBgClass
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-5 w-5", iconTextClass)} />
      </div>

      {/* ----------------------------------------------------------------
       * Titre de la fonctionnalite
       * Texte principal en gras, taille moderee pour s'adapter a la carte.
       * ---------------------------------------------------------------- */}
      <h3 className="mb-2 text-lg font-bold text-[var(--color-text-primary)]">
        {title}
      </h3>

      {/* ----------------------------------------------------------------
       * Description courte
       * Texte secondaire decrivant brievement la fonctionnalite.
       * flex-1 permet de pousser l'illustration et le bouton vers le bas.
       * ---------------------------------------------------------------- */}
      <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>

      {/* ----------------------------------------------------------------
       * Zone d'illustration decorative
       * Conteneur avec gradient de fond et icone centree de grande taille.
       * Simule un espace pour une illustration ou capture d'ecran future.
       * Au survol de la carte, l'icone se met a l'echelle legerement.
       * ---------------------------------------------------------------- */}
      <div
        className={cn(
          "mb-5 flex h-36 items-center justify-center rounded-[var(--radius-lg)]",
          illustrationBgClass
        )}
        aria-hidden="true"
      >
        <IllustrationIcon
          className={cn(
            "h-12 w-12 opacity-40 transition-transform duration-300 group-hover:scale-110",
            illustrationIconClass
          )}
        />
      </div>

      {/* ----------------------------------------------------------------
       * Bouton "Decouvrir"
       * Bouton plein en bleu primaire avec icone fleche.
       * Au survol de la carte, la fleche se deplace a droite.
       * ---------------------------------------------------------------- */}
      <div className="flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-[var(--transition-fast)] group-hover:bg-[var(--color-primary-hover)]">
        <span>Decouvrir</span>
        <ArrowRight
          className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

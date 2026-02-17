/* =============================================================================
 * components/api-pro/ApiFeatures.tsx
 *
 * Section presentant les 6 fonctionnalites principales de l'API Dixipolis.
 *
 * Affiche une grille responsive de cartes blanches avec bordures subtiles,
 * chacune contenant une icone, un titre et une description courte.
 *
 * Fonctionnalites presentees :
 *   1. Recherche semantique — Requetes en langage naturel
 *   2. Extraction de citations — Verbatims exacts avec sources
 *   3. Metadonnees completes — Orateur, date, source, theme
 *   4. Webhooks & Automatisation — Notifications en temps reel
 *   5. Authentification securisee — Cles API, HTTPS, rate limiting
 *   6. Documentation complete — Guides, exemples, SDK
 *
 * Composant serveur (Server Component) — pas de "use client".
 * Aucune interactivite cote client, rendu statique optimise.
 *
 * Layout responsive :
 *   - Mobile  (< 640px)  : 1 colonne
 *   - Tablette (640-1023px) : 2 colonnes
 *   - Desktop (>= 1024px) : 3 colonnes
 * ============================================================================= */

import {
  Globe,
  Database,
  Webhook,
  Shield,
  BookOpen,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Interface — Structure d'une carte fonctionnalite API
 * -------------------------------------------------------------------------- */
interface ApiFeatureData {
  /** Identifiant unique pour la cle React */
  id: string;
  /** Titre de la fonctionnalite */
  title: string;
  /** Description courte (1-2 phrases) */
  description: string;
  /** Composant icone Lucide */
  icon: React.ComponentType<{ className?: string }>;
  /** Classe de couleur de fond pour le badge d'icone */
  iconBgClass: string;
  /** Classe de couleur de texte pour l'icone */
  iconTextClass: string;
}

/* --------------------------------------------------------------------------
 * Donnees statiques — Les 6 fonctionnalites de l'API
 *
 * Chaque fonctionnalite utilise une teinte de couleur differente pour
 * son badge d'icone, tout en restant dans la palette Dixipolis.
 * -------------------------------------------------------------------------- */
const apiFeatures: ApiFeatureData[] = [
  {
    id: "semantic-search",
    title: "Recherche s\u00e9mantique",
    description:
      "Interrogez les discours en langage naturel. Notre moteur IA comprend le sens de vos requ\u00eates, pas seulement les mots-cl\u00e9s.",
    icon: Globe,
    iconBgClass: "bg-[#dbeafe]",
    iconTextClass: "text-[#2563eb]",
  },
  {
    id: "citation-extraction",
    title: "Extraction de citations",
    description:
      "R\u00e9cup\u00e9rez les verbatims exacts avec lien vid\u00e9o horodat\u00e9, nom de l\u2019orateur et contexte complet de la d\u00e9claration.",
    icon: Zap,
    iconBgClass: "bg-[#fef3c7]",
    iconTextClass: "text-[#d97706]",
  },
  {
    id: "metadata",
    title: "M\u00e9tadonn\u00e9es compl\u00e8tes",
    description:
      "Chaque r\u00e9sultat inclut l\u2019orateur, le parti, la date, la source vid\u00e9o, le th\u00e8me d\u00e9tect\u00e9 et le score de pertinence.",
    icon: Database,
    iconBgClass: "bg-[#dcfce7]",
    iconTextClass: "text-[#16a34a]",
  },
  {
    id: "webhooks",
    title: "Webhooks & Automatisation",
    description:
      "Configurez des webhooks pour \u00eatre notifi\u00e9 en temps r\u00e9el lorsqu\u2019un politicien s\u2019exprime sur un sujet suivi.",
    icon: Webhook,
    iconBgClass: "bg-[#fce7f3]",
    iconTextClass: "text-[#db2777]",
  },
  {
    id: "auth",
    title: "Authentification s\u00e9curis\u00e9e",
    description:
      "Cl\u00e9s API avec rotation, chiffrement HTTPS, rate limiting configurable et journaux d\u2019acc\u00e8s d\u00e9taill\u00e9s.",
    icon: Shield,
    iconBgClass: "bg-[#e0e7ff]",
    iconTextClass: "text-[#4f46e5]",
  },
  {
    id: "documentation",
    title: "Documentation compl\u00e8te",
    description:
      "Guides de d\u00e9marrage, r\u00e9f\u00e9rence d\u2019endpoints, exemples de code en Python, JavaScript et cURL, et changelog.",
    icon: BookOpen,
    iconBgClass: "bg-[#f3e8ff]",
    iconTextClass: "text-[#9333ea]",
  },
];

/* --------------------------------------------------------------------------
 * ApiFeatures — Composant principal de la grille de fonctionnalites
 *
 * Structure :
 *   1. En-tete de section (titre + sous-titre centre)
 *   2. Grille responsive de 6 cartes FeatureCard
 *
 * Fond de section : blanc (var(--color-bg-card)) pour se distinguer
 * des sections adjacentes qui utilisent le gris clair.
 * -------------------------------------------------------------------------- */
export default function ApiFeatures() {
  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Fonctionnalit\u00e9s de l'API Dixipolis"
    >
      <div className="page-container">
        {/* ----------------------------------------------------------------
         * En-tete de section
         * Titre et description centres pour introduire la grille.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Une API compl&egrave;te et bien document&eacute;e pour int&eacute;grer
            les donn&eacute;es du discours politique fran&ccedil;ais dans vos projets.
          </p>
        </div>

        {/* ----------------------------------------------------------------
         * Grille de cartes
         * 1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop.
         * Gap uniforme pour un alignement visuel propre.
         * ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {apiFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * FeatureCard — Carte individuelle d'une fonctionnalite API
 *
 * Structure interne :
 *   1. Badge d'icone colore (carre arrondi)
 *   2. Titre en gras
 *   3. Description textuelle
 *
 * Design :
 *   - Fond blanc avec bordure subtile (classe .card)
 *   - Ombre legere au repos, ombre moyenne au survol
 *   - Coins arrondis (--radius-lg)
 *   - Pas de lien : carte informative uniquement
 * -------------------------------------------------------------------------- */
function FeatureCard({ feature }: { feature: ApiFeatureData }) {
  const { title, description, icon: Icon, iconBgClass, iconTextClass } = feature;

  return (
    <div className="card group p-6">
      {/* Badge d'icone — Carre arrondi avec couleur de fond thematique */}
      <div
        className={cn(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]",
          iconBgClass
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-5 w-5", iconTextClass)} />
      </div>

      {/* Titre de la fonctionnalite */}
      <h3 className="mb-2 text-lg font-bold text-[var(--color-text-primary)]">
        {title}
      </h3>

      {/* Description courte */}
      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>
    </div>
  );
}

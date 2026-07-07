/* =============================================================================
 * components/contenu/ContentCard.tsx
 *
 * Composant serveur (Server Component) qui affiche une carte individuelle
 * pour un contenu genere par l'IA (article, newsletter, synthese ou alerte).
 *
 * Responsabilites :
 *   - Affiche un badge de type colore en haut de la carte
 *     (article = bleu, newsletter = violet, synthese = vert, alerte = orange)
 *   - Titre en gras, tronque a 2 lignes pour un rendu uniforme dans la grille
 *   - Resume du contenu, tronque a 3 lignes pour garder les cartes compactes
 *   - Badge thematique indiquant le sujet principal du contenu
 *   - Pied de carte avec : temps de lecture, date relative, politiciens concernes
 *   - Badge « A venir » : ces formats ne sont pas encore publies, la carte
 *     n'est donc pas cliquable (pas de lien mort vers une page inexistante)
 *
 * Ce composant ne contient aucune logique cote client (pas de "use client").
 * Il recoit un objet GeneratedContent en props et rend un affichage statique.
 *
 * Utilisation :
 *   <ContentCard content={monContenu} />
 * ============================================================================= */

import {
  FileText,
  Mail,
  BookOpen,
  Bell,
  Clock,
  Tag,
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn, formatRelativeDate, getReadTimeLabel, truncateText } from "@/lib/utils";
import type { GeneratedContent } from "@/types";

/* --------------------------------------------------------------------------
 * Types — Props du composant ContentCard
 * -------------------------------------------------------------------------- */
interface ContentCardProps {
  /** L'objet contenu genere a afficher dans la carte */
  content: GeneratedContent;
}

/* --------------------------------------------------------------------------
 * Configuration des types de contenu
 *
 * Chaque type de contenu possede :
 *   - label   : libelle affiche dans le badge (en francais)
 *   - icon    : icone Lucide associee au type
 *   - classes : classes Tailwind pour le badge (couleur de fond et texte)
 *
 * Les couleurs suivent une convention semantique :
 *   - Article    -> bleu   : contenu informatif principal
 *   - Newsletter -> violet : compilation periodique
 *   - Synthese   -> vert   : resume analytique
 *   - Alerte     -> orange : notification importante
 * -------------------------------------------------------------------------- */
const TYPE_CONFIG: Record<
  GeneratedContent["type"],
  { label: string; icon: typeof FileText; classes: string }
> = {
  article: {
    label: "Article",
    icon: FileText,
    classes: "bg-blue-50 text-blue-700",
  },
  newsletter: {
    label: "Newsletter",
    icon: Mail,
    classes: "bg-purple-50 text-purple-700",
  },
  synthesis: {
    label: "Synth\u00e8se",
    icon: BookOpen,
    classes: "bg-green-50 text-green-700",
  },
  alert: {
    label: "Alerte",
    icon: Bell,
    classes: "bg-orange-50 text-orange-700",
  },
  "fact-check": {
    label: "Fact-check",
    icon: CheckCircle,
    classes: "bg-emerald-50 text-emerald-700",
  },
  propaganda: {
    label: "Propagande",
    icon: AlertTriangle,
    classes: "bg-red-50 text-red-700",
  },
};

/* --------------------------------------------------------------------------
 * ContentCard — Composant principal
 *
 * Structure de la carte :
 *   1. En-tete  : badge de type avec icone et libelle + badge « A venir »
 *   2. Corps    : titre (2 lignes max) + resume (3 lignes max) + badge theme
 *   3. Pied     : temps de lecture, date relative, politiciens associes
 *
 * La carte est un <article> statique : ces formats editoriaux ne sont pas
 * encore publies, il n'y a donc aucune page de detail vers laquelle pointer.
 * -------------------------------------------------------------------------- */
export default function ContentCard({ content }: ContentCardProps) {
  /* Recuperation de la configuration du type de contenu */
  const typeConfig = TYPE_CONFIG[content.type];
  const TypeIcon = typeConfig.icon;

  return (
    <article
      className={cn(
        /* Base de la carte : fond blanc, bordure, coins arrondis */
        "card",

        /* Disposition en colonne pour empiler les elements verticalement */
        "flex flex-col",

        /* Padding interne genereux pour aerer le contenu */
        "p-5",

        /* Couleur de texte du design system */
        "text-[var(--color-text-primary)]"
      )}
      aria-label={content.title}
    >
      {/* ================================================================
       * EN-TETE : Badge de type de contenu + badge « A venir »
       * Le badge de type affiche une icone et un libelle colore.
       * Le badge « A venir » signale que ce format n'est pas encore publie.
       * ================================================================ */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            /* Style de base du badge : inline-flex, arrondi en pilule */
            "inline-flex items-center gap-1.5",
            "rounded-[var(--radius-full)]",
            "px-2.5 py-1 text-xs font-semibold",

            /* Couleurs specifiques au type de contenu */
            typeConfig.classes
          )}
        >
          {/* Icone du type de contenu (decorative) */}
          <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {typeConfig.label}
        </span>

        {/* Badge « A venir » — format editorial non encore publie */}
        <span
          className={cn(
            "inline-flex items-center",
            "rounded-[var(--radius-full)]",
            "border border-[var(--color-border)]",
            "bg-[var(--color-bg-section)] text-[var(--color-text-muted)]",
            "px-2.5 py-1 text-xs font-medium"
          )}
        >
          &Agrave; venir
        </span>
      </div>

      {/* ================================================================
       * CORPS : Titre + Resume + Badge theme
       * Le flex-1 permet au corps de s'etendre et de pousser le pied
       * vers le bas, assurant un alignement vertical uniforme dans la grille.
       * ================================================================ */}
      <div className="flex flex-1 flex-col">
        {/* ---- Titre du contenu ---- */}
        {/* line-clamp-2 tronque le titre a 2 lignes avec des points de suspension */}
        <h3
          className={cn(
            "mb-2 text-base font-bold leading-snug",
            "text-[var(--color-text-primary)]",
            "line-clamp-2"
          )}
        >
          {content.title}
        </h3>

        {/* ---- Resume / extrait du contenu ---- */}
        {/* line-clamp-3 tronque le resume a 3 lignes pour un rendu compact */}
        <p
          className={cn(
            "mb-3 text-sm leading-relaxed",
            "text-[var(--color-text-secondary)]",
            "line-clamp-3"
          )}
        >
          {truncateText(content.summary, 180)}
        </p>

        {/* ---- Badge thematique ---- */}
        {/* Affiche le theme principal du contenu avec une icone "tag" */}
        <div className="mb-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              "rounded-[var(--radius-full)]",
              "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
              "px-2.5 py-0.5 text-xs font-medium"
            )}
          >
            <Tag className="h-3 w-3" aria-hidden="true" />
            {content.theme}
          </span>
        </div>
      </div>

      {/* ================================================================
       * PIED DE CARTE : Metadonnees
       * Affiche le temps de lecture, la date relative et les politiciens
       * concernes. Separe du corps par une bordure fine.
       * ================================================================ */}
      <div
        className={cn(
          "flex flex-col gap-2",
          "border-t border-[var(--color-border)] pt-3",
          "text-xs text-[var(--color-text-muted)]"
        )}
      >
        {/* Ligne principale : temps de lecture + date relative */}
        <div className="flex items-center justify-between">
          {/* Temps de lecture avec icone horloge */}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {getReadTimeLabel(content.readTimeMinutes)}
          </span>

          {/* Date de publication relative (ex: "il y a 2j") */}
          <span>{formatRelativeDate(content.publishedAt)}</span>
        </div>

        {/* ---- Politiciens associes ---- */}
        {/* Affiche uniquement si le contenu est lie a des politiciens */}
        {content.relatedPoliticians.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Icone "utilisateurs" pour indiquer des personnalites */}
            <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />

            {/* Badges individuels pour chaque politicien */}
            {content.relatedPoliticians.map((politician) => (
              <span
                key={politician}
                className={cn(
                  "inline-flex items-center",
                  "rounded-[var(--radius-full)]",
                  "bg-[var(--color-bg-section)] text-[var(--color-text-secondary)]",
                  "px-2 py-0.5 text-xs"
                )}
              >
                {politician}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

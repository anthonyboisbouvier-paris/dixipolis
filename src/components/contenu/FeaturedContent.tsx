/* =============================================================================
 * components/contenu/FeaturedContent.tsx
 *
 * Composant serveur (Server Component) qui affiche un contenu "a la une"
 * en format hero, mis en avant en haut de la page Contenu.
 *
 * Responsabilites :
 *   - Prend le premier element de MOCK_CONTENT comme contenu vedette
 *   - Affiche une carte plus grande et detaillee que les cartes de la grille
 *   - Accent visuel : bordure gauche avec un degrade bleu pour attirer l'oeil
 *   - Affiche le type, le titre complet, le resume etendu, le theme,
 *     les politiciens concernes, le temps de lecture et la date
 *   - Bouton CTA "Lire l'article" pour diriger vers la page de detail
 *
 * Ce composant ne contient aucune logique cote client (pas de "use client").
 * Il rend un affichage statique base sur les donnees mock.
 *
 * Utilisation :
 *   <FeaturedContent />
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
import { cn, formatDate, getReadTimeLabel } from "@/lib/utils";
import { MOCK_CONTENT } from "@/lib/constants";
import type { GeneratedContent } from "@/types";

/* --------------------------------------------------------------------------
 * Configuration des types de contenu (identique a ContentCard)
 *
 * Reutilise les memes couleurs et icones que ContentCard pour assurer
 * la coherence visuelle entre le contenu vedette et la grille.
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
 * FeaturedContent — Composant principal
 *
 * Affiche le premier contenu de la liste mock dans un format "hero"
 * avec une mise en page horizontale sur desktop (image/texte) et
 * verticale sur mobile.
 *
 * L'accent bleu sur la bordure gauche cree une signature visuelle forte
 * qui distingue ce contenu des cartes normales de la grille.
 *
 * Structure :
 *   1. Bordure gauche decorative (degrade bleu)
 *   2. Zone de contenu :
 *      a. Badge de type + badge "A la une"
 *      b. Titre complet (sans troncature)
 *      c. Resume etendu
 *      d. Metadonnees (theme, politiciens, temps de lecture, date)
 *      e. Bouton CTA "Lire l'article"
 * -------------------------------------------------------------------------- */
export default function FeaturedContent() {
  /* Recuperation du premier contenu comme contenu vedette */
  const featured = MOCK_CONTENT[0];

  /* Si aucun contenu n'est disponible, ne rien afficher */
  if (!featured) return null;

  /* Configuration du type de contenu vedette */
  const typeConfig = TYPE_CONFIG[featured.type];
  const TypeIcon = typeConfig.icon;

  return (
    <section
      className="mb-8"
      aria-label="Contenu &agrave; la une"
    >
      {/* ================================================================
       * CARTE VEDETTE
       *
       * La carte utilise position: relative pour permettre le placement
       * de la bordure degrade en pseudo-element a gauche.
       * overflow: hidden empeche le degrade de depasser les coins arrondis.
       * ================================================================ */}
      <article
        className={cn(
          /* Base de la carte : fond blanc, bordure, coins arrondis */
          "card",

          /* Position relative pour la bordure degrade */
          "relative overflow-hidden",

          /* Disposition horizontale sur desktop */
          "flex flex-col",

          /* Couleur du texte */
          "text-[var(--color-text-primary)]"
        )}
        aria-label={`\u00c0 la une : ${featured.title}`}
      >
        {/* ================================================================
         * BORDURE GAUCHE DECORATIVE — Degrade bleu
         *
         * Bande verticale de 4px avec un degrade bleu clair vers bleu fonce.
         * Cree une signature visuelle qui distingue le contenu vedette.
         * ================================================================ */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1",
            "bg-gradient-to-b from-[var(--color-primary-600)] via-[var(--color-primary)] to-[var(--color-primary-900)]"
          )}
          aria-hidden="true"
        />

        {/* ================================================================
         * ZONE DE CONTENU
         *
         * Padding gauche supplementaire pour compenser la bordure degrade.
         * Espacement genereux pour un rendu "hero" aere.
         * ================================================================ */}
        <div className="p-6 pl-7 sm:p-8 sm:pl-9">
          {/* ---- En-tete : Badges de type et "A la une" ---- */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* Badge du type de contenu (article, newsletter, etc.) */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                "rounded-[var(--radius-full)]",
                "px-2.5 py-1 text-xs font-semibold",
                typeConfig.classes
              )}
            >
              <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {typeConfig.label}
            </span>

            {/* Badge "A la une" distinctif avec fond bleu primaire */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                "rounded-[var(--radius-full)]",
                "bg-[var(--color-primary)] text-[var(--color-text-on-primary)]",
                "px-2.5 py-1 text-xs font-semibold"
              )}
            >
              &Agrave; la une
            </span>
          </div>

          {/* ---- Titre complet (sans troncature pour le contenu vedette) ---- */}
          <h2
            className={cn(
              "mb-3 text-xl font-bold leading-snug",
              "text-[var(--color-text-primary)]",
              "sm:text-2xl"
            )}
          >
            {featured.title}
          </h2>

          {/* ---- Resume etendu ---- */}
          {/* Le resume est affiche en entier pour le contenu vedette */}
          <p
            className={cn(
              "mb-5 text-sm leading-relaxed",
              "text-[var(--color-text-secondary)]",
              "sm:text-base",
              "max-w-3xl"
            )}
          >
            {featured.summary}
          </p>

          {/* ---- Metadonnees : theme, politiciens, temps de lecture, date ---- */}
          <div
            className={cn(
              "mb-5 flex flex-wrap items-center gap-3",
              "text-sm text-[var(--color-text-muted)]"
            )}
          >
            {/* Badge thematique avec icone "tag" */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                "rounded-[var(--radius-full)]",
                "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
                "px-2.5 py-0.5 text-xs font-medium"
              )}
            >
              <Tag className="h-3 w-3" aria-hidden="true" />
              {featured.theme}
            </span>

            {/* Separateur visuel */}
            <span className="text-[var(--color-border)]" aria-hidden="true">|</span>

            {/* Temps de lecture avec icone horloge */}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {getReadTimeLabel(featured.readTimeMinutes)}
            </span>

            {/* Separateur visuel */}
            <span className="text-[var(--color-border)]" aria-hidden="true">|</span>

            {/* Date de publication complete (pas relative, car contenu vedette) */}
            <span>{formatDate(featured.publishedAt)}</span>
          </div>

          {/* ---- Politiciens concernes ---- */}
          {featured.relatedPoliticians.length > 0 && (
            <div className="mb-5 flex items-center gap-2 flex-wrap">
              {/* Icone "utilisateurs" */}
              <Users
                className="h-4 w-4 text-[var(--color-text-muted)] shrink-0"
                aria-hidden="true"
              />

              {/* Badges des politiciens */}
              {featured.relatedPoliticians.map((politician) => (
                <span
                  key={politician}
                  className={cn(
                    "inline-flex items-center",
                    "rounded-[var(--radius-full)]",
                    "bg-[var(--color-bg-section)] text-[var(--color-text-secondary)]",
                    "px-2.5 py-1 text-xs font-medium",
                    "border border-[var(--color-border-light)]"
                  )}
                >
                  {politician}
                </span>
              ))}
            </div>
          )}

          {/* ---- Badge "Bientot disponible" ---- */}
          <span
            className={cn(
              "inline-flex items-center gap-2",
              "rounded-[var(--radius-full)]",
              "bg-[var(--color-bg-section)] text-[var(--color-text-muted)]",
              "px-3 py-1 text-xs font-medium",
              "border border-[var(--color-border-light)]"
            )}
          >
            Bient&ocirc;t disponible
          </span>
        </div>
      </article>
    </section>
  );
}

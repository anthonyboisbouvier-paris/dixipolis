/* =============================================================================
 * components/prompt/SourceCard.tsx
 *
 * Composant de carte source premium pour un extrait de discours politique.
 *
 * Affiche les informations clefs d'un verbatim cite comme source dans une
 * reponse du chatbot :
 *   - Icone play a gauche pour signaler le contenu video
 *   - Nom du politicien et badge de parti colore
 *   - Titre de la video source
 *   - Date du discours et timecode de debut
 *   - Icone de lien externe pour signaler la redirection YouTube
 *
 * Le composant est compact, dense mais lisible, avec un design horizontal
 * et un effet de survol subtil (elevation + mise en couleur de la bordure).
 *
 * Regles de style :
 *   - Toutes les couleurs utilisent des variables CSS via style={{ }}
 *   - Les couleurs de parti utilisent des variables CSS custom en inline
 *   - Effet de survol gere par style pour respecter le design system
 *
 * Utilisation :
 *   <SourceCard excerpt={speechExcerpt} />
 * ============================================================================= */

import { cn } from "@/lib/utils";
import { formatDate, formatTimecode } from "@/lib/utils";
import type { SpeechExcerpt } from "@/types";
import { Play, ExternalLink, Clock } from "lucide-react";

/* --------------------------------------------------------------------------
 * Props du composant
 * -------------------------------------------------------------------------- */
interface SourceCardProps {
  /** L'extrait de discours a afficher comme source */
  excerpt: SpeechExcerpt;
  /** Classes CSS supplementaires pour personnaliser l'apparence */
  className?: string;
}

/* --------------------------------------------------------------------------
 * Mapping des couleurs par parti politique
 *
 * Chaque parti est associe a une paire de couleurs CSS (fond + texte)
 * pour le badge. Les couleurs utilisent des variables CSS ou des valeurs
 * inline pour rester coherent avec le design system.
 * -------------------------------------------------------------------------- */
const PARTY_COLORS: Record<string, { bg: string; text: string }> = {
  RE:    { bg: "rgb(255 215 0 / 0.15)", text: "rgb(161 98 7)" },
  RN:    { bg: "rgb(13 43 85 / 0.1)",   text: "rgb(13 43 85)" },
  LFI:   { bg: "rgb(204 0 0 / 0.1)",    text: "rgb(153 27 27)" },
  LR:    { bg: "rgb(0 102 204 / 0.1)",   text: "rgb(30 64 175)" },
  PS:    { bg: "rgb(255 105 180 / 0.1)", text: "rgb(157 23 77)" },
  EELV:  { bg: "rgb(0 168 107 / 0.1)",  text: "rgb(22 101 52)" },
  PCF:   { bg: "rgb(221 0 0 / 0.12)",   text: "rgb(127 29 29)" },
  MoDem: { bg: "rgb(255 140 0 / 0.1)",  text: "rgb(146 64 14)" },
  PD:    { bg: "rgb(20 184 166 / 0.1)", text: "rgb(17 94 89)" },
};

/* --------------------------------------------------------------------------
 * Couleurs par defaut pour les partis non mappes
 * -------------------------------------------------------------------------- */
const DEFAULT_PARTY_COLOR = {
  bg: "var(--color-bg-section)",
  text: "var(--color-text-secondary)",
};

/* --------------------------------------------------------------------------
 * Composant SourceCard
 * -------------------------------------------------------------------------- */
export default function SourceCard({ excerpt, className }: SourceCardProps) {
  /* Recuperation des couleurs du badge de parti */
  const partyColor = PARTY_COLORS[excerpt.party] ?? DEFAULT_PARTY_COLOR;

  return (
    <a
      href={excerpt.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block rounded-[var(--radius-md)]",
        "transition-all duration-[var(--transition-normal)]",
        className
      )}
      style={{
        backgroundColor: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        padding: "10px 12px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--color-primary-200)";
        el.style.boxShadow = "var(--shadow-md)";
        el.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--color-border)";
        el.style.boxShadow = "none";
        el.style.transform = "translateY(0)";
      }}
      aria-label={`Source : ${excerpt.politicianName} \u2014 ${excerpt.videoTitle}`}
    >
      {/* ---- Layout horizontal : icone play + contenu + lien externe ---- */}
      <div className="flex items-start gap-2.5">

        {/* Icone play dans un cercle subtil */}
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5"
          style={{
            backgroundColor: "var(--color-primary-50)",
          }}
        >
          <Play
            className="h-3.5 w-3.5 ml-0.5"
            style={{ color: "var(--color-primary)" }}
            aria-hidden="true"
          />
        </div>

        {/* Contenu principal : nom, titre, date, timecode */}
        <div className="flex-1 min-w-0">

          {/* En-tete : nom du politicien + badge parti */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "var(--color-text-primary)" }}
            >
              {excerpt.politicianName}
            </span>
            <span
              className="inline-flex shrink-0 items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none"
              style={{
                backgroundColor: partyColor.bg,
                color: partyColor.text,
              }}
            >
              {excerpt.party}
            </span>
          </div>

          {/* Titre de la video source */}
          <p
            className="text-xs line-clamp-1 mb-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {excerpt.videoTitle}
          </p>

          {/* Pied de carte : date + timecode */}
          <div
            className="flex items-center gap-3 text-[11px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span>{formatDate(excerpt.date)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatTimecode(excerpt.startTime)}
            </span>
          </div>
        </div>

        {/* Icone de lien externe — visible au survol */}
        <ExternalLink
          className="h-3.5 w-3.5 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--color-text-muted)" }}
          aria-hidden="true"
        />
      </div>
    </a>
  );
}

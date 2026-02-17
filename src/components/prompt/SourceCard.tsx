/* =============================================================================
 * components/prompt/SourceCard.tsx
 *
 * Composant de carte source pour un extrait de discours politique.
 *
 * Affiche les informations clefs d'un verbatim cit comme source dans une
 * reponse du chatbot :
 *   - Nom du politicien et badge de parti
 *   - Titre de la video source
 *   - Date du discours
 *   - Timecode clickable menant a la video YouTube horodatee
 *   - Icone de lien externe pour signaler la redirection
 *
 * Le composant est concu pour etre utilise a l'interieur de MessageBubble,
 * sous le texte de la reponse de l'assistant.
 *
 * Utilisation :
 *   <SourceCard excerpt={speechExcerpt} />
 * ============================================================================= */

import { cn } from "@/lib/utils";
import { formatDate, formatTimecode } from "@/lib/utils";
import type { SpeechExcerpt } from "@/types";
import { ExternalLink, Clock } from "lucide-react";

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
 * Permet d'afficher un badge colore en fonction du parti de l'orateur.
 * Les couleurs correspondent a la charte graphique officielle de chaque parti.
 * -------------------------------------------------------------------------- */
const PARTY_COLORS: Record<string, { bg: string; text: string }> = {
  RE:    { bg: "bg-amber-100",   text: "text-amber-800" },
  RN:    { bg: "bg-blue-900/10", text: "text-blue-900" },
  LFI:   { bg: "bg-red-100",     text: "text-red-800" },
  LR:    { bg: "bg-blue-100",    text: "text-blue-800" },
  PS:    { bg: "bg-pink-100",    text: "text-pink-800" },
  EELV:  { bg: "bg-green-100",   text: "text-green-800" },
  PCF:   { bg: "bg-red-200",     text: "text-red-900" },
  MoDem: { bg: "bg-orange-100",  text: "text-orange-800" },
  PD:    { bg: "bg-teal-100",    text: "text-teal-800" },
};

/* --------------------------------------------------------------------------
 * Composant SourceCard
 * -------------------------------------------------------------------------- */
export default function SourceCard({ excerpt, className }: SourceCardProps) {
  /* Recuperation des couleurs du badge de parti, avec un fallback gris */
  const partyColor = PARTY_COLORS[excerpt.party] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <a
      href={excerpt.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        /* Structure de base : carte avec bordure et fond blanc */
        "group block rounded-[var(--radius-md)] border border-[var(--color-border)]",
        "bg-[var(--color-bg-card)] p-3",

        /* Transition fluide au survol */
        "transition-all duration-[var(--transition-normal)]",
        "hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-md)]",

        /* Classes supplementaires eventuelles */
        className
      )}
      aria-label={`Source : ${excerpt.politicianName} — ${excerpt.videoTitle}`}
    >
      {/* ---- En-tete : nom du politicien + badge parti ---- */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {/* Nom du politicien */}
          <span className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
            {excerpt.politicianName}
          </span>

          {/* Badge du parti politique */}
          <span
            className={cn(
              "inline-flex shrink-0 items-center px-1.5 py-0.5 rounded-full",
              "text-[10px] font-semibold leading-none",
              partyColor.bg,
              partyColor.text
            )}
          >
            {excerpt.party}
          </span>
        </div>

        {/* Icone de lien externe — visible au survol */}
        <ExternalLink
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]",
            "transition-colors duration-[var(--transition-fast)]",
            "group-hover:text-[var(--color-primary)]"
          )}
          aria-hidden="true"
        />
      </div>

      {/* ---- Titre de la video source ---- */}
      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-1.5">
        {excerpt.videoTitle}
      </p>

      {/* ---- Pied de carte : date + timecode ---- */}
      <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
        {/* Date du discours formatee en francais */}
        <span>{formatDate(excerpt.date)}</span>

        {/* Timecode de debut avec icone horloge */}
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {formatTimecode(excerpt.startTime)}
        </span>
      </div>
    </a>
  );
}

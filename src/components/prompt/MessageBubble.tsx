/* =============================================================================
 * components/prompt/MessageBubble.tsx
 *
 * Composant "bulle de message" pour l'interface de chat Dixipolis.
 *
 * Gere l'affichage d'un message unique dans la conversation :
 *   - Messages utilisateur : alignes a droite, fond bleu, texte blanc
 *   - Messages assistant   : alignes a gauche, fond blanc, icone bot Dixipolis
 *   - Etat de chargement   : animation de trois points pulses
 *   - Sources              : cartes cliquables affichees sous le texte assistant
 *
 * Le composant applique automatiquement l'animation CSS "animate-fade-in"
 * (definie dans globals.css) pour une apparition fluide dans le flux de chat.
 *
 * Utilisation :
 *   <MessageBubble message={chatMessage} />
 * ============================================================================= */

"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { Bot, User } from "lucide-react";
import SourceCard from "@/components/prompt/SourceCard";

/* --------------------------------------------------------------------------
 * Props du composant
 * -------------------------------------------------------------------------- */
interface MessageBubbleProps {
  /** Le message de chat a afficher */
  message: ChatMessage;
}

/* --------------------------------------------------------------------------
 * Composant MessageBubble
 * -------------------------------------------------------------------------- */
export default function MessageBubble({ message }: MessageBubbleProps) {
  /* Determine si le message provient de l'utilisateur */
  const isUser = message.role === "user";

  /* Determine si le message est en cours de chargement (reponse en attente) */
  const isLoading = message.isLoading === true;

  return (
    <div
      className={cn(
        /* Animation d'entree : apparition progressive */
        "animate-fade-in",

        /* Alignement : droite pour l'utilisateur, gauche pour l'assistant */
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* ================================================================
       * AVATAR DE L'ASSISTANT (affiché uniquement pour les messages bot)
       * Icone circulaire bleue avec le logo bot.
       * ================================================================ */}
      {!isUser && (
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            "bg-[var(--color-primary)] text-white",
            "mt-1"
          )}
          aria-hidden="true"
        >
          <Bot className="h-4 w-4" />
        </div>
      )}

      {/* ================================================================
       * CONTENU DU MESSAGE
       * Structure verticale : bulle de texte + eventuelles sources.
       * ================================================================ */}
      <div
        className={cn(
          "flex flex-col",
          /* Largeur maximale pour eviter que la bulle s'etende sur toute la ligne */
          "max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]"
        )}
      >
        {/* ---- Bulle de texte ---- */}
        <div
          className={cn(
            /* Padding et arrondi de la bulle */
            "rounded-2xl px-4 py-2.5",

            /* Styles conditionnels selon le role */
            isUser
              ? /* Message utilisateur : fond bleu, texte blanc, coin inferieur droit plus anguleux */
                cn(
                  "bg-[var(--color-primary)] text-white",
                  "rounded-br-md"
                )
              : /* Message assistant : fond blanc, texte sombre, bordure subtile, coin inferieur gauche anguleux */
                cn(
                  "bg-[var(--color-bg-card)] text-[var(--color-text-primary)]",
                  "border border-[var(--color-border)]",
                  "shadow-[var(--shadow-sm)]",
                  "rounded-bl-md"
                )
          )}
        >
          {/* ---- Contenu : texte ou animation de chargement ---- */}
          {isLoading ? (
            /* Animation de chargement : trois points qui pulsent */
            <div className="flex items-center gap-1.5 py-1" aria-label="Chargement de la reponse">
              <span className="loading-dot h-2 w-2 rounded-full bg-[var(--color-text-muted)]" />
              <span className="loading-dot h-2 w-2 rounded-full bg-[var(--color-text-muted)]" />
              <span className="loading-dot h-2 w-2 rounded-full bg-[var(--color-text-muted)]" />
            </div>
          ) : (
            /* Texte du message avec gestion des sauts de ligne */
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>

        {/* ================================================================
         * SECTION SOURCES (uniquement pour les messages assistant avec sources)
         *
         * Affiche les extraits de discours cites en reference sous la bulle,
         * sous forme de cartes cliquables menant aux videos horodatees.
         * ================================================================ */}
        {!isUser && !isLoading && message.sources && message.sources.length > 0 && (
          <div className="mt-2.5 space-y-1.5">
            {/* Titre de la section sources */}
            <p className="text-xs font-medium text-[var(--color-text-muted)] ml-1">
              Sources ({message.sources.length})
            </p>

            {/* Grille de cartes sources : une colonne sur mobile, deux sur desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((excerpt) => (
                <SourceCard key={excerpt.id} excerpt={excerpt} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================
       * AVATAR DE L'UTILISATEUR (affiché uniquement pour les messages user)
       * Icone circulaire gris clair avec silhouette utilisateur.
       * ================================================================ */}
      {isUser && (
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            "bg-[var(--color-bg-section)] border border-[var(--color-border)]",
            "text-[var(--color-text-secondary)]",
            "mt-1"
          )}
          aria-hidden="true"
        >
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

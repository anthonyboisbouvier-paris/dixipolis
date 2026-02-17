/* =============================================================================
 * components/prompt/MessageBubble.tsx
 *
 * Composant "bulle de message" premium pour l'interface de chat Dixipolis.
 *
 * Gere l'affichage d'un message unique dans la conversation :
 *   - Messages UTILISATEUR : alignes a droite, gradient bleu, texte blanc,
 *     coins arrondis avec coin inferieur droit plus anguleux (rounded-br-md)
 *   - Messages ASSISTANT  : alignes a gauche, carte blanche avec bordure
 *     subtile, petit avatar Dixipolis a gauche, coins arrondis avec coin
 *     inferieur gauche plus anguleux (rounded-bl-md)
 *   - Etat CHARGEMENT     : animation de trois points pulses (.loading-dot)
 *   - SOURCES             : cartes SourceCard affichees sous le texte assistant
 *
 * Le composant applique l'animation CSS "animate-fade-in-up" (definie dans
 * globals.css) pour une apparition fluide dans le flux de chat.
 *
 * Regles de style :
 *   - Toutes les couleurs utilisent des variables CSS via style={{ }}
 *   - Pas de couleurs Tailwind brutes
 *   - Le gradient utilisateur utilise la classe .gradient-primary de globals.css
 *
 * Utilisation :
 *   <MessageBubble message={chatMessage} />
 * ============================================================================= */

"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { Sparkles } from "lucide-react";
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
        /* Animation d'entree : apparition progressive depuis le bas */
        "animate-fade-in-up",
        /* Alignement : droite pour l'utilisateur, gauche pour l'assistant */
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* ================================================================
       * AVATAR DE L'ASSISTANT — petit cercle avec icone Dixipolis
       *
       * Affiche uniquement pour les messages du bot. Cercle avec gradient
       * primaire et icone Sparkles en blanc.
       * ================================================================ */}
      {!isUser && (
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-1"
          style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
          }}
          aria-hidden="true"
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--color-text-on-primary)" }} />
        </div>
      )}

      {/* ================================================================
       * CONTENU DU MESSAGE
       *
       * Structure verticale : bulle de texte + eventuelles sources.
       * Largeur maximale limitee pour la lisibilite.
       * ================================================================ */}
      <div
        className={cn(
          "flex flex-col",
          "max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]"
        )}
      >
        {/* ---- Bulle de texte ---- */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser ? "rounded-br-md" : "rounded-bl-md"
          )}
          style={
            isUser
              ? {
                  /* Message utilisateur : gradient bleu, texte blanc */
                  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%)",
                  color: "var(--color-text-on-primary)",
                  boxShadow: "0 2px 8px rgb(37 99 235 / 0.2)",
                }
              : {
                  /* Message assistant : fond blanc, texte sombre, bordure subtile */
                  backgroundColor: "var(--color-bg-card)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                }
          }
        >
          {/* Contenu : texte ou animation de chargement */}
          {isLoading ? (
            /* Animation de chargement : trois points qui pulsent */
            <div className="flex items-center gap-1.5 py-1" aria-label="Chargement de la reponse">
              <span
                className="loading-dot h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--color-text-muted)" }}
              />
              <span
                className="loading-dot h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--color-text-muted)" }}
              />
              <span
                className="loading-dot h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--color-text-muted)" }}
              />
            </div>
          ) : (
            /* Texte du message avec gestion des sauts de ligne */
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>

        {/* ================================================================
         * SECTION SOURCES — Uniquement pour les messages assistant avec sources
         *
         * Affiche les extraits de discours cites en reference sous la bulle,
         * sous forme de cartes cliquables (SourceCard) menant aux videos.
         * ================================================================ */}
        {!isUser && !isLoading && message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-2">
            {/* Titre de la section sources */}
            <p
              className="text-xs font-medium ml-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Sources ({message.sources.length})
            </p>

            {/* Grille de cartes sources : 1 colonne mobile, 2 colonnes desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((excerpt) => (
                <SourceCard key={excerpt.id} excerpt={excerpt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

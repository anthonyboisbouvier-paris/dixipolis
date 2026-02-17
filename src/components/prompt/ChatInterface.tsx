/* =============================================================================
 * components/prompt/ChatInterface.tsx
 *
 * Composant principal de l'interface de chat premium Dixipolis.
 *
 * Ce composant orchestre l'integralite de l'experience conversationnelle,
 * inspiree des meilleures interfaces (ChatGPT, Perplexity, Claude.ai) :
 *
 *   ETAT VIDE (aucun message) :
 *     - Logo Dixipolis anime au centre avec gradient
 *     - Titre "Interrogez la base politique"
 *     - Grille 2x3 de suggestions cliquables avec effets de survol premium
 *     - Barre de saisie en bas avec effet glass
 *
 *   ETAT CONVERSATION (messages presents) :
 *     - Zone scrollable de messages avec auto-scroll fluide
 *     - Indicateur de frappe (3 points pulses) pendant la generation
 *     - Reponse mock apres 1.5s avec sources video horodatees
 *     - Barre de saisie fixee en bas
 *
 * Architecture du layout :
 *   - Flexbox vertical occupant 100% de la hauteur parent
 *   - Zone messages : flex-1 avec overflow-y-auto
 *   - Barre de saisie : shrink-0 fixee en bas
 *
 * Regles de style :
 *   - Pas de couleurs Tailwind brutes : toujours var(--color-*)
 *   - Pas de pt-offset : le root layout gere deja le padding du header
 *   - Classes CSS globales : .glass, .animate-fade-in-up, .stagger-children
 *   - Bouton d'envoi : cercle bleu avec icone ArrowUp (actif quand texte)
 *
 * En production, les reponses mock seront remplacees par le pipeline RAG
 * (Retrieval-Augmented Generation) via l'API backend.
 * ============================================================================= */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import type { ChatMessage, SpeechExcerpt } from "@/types";
import { SEARCH_SUGGESTIONS } from "@/lib/constants";
import { ArrowUp, Sparkles } from "lucide-react";
import MessageBubble from "@/components/prompt/MessageBubble";

/* --------------------------------------------------------------------------
 * ICONES DE SUGGESTION
 *
 * Chaque puce de suggestion affiche une petite icone decorative a gauche.
 * On utilise des emojis thematiques pour eviter d'importer des icones
 * supplementaires tout en restant visuellement expressif.
 * -------------------------------------------------------------------------- */
const SUGGESTION_ICONS = [
  "\u{1F4CA}", /* graphique a barres   */
  "\u{1F5F3}", /* urne electorale      */
  "\u{2696}",  /* balance de justice   */
  "\u{1F30D}", /* globe terrestre      */
  "\u{1F393}", /* chapeau diplome      */
  "\u{1F4DC}", /* parchemin            */
];

/* --------------------------------------------------------------------------
 * DONNEES MOCK — Reponses simulees de l'assistant
 *
 * Chaque entree mappe un ensemble de mots-cles a une reponse texte
 * accompagnee de sources (SpeechExcerpt). En production, ces donnees
 * proviendront du pipeline RAG (Retrieval-Augmented Generation).
 * -------------------------------------------------------------------------- */
interface MockResponse {
  /** Mots-cles declencheurs (en minuscules) */
  keywords: string[];
  /** Texte de la reponse de l'assistant */
  response: string;
  /** Sources citees dans la reponse */
  sources: SpeechExcerpt[];
}

const MOCK_RESPONSES: MockResponse[] = [
  {
    keywords: ["macron", "inflation", "prix", "pouvoir d'achat"],
    response:
      "D'apr\u00e8s les discours index\u00e9s, Emmanuel Macron a abord\u00e9 la question de l'inflation \u00e0 plusieurs reprises en 2024. Il a notamment soulign\u00e9 la n\u00e9cessit\u00e9 de prot\u00e9ger le pouvoir d'achat des Fran\u00e7ais tout en maintenant une politique de ma\u00eetrise des d\u00e9penses publiques.\n\nLors de son allocution du 14 juillet, il a \u00e9voqu\u00e9 des mesures de soutien cibl\u00e9es pour les m\u00e9nages les plus modestes. Voici les extraits les plus pertinents :",
    sources: [
      {
        id: "src-1", politicianId: "1", politicianName: "Emmanuel Macron", party: "RE",
        text: "Nous devons prot\u00e9ger nos concitoyens face \u00e0 la hausse des prix tout en gardant le cap de la responsabilit\u00e9 budg\u00e9taire.",
        date: "2024-07-14T20:00:00Z", videoUrl: "https://www.youtube.com/watch?v=example1&t=342",
        videoTitle: "Allocution du 14 juillet 2024 \u2014 Interview t\u00e9l\u00e9vis\u00e9e",
        channelName: "France 2", startTime: 342, endTime: 398, theme: "\u00c9conomie", relevanceScore: 0.95,
      },
      {
        id: "src-2", politicianId: "1", politicianName: "Emmanuel Macron", party: "RE",
        text: "Le ch\u00e8que \u00e9nergie sera renforc\u00e9 pour les 5 millions de foyers les plus fragiles.",
        date: "2024-09-20T10:00:00Z", videoUrl: "https://www.youtube.com/watch?v=example2&t=128",
        videoTitle: "Conf\u00e9rence de presse \u00e0 l'\u00c9lys\u00e9e \u2014 Rentr\u00e9e 2024",
        channelName: "BFMTV", startTime: 128, endTime: 185, theme: "\u00c9conomie", relevanceScore: 0.91,
      },
    ],
  },
  {
    keywords: ["le pen", "immigration", "rn"],
    response:
      "Marine Le Pen a fait de l'immigration l'un de ses th\u00e8mes centraux lors de la session parlementaire 2024. Elle a d\u00e9fendu un durcissement significatif de la politique migratoire, en plaidant pour une r\u00e9forme constitutionnelle et la mise en place de quotas stricts.\n\nVoici les extraits les plus significatifs de ses prises de parole :",
    sources: [
      {
        id: "src-3", politicianId: "2", politicianName: "Marine Le Pen", party: "RN",
        text: "La France doit reprendre le contr\u00f4le de sa politique migratoire. C'est une question de souverainet\u00e9 nationale.",
        date: "2024-11-15T15:30:00Z", videoUrl: "https://www.youtube.com/watch?v=example3&t=256",
        videoTitle: "D\u00e9bat \u00e0 l'Assembl\u00e9e nationale \u2014 Projet de loi immigration",
        channelName: "LCP", startTime: 256, endTime: 312, theme: "Immigration", relevanceScore: 0.97,
      },
      {
        id: "src-4", politicianId: "2", politicianName: "Marine Le Pen", party: "RN",
        text: "Nous proposons l'instauration de quotas migratoires vot\u00e9s chaque ann\u00e9e par le Parlement.",
        date: "2024-10-03T09:00:00Z", videoUrl: "https://www.youtube.com/watch?v=example4&t=87",
        videoTitle: "Interview matinale \u2014 RTL Matin",
        channelName: "RTL", startTime: 87, endTime: 142, theme: "Immigration", relevanceScore: 0.93,
      },
    ],
  },
  {
    keywords: ["melenchon", "ecologie", "climat", "environnement"],
    response:
      "Jean-Luc M\u00e9lenchon a r\u00e9guli\u00e8rement pris position sur les enjeux \u00e9cologiques, liant syst\u00e9matiquement la question climatique \u00e0 la justice sociale. Il d\u00e9fend une planification \u00e9cologique fond\u00e9e sur la bifurcation du mod\u00e8le productif et la sortie des \u00e9nergies fossiles.\n\nVoici les passages les plus marquants :",
    sources: [
      {
        id: "src-5", politicianId: "3", politicianName: "Jean-Luc M\u00e9lenchon", party: "LFI",
        text: "L'\u00e9cologie populaire, c'est l'id\u00e9e que la transition ne doit pas se faire sur le dos des classes populaires.",
        date: "2024-06-05T14:00:00Z", videoUrl: "https://www.youtube.com/watch?v=example5&t=415",
        videoTitle: "Meeting pour la planification \u00e9cologique \u2014 Marseille",
        channelName: "La France Insoumise", startTime: 415, endTime: 470, theme: "\u00c9cologie", relevanceScore: 0.94,
      },
      {
        id: "src-6", politicianId: "3", politicianName: "Jean-Luc M\u00e9lenchon", party: "LFI",
        text: "Il faut sortir des \u00e9nergies fossiles d'ici 2045 et investir massivement dans les renouvelables.",
        date: "2024-09-12T16:00:00Z", videoUrl: "https://www.youtube.com/watch?v=example6&t=203",
        videoTitle: "Question au gouvernement \u2014 Transition \u00e9nerg\u00e9tique",
        channelName: "LCP", startTime: 203, endTime: 258, theme: "\u00c9cologie", relevanceScore: 0.89,
      },
    ],
  },
  {
    keywords: ["bardella", "europe", "ue"],
    response:
      "Jordan Bardella a port\u00e9 une vision critique de l'Union europ\u00e9enne, plaidant pour une Europe des nations o\u00f9 chaque pays conserve sa souverainet\u00e9. Au Parlement europ\u00e9en, il a contest\u00e9 plusieurs directives qu'il juge contraires aux int\u00e9r\u00eats fran\u00e7ais.\n\nVoici ses d\u00e9clarations les plus notables :",
    sources: [
      {
        id: "src-7", politicianId: "4", politicianName: "Jordan Bardella", party: "RN",
        text: "Nous voulons une Europe des nations libres, pas un super-\u00c9tat qui d\u00e9cide \u00e0 la place des peuples.",
        date: "2024-05-28T10:00:00Z", videoUrl: "https://www.youtube.com/watch?v=example7&t=178",
        videoTitle: "Grand meeting europ\u00e9ennes 2024 \u2014 Paris",
        channelName: "RN Officiel", startTime: 178, endTime: 235, theme: "Europe", relevanceScore: 0.92,
      },
    ],
  },
  {
    keywords: ["attal", "education", "ecole"],
    response:
      "Gabriel Attal a plac\u00e9 l'\u00e9ducation au c\u0153ur de son action en tant que Premier ministre. Il a notamment annonc\u00e9 le retour des groupes de niveau au coll\u00e8ge et le renforcement de l'autorit\u00e9 des enseignants.\n\nSon passage au minist\u00e8re de l'\u00c9ducation avait d\u00e9j\u00e0 \u00e9t\u00e9 marqu\u00e9 par des r\u00e9formes structurantes. Voici les extraits pertinents :",
    sources: [
      {
        id: "src-8", politicianId: "5", politicianName: "Gabriel Attal", party: "RE",
        text: "Le niveau scolaire de nos \u00e9l\u00e8ves doit redevenir une priorit\u00e9 absolue. C'est l'avenir de la Nation qui est en jeu.",
        date: "2024-01-30T11:00:00Z", videoUrl: "https://www.youtube.com/watch?v=example8&t=95",
        videoTitle: "Discours de politique g\u00e9n\u00e9rale \u2014 Assembl\u00e9e nationale",
        channelName: "LCP", startTime: 95, endTime: 152, theme: "\u00c9ducation", relevanceScore: 0.96,
      },
      {
        id: "src-9", politicianId: "5", politicianName: "Gabriel Attal", party: "RE",
        text: "Les groupes de niveau permettront de mieux accompagner chaque \u00e9l\u00e8ve selon ses besoins.",
        date: "2024-03-18T09:30:00Z", videoUrl: "https://www.youtube.com/watch?v=example9&t=312",
        videoTitle: "Conf\u00e9rence de presse \u2014 R\u00e9forme du coll\u00e8ge",
        channelName: "France Info", startTime: 312, endTime: 365, theme: "\u00c9ducation", relevanceScore: 0.88,
      },
    ],
  },
];

/* --------------------------------------------------------------------------
 * Reponse par defaut — utilisee quand aucun mot-cle ne matche la requete.
 * -------------------------------------------------------------------------- */
const DEFAULT_MOCK_RESPONSE: MockResponse = {
  keywords: [],
  response:
    "Voici ce que j'ai trouv\u00e9 dans la base de donn\u00e9es Dixipolis. Plusieurs politiciens se sont exprim\u00e9s sur ce sujet au cours des derniers mois. L'analyse crois\u00e9e de leurs d\u00e9clarations r\u00e9v\u00e8le des positions contrast\u00e9es selon les familles politiques.\n\nVoici les extraits les plus pertinents :",
  sources: [
    {
      id: "src-default-1", politicianId: "1", politicianName: "Emmanuel Macron", party: "RE",
      text: "La France doit continuer \u00e0 se r\u00e9former pour rester comp\u00e9titive dans un monde en mutation.",
      date: "2024-12-10T20:00:00Z", videoUrl: "https://www.youtube.com/watch?v=default1&t=450",
      videoTitle: "V\u0153ux aux Fran\u00e7ais \u2014 D\u00e9cembre 2024",
      channelName: "France 2", startTime: 450, endTime: 510, theme: "R\u00e9formes", relevanceScore: 0.82,
    },
    {
      id: "src-default-2", politicianId: "3", politicianName: "Jean-Luc M\u00e9lenchon", party: "LFI",
      text: "Il est temps de rompre avec les politiques d'aust\u00e9rit\u00e9 qui appauvrissent les Fran\u00e7ais.",
      date: "2024-11-22T14:00:00Z", videoUrl: "https://www.youtube.com/watch?v=default2&t=267",
      videoTitle: "Questions d'actualit\u00e9 au gouvernement",
      channelName: "LCP", startTime: 267, endTime: 320, theme: "\u00c9conomie", relevanceScore: 0.78,
    },
  ],
};

/* --------------------------------------------------------------------------
 * findMockResponse — Recherche la reponse mock correspondant a la requete.
 * Parcourt les mots-cles et retourne la premiere correspondance, ou la
 * reponse par defaut si aucun mot-cle ne matche.
 * -------------------------------------------------------------------------- */
function findMockResponse(query: string): MockResponse {
  const lowerQuery = query.toLowerCase();
  const matched = MOCK_RESPONSES.find((mock) =>
    mock.keywords.some((keyword) => lowerQuery.includes(keyword))
  );
  return matched ?? DEFAULT_MOCK_RESPONSE;
}

/* ==========================================================================
 * COMPOSANT PRINCIPAL — ChatInterface
 *
 * Layout vertical plein ecran :
 *   <div flex-col h-full>            -- Conteneur principal
 *     <div flex-1 overflow-y-auto>   -- Zone scrollable (bienvenue ou messages)
 *     <div shrink-0 glass>           -- Barre de saisie en bas
 *   </div>
 * ========================================================================== */
export default function ChatInterface() {
  /* ------------------------------------------------------------------
   * ETAT LOCAL
   * ------------------------------------------------------------------ */

  /** Liste complete des messages de la conversation */
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  /** Valeur courante du champ de saisie */
  const [inputValue, setInputValue] = useState("");

  /** True quand l'assistant "reflechit" (animation de chargement) */
  const [isGenerating, setIsGenerating] = useState(false);

  /* ------------------------------------------------------------------
   * REFS
   * ------------------------------------------------------------------ */

  /** Ancre invisible en fin de liste pour l'auto-scroll */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** Champ de saisie pour l'auto-focus */
  const inputRef = useRef<HTMLInputElement>(null);

  /** Conteneur scrollable des messages */
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------
   * EFFETS
   * ------------------------------------------------------------------ */

  /**
   * Auto-scroll fluide vers le dernier message a chaque mise a jour.
   * requestAnimationFrame garantit que le DOM est a jour avant le scroll.
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  /** Auto-focus sur le champ de saisie au montage du composant */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ------------------------------------------------------------------
   * HANDLERS
   * ------------------------------------------------------------------ */

  /**
   * handleSendMessage — Envoie un message et genere une reponse mock.
   *
   * Flux complet :
   *   1. Creer le message utilisateur et l'ajouter a la conversation
   *   2. Creer un placeholder "loading" pour l'assistant (3 dots)
   *   3. Apres 1500ms, remplacer le loading par la vraie reponse mock
   *   4. Re-focus le champ de saisie
   */
  const handleSendMessage = useCallback(
    (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText || isGenerating) return;

      /* 1. Message utilisateur */
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: trimmedText,
        timestamp: new Date().toISOString(),
      };

      /* 2. Message assistant en chargement */
      const loadingMessageId = generateId();
      const loadingMessage: ChatMessage = {
        id: loadingMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setInputValue("");
      setIsGenerating(true);

      /* 3. Simulation du delai IA (1.5 secondes) */
      setTimeout(() => {
        const mockData = findMockResponse(trimmedText);

        const assistantMessage: ChatMessage = {
          id: loadingMessageId,
          role: "assistant",
          content: mockData.response,
          timestamp: new Date().toISOString(),
          sources: mockData.sources,
          isLoading: false,
        };

        /* Remplacement du placeholder loading par la reponse finale */
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessageId ? assistantMessage : msg
          )
        );
        setIsGenerating(false);

        /* 4. Re-focus apres la reponse */
        inputRef.current?.focus();
      }, 1500);
    },
    [isGenerating]
  );

  /** Touche Entree => envoi du message */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  /** Clic sur une suggestion => envoi immediat */
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  /* ------------------------------------------------------------------
   * DERIVES
   * ------------------------------------------------------------------ */

  /** True si la conversation est vide => ecran de bienvenue */
  const isConversationEmpty = messages.length === 0;

  /** True si le bouton d'envoi doit etre actif */
  const isSendActive = inputValue.trim().length > 0 && !isGenerating;

  /* ------------------------------------------------------------------
   * RENDU
   * ------------------------------------------------------------------ */
  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* ================================================================
       * ZONE SCROLLABLE — Messages ou ecran de bienvenue
       *
       * flex-1 : occupe tout l'espace restant
       * overflow-y-auto : scroll vertical si le contenu depasse
       * ================================================================ */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {isConversationEmpty ? (
          /* ============================================================
           * ETAT DE BIENVENUE — Ecran d'accueil centre premium
           *
           * Logo avec gradient, titre, sous-titre, grille 2x3 de
           * suggestions avec animations stagger et effets de survol.
           * ============================================================ */
          <div className="flex flex-col items-center justify-center h-full px-4 py-8">
            <div className="flex flex-col items-center max-w-2xl w-full animate-fade-in-up">

              {/* ---- Logo Dixipolis avec gradient primaire->accent ---- */}
              <div
                className="flex items-center justify-center rounded-2xl mb-8"
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
                  boxShadow: "var(--shadow-lg), 0 0 40px rgb(37 99 235 / 0.2)",
                }}
              >
                <Sparkles
                  className="h-8 w-8"
                  style={{ color: "var(--color-text-on-primary)" }}
                />
              </div>

              {/* ---- Titre principal ---- */}
              <h1
                className="text-2xl sm:text-3xl font-bold text-center mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                Interrogez la base politique
              </h1>

              {/* ---- Sous-titre descriptif ---- */}
              <p
                className="text-center max-w-md mb-10 text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Posez une question sur les discours et prises de position
                des politiciens fran&ccedil;ais. Dixipolis retrouve les verbatims
                exacts avec sources vid&eacute;o horodat&eacute;es.
              </p>

              {/* ---- Grille de suggestions (2 colonnes, 3 lignes) ---- */}
              <div className="w-full max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 stagger-children">
                  {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "group text-left px-4 py-3.5 rounded-[var(--radius-lg)]",
                        "border",
                        "transition-all duration-[var(--transition-normal)]",
                        "focus-visible:ring-2 focus-visible:ring-offset-2",
                        "cursor-pointer"
                      )}
                      style={{
                        backgroundColor: "var(--color-bg-card)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-secondary)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = "var(--color-primary-200)";
                        el.style.backgroundColor = "var(--color-primary-50)";
                        el.style.color = "var(--color-primary)";
                        el.style.boxShadow = "var(--shadow-md)";
                        el.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = "var(--color-border)";
                        el.style.backgroundColor = "var(--color-bg-card)";
                        el.style.color = "var(--color-text-secondary)";
                        el.style.boxShadow = "none";
                        el.style.transform = "translateY(0)";
                      }}
                    >
                      <span className="flex items-start gap-3">
                        <span
                          className="text-base mt-0.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        >
                          {SUGGESTION_ICONS[index % SUGGESTION_ICONS.length]}
                        </span>
                        <span className="text-sm leading-snug line-clamp-2">
                          {suggestion}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
           * LISTE DES MESSAGES
           *
           * Chaque message est rendu par MessageBubble.
           * Un div invisible sert d'ancre pour l'auto-scroll.
           * ============================================================ */
          <div className="mx-auto max-w-3xl px-4 py-6">
            <div className="space-y-5">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} aria-hidden="true" />
            </div>
          </div>
        )}
      </div>

      {/* ================================================================
       * BARRE DE SAISIE — Fixee en bas, effet glassmorphism
       *
       * Structure :
       *   - Conteneur glass avec backdrop-blur
       *   - Input texte transparent avec placeholder
       *   - Bouton d'envoi circulaire (bleu quand actif, gris sinon)
       *   - Mention legale en-dessous
       * ================================================================ */}
      <div
        className="shrink-0"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="glass">
          <div className="mx-auto max-w-3xl px-4 py-3">

            {/* ---- Conteneur du champ de saisie arrondi ---- */}
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3",
                "transition-all duration-[var(--transition-fast)]"
              )}
              style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
              onFocus={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--color-primary)";
                el.style.boxShadow = "var(--shadow-md), 0 0 0 3px rgb(37 99 235 / 0.08)";
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  const el = e.currentTarget;
                  el.style.borderColor = "var(--color-border)";
                  el.style.boxShadow = "var(--shadow-sm)";
                }
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question sur le discours politique..."
                disabled={isGenerating}
                className="flex-1 bg-transparent border-none outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: "var(--color-text-primary)" }}
                aria-label="Champ de saisie de votre question"
              />

              {/* ---- Bouton d'envoi circulaire (style ChatGPT) ---- */}
              <button
                type="button"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!isSendActive}
                className={cn(
                  "flex items-center justify-center shrink-0 rounded-full",
                  "transition-all duration-[var(--transition-fast)]",
                  "focus-visible:ring-2 focus-visible:ring-offset-2"
                )}
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: isSendActive
                    ? "var(--color-primary)"
                    : "var(--color-bg-section)",
                  color: isSendActive
                    ? "var(--color-text-on-primary)"
                    : "var(--color-text-muted)",
                  cursor: isSendActive ? "pointer" : "not-allowed",
                  boxShadow: isSendActive
                    ? "0 2px 8px rgb(37 99 235 / 0.3)"
                    : "none",
                  transform: isSendActive ? "scale(1)" : "scale(0.95)",
                }}
                aria-label="Envoyer le message"
              >
                {isGenerating ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="3"
                      strokeLinecap="round" className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor" strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* ---- Mention legale sous le champ de saisie ---- */}
            <p
              className="text-center mt-2.5 text-[11px] leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Dixipolis analyse les discours publics. Les r&eacute;ponses sont g&eacute;n&eacute;r&eacute;es
              par IA et doivent &ecirc;tre v&eacute;rifi&eacute;es. Sources vid&eacute;o horodat&eacute;es fournies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

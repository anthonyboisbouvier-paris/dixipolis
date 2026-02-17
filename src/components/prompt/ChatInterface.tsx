/* =============================================================================
 * components/prompt/ChatInterface.tsx
 *
 * Composant principal de l'interface de chat Dixipolis (page Prompt).
 *
 * Ce composant orchestre l'ensemble de l'experience conversationnelle :
 *   - Etat de bienvenue : logo Dixipolis, titre, et puces de suggestions
 *   - Liste scrollable des messages (utilisateur + assistant)
 *   - Barre de saisie fixee en bas avec champ texte et bouton d'envoi
 *   - Simulation de reponse : delai de 1.5s puis reponse mock avec sources
 *   - Auto-scroll vers le dernier message
 *   - Auto-focus sur le champ de saisie
 *
 * Architecture :
 *   ChatInterface
 *     |-- Etat de bienvenue (quand aucun message)
 *     |     |-- Logo + titre + description
 *     |     |-- Puces de suggestions (SEARCH_SUGGESTIONS)
 *     |-- Liste des messages
 *     |     |-- MessageBubble (pour chaque message)
 *     |-- Barre de saisie
 *           |-- Input texte + bouton Send
 *
 * Donnees mock :
 *   Les reponses de l'assistant sont simulees avec des extraits de discours
 *   realistes correspondant au contexte politique francais. En production,
 *   ces reponses seront generees par le back-end IA + RAG.
 *
 * Utilisation :
 *   <ChatInterface />
 * ============================================================================= */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import type { ChatMessage, SpeechExcerpt } from "@/types";
import { SEARCH_SUGGESTIONS } from "@/lib/constants";
import { Send, Loader2, Sparkles, MessageSquare, Search } from "lucide-react";
import MessageBubble from "@/components/prompt/MessageBubble";

/* --------------------------------------------------------------------------
 * DONNEES MOCK — Reponses simulees de l'assistant
 *
 * Chaque entree associe un pattern de mots-cles a une reponse texte et
 * une liste de sources (SpeechExcerpt). En production, ces donnees
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
      "D'apres les discours indexes, Emmanuel Macron a aborde la question de l'inflation a plusieurs reprises en 2024. Il a notamment souligne la necessite de proteger le pouvoir d'achat des Francais tout en maintenant une politique de maitrise des depenses publiques. Lors de son allocution du 14 juillet, il a evoque des mesures de soutien ciblees pour les menages les plus modestes. Voici les extraits les plus pertinents :",
    sources: [
      {
        id: "src-1",
        politicianId: "1",
        politicianName: "Emmanuel Macron",
        party: "RE",
        text: "Nous devons proteger nos concitoyens face a la hausse des prix tout en gardant le cap de la responsabilite budgetaire.",
        date: "2024-07-14T20:00:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example1&t=342",
        videoTitle: "Allocution du 14 juillet 2024 — Interview televisee",
        channelName: "France 2",
        startTime: 342,
        endTime: 398,
        theme: "Economie",
        relevanceScore: 0.95,
      },
      {
        id: "src-2",
        politicianId: "1",
        politicianName: "Emmanuel Macron",
        party: "RE",
        text: "Le cheque energie sera renforce pour les 5 millions de foyers les plus fragiles.",
        date: "2024-09-20T10:00:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example2&t=128",
        videoTitle: "Conference de presse a l'Elysee — Rentree 2024",
        channelName: "BFMTV",
        startTime: 128,
        endTime: 185,
        theme: "Economie",
        relevanceScore: 0.91,
      },
    ],
  },
  {
    keywords: ["le pen", "immigration", "rn"],
    response:
      "Marine Le Pen a fait de l'immigration l'un de ses themes centraux lors de la session parlementaire 2024. Elle a defendu un durcissement significatif de la politique migratoire, en plaidant pour une reforme constitutionnelle et la mise en place de quotas stricts. Voici les extraits les plus significatifs de ses prises de parole :",
    sources: [
      {
        id: "src-3",
        politicianId: "2",
        politicianName: "Marine Le Pen",
        party: "RN",
        text: "La France doit reprendre le controle de sa politique migratoire. C'est une question de souverainete nationale.",
        date: "2024-11-15T15:30:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example3&t=256",
        videoTitle: "Debat a l'Assemblee nationale — Projet de loi immigration",
        channelName: "LCP",
        startTime: 256,
        endTime: 312,
        theme: "Immigration",
        relevanceScore: 0.97,
      },
      {
        id: "src-4",
        politicianId: "2",
        politicianName: "Marine Le Pen",
        party: "RN",
        text: "Nous proposons l'instauration de quotas migratoires votes chaque annee par le Parlement.",
        date: "2024-10-03T09:00:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example4&t=87",
        videoTitle: "Interview matinale — RTL Matin",
        channelName: "RTL",
        startTime: 87,
        endTime: 142,
        theme: "Immigration",
        relevanceScore: 0.93,
      },
    ],
  },
  {
    keywords: ["melenchon", "ecologie", "climat", "environnement"],
    response:
      "Jean-Luc Melenchon a regulierement pris position sur les enjeux ecologiques, liant systematiquement la question climatique a la justice sociale. Il defend une planification ecologique fondee sur la bifurcation du modele productif et la sortie des energies fossiles. Voici les passages les plus marquants :",
    sources: [
      {
        id: "src-5",
        politicianId: "3",
        politicianName: "Jean-Luc Melenchon",
        party: "LFI",
        text: "L'ecologie populaire, c'est l'idee que la transition ne doit pas se faire sur le dos des classes populaires.",
        date: "2024-06-05T14:00:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example5&t=415",
        videoTitle: "Meeting pour la planification ecologique — Marseille",
        channelName: "La France Insoumise",
        startTime: 415,
        endTime: 470,
        theme: "Ecologie",
        relevanceScore: 0.94,
      },
      {
        id: "src-6",
        politicianId: "3",
        politicianName: "Jean-Luc Melenchon",
        party: "LFI",
        text: "Il faut sortir des energies fossiles d'ici 2045 et investir massivement dans les renouvelables.",
        date: "2024-09-12T16:00:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example6&t=203",
        videoTitle: "Question au gouvernement — Transition energetique",
        channelName: "LCP",
        startTime: 203,
        endTime: 258,
        theme: "Ecologie",
        relevanceScore: 0.89,
      },
    ],
  },
  {
    keywords: ["bardella", "europe", "ue"],
    response:
      "Jordan Bardella a porte une vision critique de l'Union europeenne, plaidant pour une Europe des nations ou chaque pays conserve sa souverainete. Au Parlement europeen, il a conteste plusieurs directives qu'il juge contraires aux interets francais. Voici ses declarations les plus notables :",
    sources: [
      {
        id: "src-7",
        politicianId: "4",
        politicianName: "Jordan Bardella",
        party: "RN",
        text: "Nous voulons une Europe des nations libres, pas un super-Etat qui decide a la place des peuples.",
        date: "2024-05-28T10:00:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example7&t=178",
        videoTitle: "Grand meeting europeennes 2024 — Paris",
        channelName: "RN Officiel",
        startTime: 178,
        endTime: 235,
        theme: "Europe",
        relevanceScore: 0.92,
      },
    ],
  },
  {
    keywords: ["attal", "education", "ecole"],
    response:
      "Gabriel Attal a place l'education au coeur de son action en tant que Premier ministre. Il a notamment annonce le retour des groupes de niveau au college et le renforcement de l'autorite des enseignants. Son passage au ministere de l'Education avait deja ete marque par des reformes structurantes. Voici les extraits pertinents :",
    sources: [
      {
        id: "src-8",
        politicianId: "5",
        politicianName: "Gabriel Attal",
        party: "RE",
        text: "Le niveau scolaire de nos eleves doit redevenir une priorite absolue. C'est l'avenir de la Nation qui est en jeu.",
        date: "2024-01-30T11:00:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example8&t=95",
        videoTitle: "Discours de politique generale — Assemblee nationale",
        channelName: "LCP",
        startTime: 95,
        endTime: 152,
        theme: "Education",
        relevanceScore: 0.96,
      },
      {
        id: "src-9",
        politicianId: "5",
        politicianName: "Gabriel Attal",
        party: "RE",
        text: "Les groupes de niveau permettront de mieux accompagner chaque eleve selon ses besoins.",
        date: "2024-03-18T09:30:00Z",
        videoUrl: "https://www.youtube.com/watch?v=example9&t=312",
        videoTitle: "Conference de presse — Reforme du college",
        channelName: "France Info",
        startTime: 312,
        endTime: 365,
        theme: "Education",
        relevanceScore: 0.88,
      },
    ],
  },
];

/* --------------------------------------------------------------------------
 * Reponse par defaut utilisee quand aucun mot-cle ne correspond a la requete.
 * Simule une reponse generique avec une source variee.
 * -------------------------------------------------------------------------- */
const DEFAULT_MOCK_RESPONSE: MockResponse = {
  keywords: [],
  response:
    "Voici ce que j'ai trouve dans la base de donnees Dixipolis. Plusieurs politiciens se sont exprimes sur ce sujet au cours des derniers mois. L'analyse croisee de leurs declarations revele des positions contrastees selon les familles politiques. Voici les extraits les plus pertinents :",
  sources: [
    {
      id: "src-default-1",
      politicianId: "1",
      politicianName: "Emmanuel Macron",
      party: "RE",
      text: "La France doit continuer a se reformer pour rester competitive dans un monde en mutation.",
      date: "2024-12-10T20:00:00Z",
      videoUrl: "https://www.youtube.com/watch?v=default1&t=450",
      videoTitle: "Voeux aux Francais — Decembre 2024",
      channelName: "France 2",
      startTime: 450,
      endTime: 510,
      theme: "Reformes",
      relevanceScore: 0.82,
    },
    {
      id: "src-default-2",
      politicianId: "3",
      politicianName: "Jean-Luc Melenchon",
      party: "LFI",
      text: "Il est temps de rompre avec les politiques d'austerite qui appauvrissent les Francais.",
      date: "2024-11-22T14:00:00Z",
      videoUrl: "https://www.youtube.com/watch?v=default2&t=267",
      videoTitle: "Questions d'actualite au gouvernement",
      channelName: "LCP",
      startTime: 267,
      endTime: 320,
      theme: "Economie",
      relevanceScore: 0.78,
    },
  ],
};

/* --------------------------------------------------------------------------
 * findMockResponse — Recherche la reponse mock correspondant a la requete.
 *
 * Parcourt les mots-cles de chaque reponse mock et retourne la premiere
 * qui contient au moins un mot-cle present dans la requete de l'utilisateur.
 * Retourne la reponse par defaut si aucune correspondance n'est trouvee.
 *
 * @param query - La requete de l'utilisateur (texte brut)
 * @returns La reponse mock correspondante
 * -------------------------------------------------------------------------- */
function findMockResponse(query: string): MockResponse {
  /* Conversion en minuscules pour une comparaison insensible a la casse */
  const lowerQuery = query.toLowerCase();

  /* Recherche du premier ensemble de mots-cles qui matche */
  const matched = MOCK_RESPONSES.find((mock) =>
    mock.keywords.some((keyword) => lowerQuery.includes(keyword))
  );

  return matched ?? DEFAULT_MOCK_RESPONSE;
}

/* ==========================================================================
 * COMPOSANT PRINCIPAL — ChatInterface
 * ========================================================================== */
export default function ChatInterface() {
  /* ------------------------------------------------------------------
   * ETAT LOCAL
   * ------------------------------------------------------------------ */

  /** Liste des messages de la conversation */
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  /** Contenu actuel du champ de saisie */
  const [inputValue, setInputValue] = useState("");

  /** Indicateur de chargement (reponse en cours de generation) */
  const [isGenerating, setIsGenerating] = useState(false);

  /* ------------------------------------------------------------------
   * REFS
   * ------------------------------------------------------------------ */

  /** Reference vers le conteneur scrollable des messages */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /** Reference vers le champ de saisie pour l'auto-focus */
  const inputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------------
   * EFFETS
   * ------------------------------------------------------------------ */

  /**
   * Auto-scroll vers le bas a chaque nouveau message.
   * Utilise un comportement de defilement fluide pour une UX agreable.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Auto-focus sur le champ de saisie au montage du composant.
   * Permet a l'utilisateur de commencer a taper immediatement.
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ------------------------------------------------------------------
   * HANDLERS
   * ------------------------------------------------------------------ */

  /**
   * handleSendMessage — Envoie un message et genere une reponse mock.
   *
   * Flux :
   *   1. Ajoute le message utilisateur a la conversation
   *   2. Ajoute un message assistant en etat "loading"
   *   3. Apres 1.5s, remplace le message loading par la reponse mock
   *   4. Re-focus le champ de saisie
   *
   * @param text - Le texte du message (depuis l'input ou une suggestion)
   */
  const handleSendMessage = useCallback(
    (text: string) => {
      /* Ignore les messages vides */
      const trimmedText = text.trim();
      if (!trimmedText || isGenerating) return;

      /* -- 1. Creer le message utilisateur -- */
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: trimmedText,
        timestamp: new Date().toISOString(),
      };

      /* -- 2. Creer le message assistant en chargement -- */
      const loadingMessageId = generateId();
      const loadingMessage: ChatMessage = {
        id: loadingMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isLoading: true,
      };

      /* Mise a jour de l'etat : ajout des deux messages */
      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setInputValue("");
      setIsGenerating(true);

      /* -- 3. Simuler un delai de reflexion (1.5 secondes) -- */
      setTimeout(() => {
        /* Trouver la reponse mock correspondante */
        const mockData = findMockResponse(trimmedText);

        /* Creer le message assistant final avec sources */
        const assistantMessage: ChatMessage = {
          id: loadingMessageId,
          role: "assistant",
          content: mockData.response,
          timestamp: new Date().toISOString(),
          sources: mockData.sources,
          isLoading: false,
        };

        /* Remplacer le message de chargement par la reponse finale */
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessageId ? assistantMessage : msg
          )
        );
        setIsGenerating(false);

        /* Re-focus le champ de saisie apres la reponse */
        inputRef.current?.focus();
      }, 1500);
    },
    [isGenerating]
  );

  /**
   * handleKeyDown — Gere l'envoi du message via la touche Entree.
   * Shift+Entree est reserve pour un eventuel mode multi-ligne futur.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  /**
   * handleSuggestionClick — Envoie une suggestion pre-definie comme message.
   * Declenchee quand l'utilisateur clique sur une puce de suggestion.
   */
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  /* ------------------------------------------------------------------
   * Determine si la conversation est vide (affiche l'ecran de bienvenue)
   * ------------------------------------------------------------------ */
  const isConversationEmpty = messages.length === 0;

  /* ------------------------------------------------------------------
   * RENDU
   * ------------------------------------------------------------------ */
  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-page)]">
      {/* ================================================================
       * ZONE DE MESSAGES (scrollable)
       *
       * Occupe tout l'espace disponible entre le header et la barre de saisie.
       * Affiche soit l'ecran de bienvenue, soit la liste des messages.
       * ================================================================ */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {isConversationEmpty ? (
            /* ==============================================================
             * ETAT DE BIENVENUE
             *
             * Affiché quand aucun message n'a encore ete envoye.
             * Contient le logo, un titre accrocheur, une description,
             * et des puces de suggestions cliquables.
             * ============================================================== */
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
              {/* Logo Dixipolis */}
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl",
                  "bg-[var(--color-primary)] text-white",
                  "shadow-[var(--shadow-lg)] mb-6"
                )}
              >
                <Sparkles className="h-8 w-8" />
              </div>

              {/* Titre principal */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] text-center mb-2">
                Interrogez la base de donnees politique
              </h1>

              {/* Description secondaire */}
              <p className="text-[var(--color-text-secondary)] text-center max-w-md mb-8 text-sm sm:text-base">
                Posez une question sur les discours, declarations et prises de
                position des politiciens francais. Dixipolis retrouve les
                verbatims exacts avec leurs sources video.
              </p>

              {/* Puces de suggestions */}
              <div className="w-full max-w-xl">
                <p className="text-xs font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5" />
                  Suggestions de recherche
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        /* Style de base : carte cliquable */
                        "text-left px-3.5 py-2.5 rounded-[var(--radius-md)]",
                        "bg-[var(--color-bg-card)] border border-[var(--color-border)]",
                        "text-sm text-[var(--color-text-secondary)]",

                        /* Transition et hover */
                        "transition-all duration-[var(--transition-fast)]",
                        "hover:border-[var(--color-primary)]/40",
                        "hover:bg-[var(--color-primary-50)]",
                        "hover:text-[var(--color-primary)]",
                        "hover:shadow-[var(--shadow-sm)]",

                        /* Focus visible pour l'accessibilite */
                        "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                      )}
                    >
                      <span className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 shrink-0 mt-0.5 opacity-50" />
                        <span className="line-clamp-2">{suggestion}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ==============================================================
             * LISTE DES MESSAGES
             *
             * Affiche chaque message de la conversation via MessageBubble.
             * Un div invisible en fin de liste sert d'ancre pour l'auto-scroll.
             * ============================================================== */
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {/* Ancre invisible pour le scroll automatique */}
              <div ref={messagesEndRef} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* ================================================================
       * BARRE DE SAISIE
       *
       * Fixee en bas de l'interface. Contient un champ texte et un bouton
       * d'envoi. Le bouton est desactive pendant la generation.
       * ================================================================ */}
      <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div
            className={cn(
              /* Conteneur du champ de saisie : style carte arrondie */
              "flex items-center gap-2 rounded-xl",
              "border border-[var(--color-border)] bg-[var(--color-bg-section)]",
              "px-4 py-2",
              "transition-colors duration-[var(--transition-fast)]",
              "focus-within:border-[var(--color-primary)]/50",
              "focus-within:ring-2 focus-within:ring-[var(--color-primary)]/10"
            )}
          >
            {/* Champ de saisie principal */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question sur le discours politique..."
              disabled={isGenerating}
              className={cn(
                /* Style du champ : transparent, sans bordure */
                "flex-1 bg-transparent border-none outline-none",
                "text-sm text-[var(--color-text-primary)]",
                "placeholder:text-[var(--color-text-muted)]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Champ de saisie de votre question"
            />

            {/* Bouton d'envoi */}
            <button
              type="button"
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isGenerating}
              className={cn(
                /* Style de base : bouton circulaire */
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                "transition-all duration-[var(--transition-fast)]",

                /* Etat actif : fond bleu, texte blanc */
                inputValue.trim() && !isGenerating
                  ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] cursor-pointer"
                  : "bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed",

                /* Focus visible */
                "focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              )}
              aria-label="Envoyer le message"
            >
              {isGenerating ? (
                /* Animation de chargement pendant la generation */
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                /* Icone d'envoi */
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mention legale sous le champ de saisie */}
          <p className="text-[11px] text-[var(--color-text-muted)] text-center mt-2">
            Dixipolis analyse les discours publics. Les reponses sont generees
            par IA et doivent etre verifiees. Sources video horodatees fournies.
          </p>
        </div>
      </div>
    </div>
  );
}

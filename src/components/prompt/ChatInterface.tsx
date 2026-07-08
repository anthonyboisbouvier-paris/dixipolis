/* =============================================================================
 * components/prompt/ChatInterface.tsx
 *
 * Interface de recherche conversationnelle Dixipolis — 100 % données réelles.
 *
 * Le composant appelle le route handler POST /api/recherche qui interroge la
 * base Supabase (recherche plein-texte, et synthèse IA si OPENAI_API_KEY est
 * configurée côté serveur). Aucune clé n'est manipulée ici.
 *
 *   ÉTAT VIDE (aucun échange) :
 *     - Logo Dixipolis, titre, sous-titre
 *     - 4 suggestions simples qui remplissent le champ de saisie
 *
 *   ÉTAT CONVERSATION :
 *     - Question de l'utilisateur (bulle à droite)
 *     - Réponse : synthèse de l'agent si disponible (avec citations [seg_id]),
 *       puis les sources réelles (extrait surligné, locuteur, chaîne, date,
 *       lien YouTube horodaté)
 *     - Bandeau explicatif en mode lexical (agent IA non configuré)
 *     - États de chargement et d'erreur réels
 *
 * Note sécurité : `headline` est du HTML généré par Postgres ts_headline
 * (balises <mark> de surlignage), pas de l'input utilisateur — c'est le seul
 * usage de dangerouslySetInnerHTML.
 * ============================================================================= */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn, formatDate, formatTimecode, generateId } from "@/lib/utils";
import {
  ArrowUp,
  CalendarDays,
  ExternalLink,
  Info,
  Play,
  Quote,
  Sparkles,
  TriangleAlert,
  UserRound,
} from "lucide-react";

/* --------------------------------------------------------------------------
 * Types de la réponse de /api/recherche
 * -------------------------------------------------------------------------- */
interface SearchResult {
  segment_id: number;
  headline: string | null;
  text: string;
  start_sec: number;
  video_title: string;
  youtube_id: string;
  channel: string | null;
  published_at: string;
  person_name: string | null;
  party: string | null;
  url: string;
}

interface SearchResponse {
  mode: "lexical" | "agent";
  total: number;
  results: SearchResult[];
  answer?: string;
}

/* Un échange = question + réponse (ou chargement / erreur) */
interface Exchange {
  id: string;
  question: string;
  status: "loading" | "done" | "error";
  response?: SearchResponse;
  errorMessage?: string;
}

/* --------------------------------------------------------------------------
 * Suggestions de recherche — 4 requêtes simples qui remplissent le champ
 * -------------------------------------------------------------------------- */
const SUGGESTIONS = [
  "immigration",
  "pouvoir d'achat",
  "motion de censure",
  "écologie",
];

/* ==========================================================================
 * COMPOSANT PRINCIPAL — ChatInterface
 * ========================================================================== */
export default function ChatInterface() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /* Filtres optionnels transmis à /api/recherche */
  const [personFilter, setPersonFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Requête initiale via /prompt?q=... (formulaire GET de la homepage) */
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q")?.trim() ?? "";
  const hasAutoSearched = useRef(false);

  /* Auto-scroll vers le bas à chaque mise à jour */
  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [exchanges]);

  /* Auto-focus au montage */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ------------------------------------------------------------------
   * Envoi d'une question → POST /api/recherche
   * ------------------------------------------------------------------ */
  const handleSendMessage = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || isSearching) return;

      const id = generateId();
      setExchanges((prev) => [...prev, { id, question: q, status: "loading" }]);
      setInputValue("");
      setIsSearching(true);

      try {
        /* Filtres optionnels : intervenant + période (transmis seulement si remplis) */
        const person = personFilter.trim();
        const res = await fetch("/api/recherche", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q,
            ...(person ? { person } : {}),
            ...(fromDate ? { from: fromDate } : {}),
            ...(toDate ? { to: toDate } : {}),
          }),
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            typeof json?.error === "string" ? json.error : `Erreur HTTP ${res.status}`
          );
        }

        setExchanges((prev) =>
          prev.map((ex) =>
            ex.id === id ? { ...ex, status: "done" as const, response: json as SearchResponse } : ex
          )
        );
      } catch (err) {
        setExchanges((prev) =>
          prev.map((ex) =>
            ex.id === id
              ? {
                  ...ex,
                  status: "error" as const,
                  errorMessage:
                    err instanceof Error ? err.message : "Erreur inattendue. Réessayez.",
                }
              : ex
          )
        );
      } finally {
        setIsSearching(false);
        inputRef.current?.focus();
      }
    },
    [isSearching, personFilter, fromDate, toDate]
  );

  /* Lancement automatique de la recherche initiale (?q=), une seule fois */
  useEffect(() => {
    if (initialQuery && !hasAutoSearched.current) {
      hasAutoSearched.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, handleSendMessage]);

  /* Touche Entrée => envoi */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  /* Clic sur une suggestion => remplit le champ (sans envoyer) */
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const isConversationEmpty = exchanges.length === 0;
  const isSendActive = inputValue.trim().length > 0 && !isSearching;

  /* ------------------------------------------------------------------
   * RENDU
   * ------------------------------------------------------------------ */
  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* ================= ZONE SCROLLABLE ================= */}
      <div className="flex-1 overflow-y-auto">
        {isConversationEmpty ? (
          /* ---- Écran de bienvenue ---- */
          <div className="flex flex-col items-center justify-center h-full px-4 py-8">
            <div className="flex flex-col items-center max-w-2xl w-full animate-fade-in-up">
              {/* Logo */}
              <div
                className="flex items-center justify-center rounded-2xl mb-8"
                style={{
                  width: "64px",
                  height: "64px",
                  background:
                    "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <Sparkles className="h-8 w-8" style={{ color: "var(--color-text-on-primary)" }} />
              </div>

              <h1
                className="text-2xl sm:text-3xl font-bold text-center mb-3"
                style={{ color: "var(--color-text-primary)" }}
              >
                Interrogez la base politique
              </h1>

              <p
                className="text-center max-w-md mb-10 text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Recherchez dans les transcriptions r&eacute;elles du corpus Dixipolis.
                Chaque r&eacute;sultat est sourc&eacute; avec la vid&eacute;o YouTube horodat&eacute;e.
              </p>

              {/* Suggestions — remplissent le champ */}
              <div className="w-full max-w-xl">
                <div className="grid grid-cols-2 gap-2.5 stagger-children">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "text-left px-4 py-3 rounded-[var(--radius-lg)] border cursor-pointer",
                        "border-[var(--color-border)] bg-[var(--color-bg-card)]",
                        "text-sm text-[var(--color-text-secondary)]",
                        "hover:border-[var(--color-primary-200)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)]",
                        "transition-colors duration-200",
                        "focus-visible:ring-2 focus-visible:ring-offset-2"
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ---- Liste des échanges ---- */
          <div className="mx-auto max-w-3xl px-4 py-6">
            <div className="space-y-6">
              {exchanges.map((exchange) => (
                <ExchangeBlock key={exchange.id} exchange={exchange} />
              ))}
              <div ref={messagesEndRef} aria-hidden="true" />
            </div>
          </div>
        )}
      </div>

      {/* ================= BARRE DE SAISIE (fond solide) ================= */}
      <div
        className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-bg-card)]"
      >
        <div className="mx-auto max-w-3xl px-4 py-3">
          {/* ---- Filtres optionnels : période + intervenant ---- */}
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              P&eacute;riode
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] px-2 py-1 text-xs"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="Filtrer à partir de cette date"
            />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
              &rarr;
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] px-2 py-1 text-xs"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="Filtrer jusqu'à cette date"
            />
            <span
              className="ml-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              Intervenant
            </span>
            <input
              type="text"
              value={personFilter}
              onChange={(e) => setPersonFilter(e.target.value)}
              maxLength={100}
              placeholder="ex : Gabriel Attal"
              className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-page)] px-2 py-1 text-xs sm:max-w-[180px]"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="Filtrer par intervenant"
            />
          </div>

          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3",
              "border border-[var(--color-border)] bg-[var(--color-bg-page)]",
              "focus-within:border-[var(--color-primary)]",
              "transition-colors duration-150"
            )}
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={300}
              placeholder="Recherchez dans les transcriptions politiques..."
              disabled={isSearching}
              className="flex-1 bg-transparent border-none outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: "var(--color-text-primary)" }}
              aria-label="Champ de saisie de votre recherche"
            />

            {/* Bouton d'envoi circulaire */}
            <button
              type="button"
              onClick={() => handleSendMessage(inputValue)}
              disabled={!isSendActive}
              className={cn(
                "flex items-center justify-center shrink-0 rounded-full",
                "transition-colors duration-150",
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
              }}
              aria-label="Lancer la recherche"
            >
              {isSearching ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

          <p
            className="text-center mt-2.5 text-[11px] leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Recherche sur les transcriptions r&eacute;elles du corpus Dixipolis.
            Chaque extrait est sourc&eacute; avec sa vid&eacute;o YouTube horodat&eacute;e.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * ExchangeBlock — question + réponse (chargement / erreur / résultats)
 * ========================================================================== */
function ExchangeBlock({ exchange }: { exchange: Exchange }) {
  return (
    <div className="animate-fade-in-up space-y-4">
      {/* ---- Question utilisateur (bulle à droite) ---- */}
      <div className="flex justify-end">
        <div
          className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-md px-4 py-3"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%)",
            color: "var(--color-text-on-primary)",
          }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{exchange.question}</p>
        </div>
      </div>

      {/* ---- Réponse ---- */}
      <div className="flex gap-3">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-1"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
          }}
          aria-hidden="true"
        >
          <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--color-text-on-primary)" }} />
        </div>

        <div className="min-w-0 flex-1">
          {exchange.status === "loading" && (
            <div
              className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3.5"
              aria-label="Recherche en cours"
            >
              <span className="loading-dot h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-text-muted)" }} />
              <span className="loading-dot h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-text-muted)" }} />
              <span className="loading-dot h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-text-muted)" }} />
            </div>
          )}

          {exchange.status === "error" && (
            <div className="flex items-start gap-2 rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-error-light)] px-4 py-3">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--color-error)" }} aria-hidden="true" />
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                {exchange.errorMessage}
              </p>
            </div>
          )}

          {exchange.status === "done" && exchange.response && (
            <ResponseBlock response={exchange.response} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * ResponseBlock — synthèse de l'agent + sources réelles
 * ========================================================================== */
function ResponseBlock({ response }: { response: SearchResponse }) {
  const { mode, total, results, answer } = response;

  return (
    <div className="space-y-3">
      {/* Bandeau mode lexical */}
      {mode === "lexical" && (
        <div className="flex items-start gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-info-light)] px-3 py-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-info)" }} aria-hidden="true" />
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Recherche plein-texte sur le corpus r&eacute;el &mdash; l&apos;agent IA (synth&egrave;se)
            s&apos;active quand OPENAI_API_KEY est configur&eacute;e.
          </p>
        </div>
      )}

      {/* Synthèse de l'agent (avec citations [seg_id] telles quelles) */}
      {answer && (
        <div className="rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3" style={{ boxShadow: "var(--shadow-sm)" }}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-text-primary)" }}>
            {answer}
          </p>
        </div>
      )}

      {/* Sources réelles */}
      {results.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Aucun extrait du corpus ne correspond &agrave; cette recherche.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="ml-1 text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            {total} extrait{total > 1 ? "s" : ""} trouv&eacute;{total > 1 ? "s" : ""} &mdash; {results.length} affich&eacute;{results.length > 1 ? "s" : ""}
          </p>
          {results.map((result) => (
            <ResultCard key={result.segment_id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
 * ResultCard — carte source : extrait, locuteur, chaîne, date, lien YouTube
 * ========================================================================== */
function ResultCard({ result }: { result: SearchResult }) {
  return (
    <div
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Métadonnées : locuteur, parti, chaîne, date */}
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>
          {result.person_name ?? "Locuteur non identifié"}
        </span>
        {result.party && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
            }}
          >
            {result.party}
          </span>
        )}
        <span style={{ color: "var(--color-text-muted)" }}>
          {result.channel ?? "Chaîne inconnue"}
          {result.published_at ? ` · ${formatDate(result.published_at)}` : ""}
        </span>
      </div>

      {/* Citation surlignée — HTML généré par Postgres ts_headline (<mark>) */}
      <div
        className="mb-3 rounded-lg border-l-4 py-2 pl-3"
        style={{
          borderColor: "var(--color-primary)",
          backgroundColor: "var(--color-primary-light)",
        }}
      >
        {result.headline ? (
          <p
            className="text-sm italic leading-relaxed [&_mark]:rounded-sm [&_mark]:bg-[var(--color-primary-200)] [&_mark]:px-0.5"
            style={{ color: "var(--color-text-primary)" }}
            dangerouslySetInnerHTML={{ __html: result.headline }}
          />
        ) : (
          <p className="text-sm italic leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
            {result.text}
          </p>
        )}
      </div>

      {/* Lien YouTube horodaté */}
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2"
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: "var(--color-error-light)", color: "var(--color-error)" }}
          aria-hidden="true"
        >
          <Play className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium group-hover:underline" style={{ color: "var(--color-text-secondary)" }}>
            {result.video_title}
          </span>
          <span className="block text-[11px]" style={{ color: "var(--color-text-muted)" }}>
            &agrave; {formatTimecode(result.start_sec)}
          </span>
        </span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-text-muted)" }} aria-hidden="true" />
      </a>

      {/* Vérification en contexte (anti « sorti de son contexte ») */}
      <Link
        href={`/segment/${result.segment_id}`}
        className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
        style={{ color: "var(--color-primary)" }}
      >
        <Quote className="h-3 w-3" aria-hidden="true" />
        Voir en contexte &rarr;
      </Link>
    </div>
  );
}

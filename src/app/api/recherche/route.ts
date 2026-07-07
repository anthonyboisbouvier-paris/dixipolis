/* =============================================================================
 * app/api/recherche/route.ts
 *
 * Route handler POST de la recherche Dixipolis.
 *
 * Corps attendu : { q: string (1-300 caractères), limit?: number,
 *                   person?: string, from?: string (YYYY-MM-DD), to?: string }
 *
 * Pipeline :
 *   0. Filtres optionnels : `person` est résolu en person_id via
 *      app_list_persons(person, 1) ; `from`/`to` bornent la période.
 *   1. Recherche lexicale plein-texte via app_search_transcripts (toujours),
 *      avec p_person_id / p_from / p_to.
 *   2. Si un chemin LLM est disponible (clé directe OU relais Supabase llm-proxy) :
 *      a. Embedding de la question (text-embedding-3-small)
 *      b. Recherche sémantique via app_search_semantic
 *      c. Fusion des résultats (déduplication par segment_id, lexical d'abord)
 *      d. Synthèse par gpt-4o-mini, chaque affirmation citant [seg_<id>]
 *
 * Réponse : { mode: "lexical" | "agent", total, results (max 12, avec URL
 * YouTube horodatée), answer?: string }. Aucune clé n'est exposée au client.
 * ============================================================================= */

import { NextResponse } from "next/server";
import { rpc } from "@/lib/supabase-server";
import { llmAvailable, openaiCall } from "@/lib/openai-server";

export const dynamic = "force-dynamic";

/* --------------------------------------------------------------------------
 * Types des contrats RPC
 * -------------------------------------------------------------------------- */
interface LexicalResult {
  segment_id: number;
  headline: string;
  text: string;
  start_sec: number;
  video_title: string;
  youtube_id: string;
  channel: string | null;
  published_at: string;
  person_id: number | null;
  person_name: string | null;
  party: string | null;
  avatar: string | null;
  rank: number;
}

interface LexicalResponse {
  total: number;
  results: LexicalResult[];
}

interface SemanticResult {
  segment_id: number;
  similarity: number;
  text: string;
  start_sec: number;
  video_title: string;
  youtube_id: string;
  channel: string | null;
  published_at: string;
  person_name: string | null;
  party: string | null;
}

/* Résultat normalisé renvoyé au client */
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

/* --------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */
function youtubeUrl(youtubeId: string, startSec: number): string {
  return `https://www.youtube.com/watch?v=${youtubeId}&t=${Math.max(0, Math.floor(startSec))}s`;
}

function toSearchResult(r: LexicalResult | SemanticResult): SearchResult {
  return {
    segment_id: r.segment_id,
    headline: "headline" in r ? r.headline : null,
    text: r.text,
    start_sec: r.start_sec,
    video_title: r.video_title,
    youtube_id: r.youtube_id,
    channel: r.channel,
    published_at: r.published_at,
    person_name: r.person_name,
    party: r.party,
    url: youtubeUrl(r.youtube_id, r.start_sec),
  };
}

/* --------------------------------------------------------------------------
 * Appels OpenAI (embedding + synthèse) — timeouts raisonnables, jamais
 * bloquants : toute erreur fait retomber la recherche en mode lexical.
 * -------------------------------------------------------------------------- */
async function fetchEmbedding(query: string): Promise<number[] | null> {
  try {
    const res = await openaiCall(
      "embeddings",
      { model: "text-embedding-3-small", input: query },
      10_000
    );
    if (!res.ok) {
      console.error(`[recherche] OpenAI embeddings → HTTP ${res.status}`);
      return null;
    }
    const json = (await res.json()) as { data?: { embedding?: number[] }[] };
    return json.data?.[0]?.embedding ?? null;
  } catch (err) {
    console.error("[recherche] OpenAI embeddings → erreur", err);
    return null;
  }
}

async function fetchAnswer(
  query: string,
  excerpts: SearchResult[]
): Promise<string | null> {
  const context = excerpts
    .map((r) => {
      const speaker = r.person_name ?? "Locuteur non identifié";
      const date = r.published_at?.slice(0, 10) ?? "date inconnue";
      return `[seg_${r.segment_id}] ${speaker} — ${date}\n${r.text}`;
    })
    .join("\n\n");

  try {
    const res = await openaiCall("chat", {
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Tu es l'agent de recherche du corpus politique Dixipolis. Réponds en français, factuel. " +
              "Chaque affirmation doit citer [seg_<id>] présent dans les extraits fournis. " +
              "Si l'info manque, dis-le explicitement. N'invente rien.",
          },
          {
            role: "user",
            content: `Question : ${query}\n\nExtraits du corpus :\n\n${context}`,
          },
        ],
      });
    if (!res.ok) {
      console.error(`[recherche] OpenAI chat → HTTP ${res.status}`);
      return null;
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return json.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[recherche] OpenAI chat → erreur", err);
    return null;
  }
}

/* --------------------------------------------------------------------------
 * POST /api/recherche
 * -------------------------------------------------------------------------- */
export async function POST(request: Request) {
  /* --- Validation du corps de requête ------------------------------------ */
  let body: { q?: unknown; limit?: unknown; person?: unknown; from?: unknown; to?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const q = typeof body.q === "string" ? body.q.trim() : "";
  if (q.length < 1 || q.length > 300) {
    return NextResponse.json(
      { error: "Le paramètre q doit contenir entre 1 et 300 caractères." },
      { status: 400 }
    );
  }

  const rawLimit = typeof body.limit === "number" ? body.limit : 20;
  const limit = Math.min(Math.max(Math.floor(rawLimit), 1), 50);

  /* --- Filtres optionnels : intervenant + période ------------------------- */
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  const person = typeof body.person === "string" ? body.person.trim().slice(0, 100) : "";
  const from = typeof body.from === "string" && DATE_RE.test(body.from.trim())
    ? body.from.trim()
    : null;
  const to = typeof body.to === "string" && DATE_RE.test(body.to.trim())
    ? body.to.trim()
    : null;

  try {
    /* --- 0. Résolution de l'intervenant (person → person_id) -------------- */
    let personId: number | null = null;
    if (person) {
      const matches = await rpc<{ person_id: number }[]>("app_list_persons", {
        p_query: person,
        p_limit: 1,
      });
      personId = matches?.[0]?.person_id ?? null;
    }

    /* --- a. Recherche lexicale (toujours) --------------------------------- */
    const lexical = await rpc<LexicalResponse>("app_search_transcripts", {
      p_query: q,
      p_person_id: personId,
      p_from: from,
      p_to: to,
      p_limit: limit,
    });
    if (!lexical) {
      return NextResponse.json(
        { error: "Base de données indisponible. Réessayez dans un instant." },
        { status: 500 }
      );
    }

    const merged: SearchResult[] = (lexical.results ?? []).map(toSearchResult);
    let total = lexical.total ?? merged.length;
    let mode: "lexical" | "agent" = "lexical";
    let answer: string | null = null;

    /* --- b. Enrichissement agent (si clé OpenAI configurée) --------------- */
    /* Note : app_search_semantic ne supporte pas les filtres intervenant /
       période — quand un filtre est actif, on saute la fusion sémantique pour
       ne pas réintroduire des extraits hors filtre. La synthèse reste active. */
    const hasFilters = personId !== null || from !== null || to !== null;
    if (llmAvailable()) {
      const embedding = await fetchEmbedding(q);
      if (embedding) {
        const semantic = hasFilters
          ? null
          : await rpc<SemanticResult[]>("app_search_semantic", {
              p_embedding: embedding,
              p_limit: 10,
            });

        /* Fusion : déduplication par segment_id, lexical d'abord */
        if (semantic && semantic.length > 0) {
          const seen = new Set(merged.map((r) => r.segment_id));
          for (const s of semantic) {
            if (!seen.has(s.segment_id)) {
              seen.add(s.segment_id);
              merged.push(toSearchResult(s));
            }
          }
          total = Math.max(total, merged.length);
        }

        /* Synthèse IA sur les 12 meilleurs extraits */
        const top = merged.slice(0, 12);
        if (top.length > 0) {
          answer = await fetchAnswer(q, top);
          if (answer) mode = "agent";
        }
      }
    }

    return NextResponse.json({
      mode,
      total,
      results: merged.slice(0, 12),
      ...(answer ? { answer } : {}),
    });
  } catch (err) {
    console.error("[recherche] erreur inattendue", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur de recherche." },
      { status: 500 }
    );
  }
}

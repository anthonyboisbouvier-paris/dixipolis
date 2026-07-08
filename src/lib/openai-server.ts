/* =============================================================================
 * lib/openai-server.ts
 *
 * Accès OpenAI côté serveur avec repli automatique.
 *
 * Chemin 1 (préféré) : OPENAI_API_KEY est définie → appel direct api.openai.com.
 * Chemin 2 (repli)   : pas de clé dans l'environnement → l'appel transite par
 * la Supabase Edge Function `llm-proxy` (la clé y est stockée côté Supabase),
 * authentifiée par le JWT anon du projet. Le relais verrouille les modèles
 * (gpt-4o-mini / text-embedding-3-small) et plafonne max_tokens.
 *
 * Dans les deux cas la réponse a exactement le format OpenAI natif.
 * Jamais importé côté client.
 * ============================================================================= */

export type OpenAIOp = "chat" | "embeddings";

const DIRECT_URLS: Record<OpenAIOp, string> = {
  chat: "https://api.openai.com/v1/chat/completions",
  embeddings: "https://api.openai.com/v1/embeddings",
};

/** Un chemin LLM est-il disponible (clé directe ou relais Supabase) ? */
export function llmAvailable(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
  );
}

/**
 * Exécute un appel OpenAI (direct ou via le relais) et renvoie la Response
 * brute — même contrat dans les deux chemins.
 */
export async function openaiCall(
  op: OpenAIOp,
  payload: Record<string, unknown>,
  timeoutMs = 30_000
): Promise<Response> {
  const key = process.env.OPENAI_API_KEY;
  if (key) {
    return fetch(DIRECT_URLS[op], {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    throw new Error("no_llm_path");
  }
  return fetch(`${supabaseUrl}/functions/v1/llm-proxy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ op, payload }),
    signal: AbortSignal.timeout(timeoutMs),
  });
}

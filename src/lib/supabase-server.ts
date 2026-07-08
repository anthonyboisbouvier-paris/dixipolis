/* =============================================================================
 * lib/supabase-server.ts
 *
 * Helper serveur pour appeler les fonctions SQL (RPC) Supabase.
 * Utilisé uniquement côté serveur (Server Components, route handlers) :
 * les clés SUPABASE_URL / SUPABASE_ANON_KEY ne sont JAMAIS exposées au
 * navigateur. Ne pas importer ce module dans un composant client.
 *
 * Pattern : POST `${SUPABASE_URL}/rest/v1/rpc/<fn>` avec les headers
 * apikey / Authorization Bearer, cache désactivé (données fraîches).
 * Renvoie null si l'environnement est absent ou en cas d'erreur HTTP.
 * ============================================================================= */

/* --------------------------------------------------------------------------
 * Types des contrats RPC partagés (import type uniquement côté composants)
 * -------------------------------------------------------------------------- */

/** Retour de app_global_stats() */
export interface GlobalStats {
  n_videos: number;
  total_hours: number;
  n_segments: number;
  n_words: number;
  n_persons: number;
  n_speakers_resolved: number;
  n_channels: number;
  n_speaking_slots: number;
  first_day: string;
  last_day: string;
}

/** Élément de app_search_transcripts().results */
export interface TranscriptResult {
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

/** Retour de app_search_transcripts() */
export interface TranscriptSearchResponse {
  total: number;
  results: TranscriptResult[];
}

export async function rpc<T>(fn: string, args?: object): Promise<T | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error(`[supabase-server] SUPABASE_URL / SUPABASE_ANON_KEY manquantes (rpc ${fn})`);
    return null;
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args ?? {}),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[supabase-server] rpc ${fn} → HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[supabase-server] rpc ${fn} → erreur réseau`, err);
    return null;
  }
}

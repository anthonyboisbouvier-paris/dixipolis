/* =============================================================================
 * app/api/escapade-auth/route.ts
 *
 * Route handler POST de l'authentification + synchronisation cloud d'Escapade.
 * Fait office de proxy vers Supabase Auth (OTP par email) et PostgREST
 * (table public.escapade_profiles, protégée par RLS : chaque utilisateur
 * authentifié n'accède qu'à SA ligne).
 *
 * Cinq actions dans le corps JSON :
 *   - "request_otp" : envoie un code à 6 chiffres par email (création de
 *     compte implicite : create_user = true).
 *   - "verify"      : échange email + code contre access/refresh tokens.
 *   - "refresh"     : renouvelle la session via le refresh_token.
 *   - "pull"        : lit l'état cloud (state + updated_at) de l'utilisateur.
 *   - "push"        : upsert de l'état (≤ 150 Ko sérialisé) de l'utilisateur.
 *
 * Les clés SUPABASE_URL / SUPABASE_ANON_KEY restent strictement côté serveur
 * (la clé anon ne quitte JAMAIS ce fichier). Timeouts 10 s, erreurs JSON
 * propres, jamais de détail interne exposé au client.
 * ============================================================================= */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 10_000;
const MAX_STATE_BYTES = 150_000; // ~150 Ko sérialisés
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_RE = /^\d{6}$/;

/* --------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

function jsonOk(payload: Record<string, unknown>) {
  return NextResponse.json({ ok: true, ...payload });
}

function jsonErr(error: string, status = 200) {
  return NextResponse.json({ ok: false, error }, { status });
}

interface SupabaseEnv {
  url: string;
  anon: string;
}

function supabaseEnv(): SupabaseEnv | null {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return { url, anon };
}

/** Appel Supabase générique : timeout 10 s, ne jette jamais (null = réseau KO). */
async function sbFetch(
  env: SupabaseEnv,
  path: string,
  init: { method: string; accessToken?: string; body?: unknown; prefer?: string }
): Promise<Response | null> {
  const headers: Record<string, string> = {
    apikey: env.anon,
    "Content-Type": "application/json",
  };
  if (init.accessToken) headers.Authorization = `Bearer ${init.accessToken}`;
  if (init.prefer) headers.Prefer = init.prefer;
  try {
    return await fetch(`${env.url}${path}`, {
      method: init.method,
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return null; // réseau / timeout
  }
}

/** Extrait le claim `sub` (user_id) du payload base64url d'un JWT, sans vérifier
 *  la signature : Supabase (RLS) revalide le token de toute façon. */
function jwtSub(accessToken: string): string | null {
  try {
    const part = String(accessToken).split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    const sub = payload && payload.sub;
    return typeof sub === "string" && sub.length > 0 ? sub : null;
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------------------
 * Actions
 * -------------------------------------------------------------------------- */

async function requestOtp(env: SupabaseEnv, email: string) {
  const res = await sbFetch(env, "/auth/v1/otp", {
    method: "POST",
    body: { email, create_user: true },
  });
  if (res && res.ok) return jsonOk({});
  if (res && res.status === 429) return jsonErr("rate_limit");
  return jsonErr("otp_failed");
}

async function verifyOtp(env: SupabaseEnv, email: string, token: string) {
  const res = await sbFetch(env, "/auth/v1/verify", {
    method: "POST",
    body: { type: "email", email, token },
  });
  if (!res || !res.ok) return jsonErr("bad_code");
  const json = await res.json().catch(() => null);
  if (!json || typeof json.access_token !== "string" || typeof json.refresh_token !== "string") {
    return jsonErr("bad_code");
  }
  return jsonOk({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_in: Number(json.expires_in) || 3600,
    user_email: email,
  });
}

async function refreshSession(env: SupabaseEnv, refreshToken: string) {
  const res = await sbFetch(env, "/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  if (!res || !res.ok) return jsonErr("expired");
  const json = await res.json().catch(() => null);
  if (!json || typeof json.access_token !== "string" || typeof json.refresh_token !== "string") {
    return jsonErr("expired");
  }
  return jsonOk({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_in: Number(json.expires_in) || 3600,
  });
}

async function pullState(env: SupabaseEnv, accessToken: string) {
  const res = await sbFetch(env, "/rest/v1/escapade_profiles?select=state,updated_at", {
    method: "GET",
    accessToken,
  });
  if (!res) return jsonErr("network");
  if (res.status === 401) return jsonErr("unauthorized");
  if (!res.ok) return jsonErr("pull_failed");
  const rows = await res.json().catch(() => null);
  const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
  return jsonOk({
    state: row && row.state !== undefined ? row.state : null,
    updated_at: row && typeof row.updated_at === "string" ? row.updated_at : null,
  });
}

async function pushState(env: SupabaseEnv, accessToken: string, state: object) {
  const userId = jwtSub(accessToken);
  if (!userId) return jsonErr("unauthorized");
  const res = await sbFetch(env, "/rest/v1/escapade_profiles", {
    method: "POST",
    accessToken,
    prefer: "resolution=merge-duplicates",
    body: [{ user_id: userId, state, updated_at: new Date().toISOString() }],
  });
  if (!res) return jsonErr("network");
  if (res.status === 401) return jsonErr("unauthorized");
  if (!res.ok) return jsonErr("push_failed");
  return jsonOk({});
}

/* --------------------------------------------------------------------------
 * Handler
 * -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  const env = supabaseEnv();
  if (!env) return jsonErr("no_config");

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return jsonErr("bad_request", 400);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return jsonErr("bad_request", 400);
  }

  try {
    const action = body.action;

    if (action === "request_otp") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!email || email.length > 200 || !EMAIL_RE.test(email)) return jsonErr("bad_email", 400);
      return await requestOtp(env, email);
    }

    if (action === "verify") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const token = typeof body.token === "string" ? body.token.trim() : "";
      if (!email || email.length > 200 || !EMAIL_RE.test(email)) return jsonErr("bad_email", 400);
      if (!TOKEN_RE.test(token)) return jsonErr("bad_code");
      return await verifyOtp(env, email, token);
    }

    if (action === "refresh") {
      const refreshToken = typeof body.refresh_token === "string" ? body.refresh_token : "";
      if (!refreshToken || refreshToken.length > 2000) return jsonErr("expired");
      return await refreshSession(env, refreshToken);
    }

    if (action === "pull") {
      const accessToken = typeof body.access_token === "string" ? body.access_token : "";
      if (!accessToken) return jsonErr("unauthorized");
      return await pullState(env, accessToken);
    }

    if (action === "push") {
      const accessToken = typeof body.access_token === "string" ? body.access_token : "";
      if (!accessToken) return jsonErr("unauthorized");
      const state = body.state;
      if (!state || typeof state !== "object" || Array.isArray(state)) {
        return jsonErr("bad_state", 400);
      }
      let serialized: string;
      try {
        serialized = JSON.stringify(state);
      } catch {
        return jsonErr("bad_state", 400);
      }
      if (Buffer.byteLength(serialized, "utf8") > MAX_STATE_BYTES) {
        return jsonErr("too_large", 413);
      }
      return await pushState(env, accessToken, state as object);
    }

    return jsonErr("bad_action", 400);
  } catch {
    return jsonErr("server_error", 500);
  }
}

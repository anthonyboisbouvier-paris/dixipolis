/* =============================================================================
 * app/api/waitlist/route.ts
 *
 * Route handler POST de la liste d'attente Dixipolis.
 *
 * Corps attendu : { email: string (1-199 caractères), source?: string }
 *
 * Pipeline :
 *   1. Validation basique du corps (email non vide, longueur raisonnable).
 *   2. Appel de la RPC Supabase app_join_waitlist(p_email, p_source) —
 *      la validation stricte du format email est faite côté base.
 *   3. Réponse { ok: true } en cas de succès, { ok: false, error } sinon.
 *
 * Aucune clé n'est exposée au client : l'appel Supabase passe par le
 * helper serveur lib/supabase-server.ts (SUPABASE_URL / SUPABASE_ANON_KEY
 * restent côté serveur).
 * ============================================================================= */

import { NextResponse } from "next/server";
import { rpc } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/* --------------------------------------------------------------------------
 * Types du contrat RPC
 * -------------------------------------------------------------------------- */

/** Retour de app_join_waitlist() : { ok: true } ou { ok: false, error } */
interface JoinWaitlistResponse {
  ok: boolean;
  error?: string;
}

/* --------------------------------------------------------------------------
 * POST /api/waitlist
 * -------------------------------------------------------------------------- */
export async function POST(request: Request) {
  /* --- Validation du corps de requête ------------------------------------ */
  let body: { email?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Corps JSON invalide." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email.length < 1 || email.length >= 200) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 }
    );
  }

  /* Source facultative (page d'origine du formulaire), bornée à 100 chars */
  const source =
    typeof body.source === "string" && body.source.trim().length > 0
      ? body.source.trim().slice(0, 100)
      : "site";

  try {
    /* --- Appel RPC : inscription à la liste d'attente ---------------------- */
    const result = await rpc<JoinWaitlistResponse>("app_join_waitlist", {
      p_email: email,
      p_source: source,
    });

    if (!result) {
      return NextResponse.json(
        { ok: false, error: "Service indisponible. Réessayez dans un instant." },
        { status: 500 }
      );
    }

    if (!result.ok) {
      /* La base a refusé l'email (format invalide, etc.) */
      return NextResponse.json(
        { ok: false, error: result.error ?? "invalid_email" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist] erreur inattendue", err);
    return NextResponse.json(
      { ok: false, error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

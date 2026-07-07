/* =============================================================================
 * components/shared/WaitlistForm.tsx
 *
 * Formulaire d'inscription à la liste d'attente Dixipolis.
 *
 * Fonctionnalités :
 *   - Champ email accessible (label explicite, aria-describedby pour les
 *     messages d'état) + bouton « Rejoindre la liste d'attente »
 *   - POST /api/waitlist avec { email, source } — la source identifie la
 *     page d'origine (connexion, inscription, compte, tarifs…)
 *   - États : idle / loading (bouton désactivé + spinner) / succès / erreur
 *   - Messages annoncés via une zone aria-live="polite" (lecteurs d'écran)
 *
 * Design :
 *   - Input arrondi cohérent avec les formulaires existants (CSS variables)
 *   - Bouton .btn-primary du design system
 *   - Aucune couleur Tailwind brute : tout passe par var(--color-*)
 *
 * Utilisation :
 *   <WaitlistForm source="connexion" />
 * ============================================================================= */

"use client";

import { useState, type FormEvent } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */
interface WaitlistFormProps {
  /** Page d'origine du formulaire (transmise à l'API : connexion, tarifs…) */
  source: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

/* --------------------------------------------------------------------------
 * WaitlistForm — Composant principal
 * -------------------------------------------------------------------------- */
export default function WaitlistForm({ source }: WaitlistFormProps) {
  /* ---- État du formulaire ---- */
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  /* Identifiants uniques par instance (plusieurs formulaires possibles
   * sur une même page : on préfixe par la source). */
  const inputId = `waitlist-email-${source}`;
  const statusId = `waitlist-status-${source}`;

  /* ---- Soumission : POST /api/waitlist ---- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (trimmed.length === 0 || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (res.ok && json?.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(
          json?.error === "invalid_email"
            ? "Cette adresse email ne semble pas valide."
            : "Une erreur est survenue. Réessayez dans un instant."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Connexion impossible. Vérifiez votre réseau et réessayez.");
    }
  };

  /* ---- Rendu : état succès (remplace le formulaire) ---- */
  if (status === "success") {
    return (
      <div
        id={statusId}
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-lg border p-4"
        style={{
          borderColor: "var(--color-success)",
          backgroundColor: "var(--color-success-light, #dcfce7)",
        }}
      >
        <CheckCircle
          size={20}
          className="shrink-0"
          style={{ color: "var(--color-success)" }}
          aria-hidden="true"
        />
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Merci ! Vous serez prévenu au lancement.
        </p>
      </div>
    );
  }

  /* ---- Rendu : formulaire (idle / loading / erreur) ---- */
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {/* ---- Champ email ---- */}
      <div>
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Adresse email
        </label>
        <div className="relative">
          {/* Icône Mail positionnée à gauche du champ */}
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            size={18}
            style={{ color: "var(--color-text-muted)" }}
            aria-hidden="true"
          />
          <input
            id={inputId}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nom@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? statusId : undefined}
            className={cn(
              "w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm transition-colors",
              "placeholder:opacity-50",
              "focus:outline-none focus:ring-2"
            )}
            style={{
              borderColor:
                status === "error"
                  ? "var(--color-error)"
                  : "var(--color-border)",
              backgroundColor: "var(--color-bg-card)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
      </div>

      {/* ---- Message d'erreur (annoncé aux lecteurs d'écran) ---- */}
      <div aria-live="polite">
        {status === "error" && (
          <p
            id={statusId}
            role="alert"
            className="text-sm"
            style={{ color: "var(--color-error)" }}
          >
            {errorMessage}
          </p>
        )}
      </div>

      {/* ---- Bouton de soumission ---- */}
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "btn-primary w-full",
          status === "loading" && "cursor-not-allowed opacity-60"
        )}
        aria-disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Inscription en cours…
          </>
        ) : (
          "Rejoindre la liste d'attente"
        )}
      </button>
    </form>
  );
}

/* =============================================================================
 * app/connexion/page.tsx
 *
 * Page de connexion (login) premium de l'application Dixipolis.
 *
 * Fonctionnalites :
 *   - Formulaire de connexion avec email et mot de passe
 *   - Validation basique (champs non vides) pour activer le bouton
 *   - Toggle visibilite du mot de passe (Eye/EyeOff)
 *   - Liens vers la page d'inscription et la reinitialisation du mot de passe
 *   - Separateur visuel "ou" entre le formulaire et le lien d'inscription
 *   - Pret pour une future integration Supabase Auth (submit = log console)
 *
 * Design :
 *   - Carte blanche centree sur fond page (palette Dixipolis)
 *   - Logo Dixipolis en en-tete de la carte
 *   - Icones Lucide dans chaque champ pour une UX claire et accessible
 *   - Bouton primaire avec etat desactive visuellement distinct
 *   - Toutes les couleurs via CSS variables (pas de Tailwind raw colors)
 *
 * Note :
 *   - "use client" car utilise useState pour le formulaire
 *   - Les metadata SEO sont exportees dans layout.tsx (Server Component)
 *   - Pas de pt-offset — le root layout gere le padding pour le header
 * ============================================================================= */

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * ConnexionPage — Composant principal de la page de connexion
 * -------------------------------------------------------------------------- */
export default function ConnexionPage() {
  /* ---- Etat du formulaire ---- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---- Validation : le bouton est actif seulement si les deux champs sont remplis ---- */
  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  /* ---- Soumission du formulaire (placeholder pour Supabase Auth) ---- */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    // TODO : Remplacer par un appel Supabase Auth (signInWithPassword)
    console.log("[Dixipolis] Tentative de connexion :", { email });
  };

  /* ---- Rendu ---- */
  return (
    <main
      className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* ================================================================
       * Carte de connexion
       * max-w-md pour une largeur confortable sur desktop.
       * Carte blanche avec ombre legere via la classe .card du design system.
       * ================================================================ */}
      <div
        className="card w-full max-w-md p-8 sm:p-10"
        role="region"
        aria-label="Formulaire de connexion"
      >
        {/* ---- En-tete : logo Dixipolis ---- */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block"
            aria-label="Retour a l'accueil Dixipolis"
          >
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--color-primary)" }}
            >
              Dixipolis
            </span>
          </Link>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Connectez-vous pour acceder a votre espace
          </p>
        </div>

        {/* ================================================================
         * Formulaire de connexion
         * noValidate desactive la validation native du navigateur
         * (la validation est geree manuellement via isFormValid).
         * ================================================================ */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* ---- Champ email ---- */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Adresse email
            </label>
            <div className="relative">
              {/* Icone Mail positionnee a gauche du champ */}
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="nom@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
                className={cn(
                  "w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm transition-colors",
                  "placeholder:opacity-50",
                  "focus:outline-none focus:ring-2"
                )}
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-card)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>
          </div>

          {/* ---- Champ mot de passe avec toggle visibilite ---- */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Mot de passe
            </label>
            <div className="relative">
              {/* Icone Lock positionnee a gauche du champ */}
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
                className={cn(
                  "w-full rounded-lg border py-2.5 pl-10 pr-12 text-sm transition-colors",
                  "placeholder:opacity-50",
                  "focus:outline-none focus:ring-2"
                )}
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-card)",
                  color: "var(--color-text-primary)",
                }}
              />
              {/* Bouton toggle visibilite mot de passe */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 transition-opacity hover:opacity-70"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>

          {/* ---- Lien mot de passe oublie ---- */}
          <div className="text-right">
            <Link
              href="/mot-de-passe-oublie"
              className="text-sm font-medium transition-opacity hover:opacity-80 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              Mot de passe oublie ?
            </Link>
          </div>

          {/* ---- Bouton de soumission ---- */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              isFormValid
                ? "cursor-pointer hover:opacity-90"
                : "cursor-not-allowed opacity-50"
            )}
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
            }}
            aria-disabled={!isFormValid}
          >
            <LogIn size={18} aria-hidden="true" />
            Se connecter
          </button>
        </form>

        {/* ================================================================
         * Separateur "ou"
         * Divise visuellement le formulaire de connexion et le lien
         * d'inscription. Utilise un role="separator" pour l'accessibilite.
         * ================================================================ */}
        <div className="my-6 flex items-center gap-3" role="separator">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            ou
          </span>
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* ================================================================
         * Lien vers la page d'inscription
         * ================================================================ */}
        <div className="text-center">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Pas encore de compte ?{" "}
            <Link
              href="/inscription"
              className="font-semibold transition-opacity hover:opacity-80 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              Creer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

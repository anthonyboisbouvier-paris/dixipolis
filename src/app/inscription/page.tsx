/* =============================================================================
 * app/inscription/page.tsx
 *
 * Page d'inscription (register) premium de l'application Dixipolis.
 *
 * Fonctionnalites :
 *   - Formulaire d'inscription complet (prenom, nom, email, mot de passe)
 *   - Prenom et nom cote a cote sur une meme ligne (responsive)
 *   - Indicateur de force du mot de passe (Faible / Moyen / Fort)
 *   - Confirmation du mot de passe avec verification de correspondance
 *   - Case a cocher d'acceptation des CGU (obligatoire)
 *   - Validation : tous les champs requis + CGU acceptees pour activer le bouton
 *   - Pret pour une future integration Supabase Auth (submit = log console)
 *
 * Design :
 *   - Carte blanche centree sur fond page (palette Dixipolis)
 *   - Logo Dixipolis en en-tete de la carte
 *   - Indicateur de force colore (rouge / jaune / vert) avec barre de progression
 *   - Toutes les couleurs via CSS variables (pas de Tailwind raw colors)
 *
 * Note :
 *   - "use client" car utilise useState/useMemo pour le formulaire
 *   - Les metadata SEO sont exportees dans layout.tsx (Server Component)
 *   - Pas de pt-offset — le root layout gere le padding pour le header
 * ============================================================================= */

"use client";

import { useState, useMemo, type FormEvent } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * getPasswordStrength — Evalue la force du mot de passe.
 *
 * Logique simplifiee basee sur la longueur :
 *   - < 6 caracteres    : "faible"
 *   - 6 a 9 caracteres  : "moyen"
 *   - >= 10 caracteres  : "fort"
 *
 * @param password - Mot de passe a evaluer
 * @returns Objet { label, color, width } pour l'affichage
 * -------------------------------------------------------------------------- */
function getPasswordStrength(password: string): {
  label: string;
  color: string;
  width: string;
} {
  if (password.length === 0) {
    return { label: "", color: "transparent", width: "0%" };
  }
  if (password.length < 6) {
    return { label: "Faible", color: "var(--color-error)", width: "33%" };
  }
  if (password.length < 10) {
    return { label: "Moyen", color: "var(--color-warning)", width: "66%" };
  }
  return { label: "Fort", color: "var(--color-success)", width: "100%" };
}

/* --------------------------------------------------------------------------
 * InscriptionPage — Composant principal de la page d'inscription
 * -------------------------------------------------------------------------- */
export default function InscriptionPage() {
  /* ---- Etat du formulaire ---- */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [acceptCgu, setAcceptCgu] = useState(false);

  /* ---- Indicateur de force du mot de passe (memoise pour la performance) ---- */
  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  /* ---- Les mots de passe correspondent-ils ? ---- */
  const passwordsMatch =
    passwordConfirm.length === 0 || password === passwordConfirm;

  /* ---- Validation globale : tous les champs remplis + CGU + mots de passe identiques ---- */
  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    passwordConfirm.trim().length > 0 &&
    password === passwordConfirm &&
    acceptCgu;

  /* ---- Soumission du formulaire (placeholder pour Supabase Auth) ---- */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    // TODO : Remplacer par un appel Supabase Auth (signUp)
    console.log("[Dixipolis] Tentative d'inscription :", {
      firstName,
      lastName,
      email,
    });
  };

  /* ---- Rendu ---- */
  return (
    <main
      className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* ================================================================
       * Carte d'inscription
       * max-w-md pour une largeur confortable, identique a la connexion.
       * ================================================================ */}
      <div
        className="card w-full max-w-md p-8 sm:p-10"
        role="region"
        aria-label="Formulaire d'inscription"
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
            Creez votre compte pour commencer
          </p>
        </div>

        {/* ================================================================
         * Formulaire d'inscription
         * ================================================================ */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* ---- Prenom et Nom (cote a cote) ---- */}
          <div className="grid grid-cols-2 gap-3">
            {/* Prenom */}
            <div>
              <label
                htmlFor="register-firstname"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Prenom
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                  aria-hidden="true"
                />
                <input
                  id="register-firstname"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Jean"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  aria-required="true"
                  className={cn(
                    "w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm transition-colors",
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

            {/* Nom */}
            <div>
              <label
                htmlFor="register-lastname"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Nom
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  size={18}
                  style={{ color: "var(--color-text-muted)" }}
                  aria-hidden="true"
                />
                <input
                  id="register-lastname"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  placeholder="Dupont"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  aria-required="true"
                  className={cn(
                    "w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm transition-colors",
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
          </div>

          {/* ---- Champ email ---- */}
          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Adresse email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <input
                id="register-email"
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

          {/* ---- Champ mot de passe avec indicateur de force ---- */}
          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Choisissez un mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
                aria-describedby="password-strength"
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
              {/* Bouton toggle visibilite */}
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

            {/* ---- Indicateur de force du mot de passe ---- */}
            {password.length > 0 && (
              <div className="mt-2" id="password-strength">
                {/* Barre de progression coloree */}
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--color-border)" }}
                  role="progressbar"
                  aria-valuenow={
                    password.length < 6 ? 33 : password.length < 10 ? 66 : 100
                  }
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Force du mot de passe : ${passwordStrength.label}`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: passwordStrength.width,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                {/* Label textuel (Faible / Moyen / Fort) */}
                <p
                  className="mt-1 text-xs font-medium"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* ---- Confirmation du mot de passe ---- */}
          <div>
            <label
              htmlFor="register-password-confirm"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <input
                id="register-password-confirm"
                name="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Confirmez votre mot de passe"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                aria-required="true"
                aria-invalid={!passwordsMatch}
                aria-describedby={
                  !passwordsMatch ? "password-mismatch" : undefined
                }
                className={cn(
                  "w-full rounded-lg border py-2.5 pl-10 pr-12 text-sm transition-colors",
                  "placeholder:opacity-50",
                  "focus:outline-none focus:ring-2"
                )}
                style={{
                  borderColor: !passwordsMatch
                    ? "var(--color-error)"
                    : "var(--color-border)",
                  backgroundColor: "var(--color-bg-card)",
                  color: "var(--color-text-primary)",
                }}
              />
              {/* Bouton toggle visibilite confirmation */}
              <button
                type="button"
                onClick={() => setShowPasswordConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 transition-opacity hover:opacity-70"
                aria-label={
                  showPasswordConfirm
                    ? "Masquer la confirmation"
                    : "Afficher la confirmation"
                }
              >
                {showPasswordConfirm ? (
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

            {/* Message d'erreur si les mots de passe ne correspondent pas */}
            {!passwordsMatch && (
              <p
                id="password-mismatch"
                className="mt-1 text-xs"
                style={{ color: "var(--color-error)" }}
                role="alert"
              >
                Les mots de passe ne correspondent pas.
              </p>
            )}
          </div>

          {/* ---- Checkbox CGU ---- */}
          <div className="flex items-start gap-3">
            <input
              id="register-cgu"
              name="acceptCgu"
              type="checkbox"
              checked={acceptCgu}
              onChange={(e) => setAcceptCgu(e.target.checked)}
              aria-required="true"
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border"
              style={{ accentColor: "var(--color-primary)" }}
            />
            <label
              htmlFor="register-cgu"
              className="text-sm leading-snug"
              style={{ color: "var(--color-text-secondary)" }}
            >
              J&apos;accepte les{" "}
              <Link
                href="/cgu"
                className="font-medium underline transition-opacity hover:opacity-80"
                style={{ color: "var(--color-primary)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                conditions generales d&apos;utilisation
              </Link>
            </label>
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
            <UserPlus size={18} aria-hidden="true" />
            Creer mon compte
          </button>
        </form>

        {/* ================================================================
         * Lien vers la page de connexion
         * ================================================================ */}
        <div className="mt-6 text-center">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Deja un compte ?{" "}
            <Link
              href="/connexion"
              className="font-semibold transition-opacity hover:opacity-80 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

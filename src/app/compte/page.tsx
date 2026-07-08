/* =============================================================================
 * app/compte/page.tsx
 *
 * Page « Mon compte » de Dixipolis — version liste d'attente.
 *
 * L'espace membre n'existe pas encore : cette page l'annonce honnêtement
 * (plus aucune donnée utilisateur fictive) et propose de rejoindre la liste
 * d'attente (WaitlistForm → POST /api/waitlist, source "compte").
 *
 * Contenu :
 *   - Message : « L'espace membre arrive »
 *   - Bénéfices à venir : recherches sauvegardées, alertes personnalisées,
 *     suivi de politiciens
 *   - Formulaire de liste d'attente
 *
 * Design :
 *   - Carte blanche centrée sur fond page (palette Dixipolis)
 *   - Toutes les couleurs via CSS variables (pas de Tailwind raw colors)
 *
 * Note :
 *   - Composant serveur : l'interactivité est déléguée à WaitlistForm
 *   - Les metadata SEO restent exportées dans layout.tsx
 *   - Pas de pt-offset — le root layout gère le padding pour le header
 * ============================================================================= */

import Link from "next/link";
import { Bookmark, Bell, Users, UserRound } from "lucide-react";
import WaitlistForm from "@/components/shared/WaitlistForm";

/* --------------------------------------------------------------------------
 * Bénéfices annoncés de l'espace membre à venir
 * -------------------------------------------------------------------------- */
const BENEFITS = [
  {
    icon: Bookmark,
    label: "Recherches sauvegardées",
    description: "Retrouvez vos requêtes sur le corpus en un clic.",
  },
  {
    icon: Bell,
    label: "Alertes personnalisées",
    description: "Soyez prévenu quand un sujet qui vous intéresse est évoqué.",
  },
  {
    icon: Users,
    label: "Suivi de politiciens",
    description: "Suivez les prises de parole des personnalités de votre choix.",
  },
] as const;

/* --------------------------------------------------------------------------
 * ComptePage — Composant principal de la page compte
 * -------------------------------------------------------------------------- */
export default function ComptePage() {
  return (
    <main
      className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* ================================================================
       * Carte centrale
       * ================================================================ */}
      <div
        className="card w-full max-w-md p-8 sm:p-10"
        role="region"
        aria-label="Espace membre à venir"
      >
        {/* ---- En-tête : icône + titre ---- */}
        <div className="mb-6 text-center">
          <span
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
            }}
            aria-hidden="true"
          >
            <UserRound size={28} />
          </span>
          <h1
            className="mt-4 text-2xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            L&apos;espace membre arrive
          </h1>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Les comptes utilisateurs ne sont pas encore ouverts. Laissez votre
            email pour &ecirc;tre pr&eacute;venu d&egrave;s le lancement.
          </p>
        </div>

        {/* ================================================================
         * Bénéfices de l'espace membre à venir
         * ================================================================ */}
        <ul className="mb-8 space-y-4" aria-label="Fonctionnalités à venir">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li key={benefit.label} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                  }}
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </span>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {benefit.label}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* ================================================================
         * Formulaire de liste d'attente
         * ================================================================ */}
        <WaitlistForm source="compte" />

        {/* ---- Lien retour vers l'accueil ---- */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-semibold transition-opacity hover:opacity-80 hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Retour &agrave; l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}

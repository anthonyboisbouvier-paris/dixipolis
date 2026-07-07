/* =============================================================================
 * app/connexion/page.tsx
 *
 * Page de connexion de Dixipolis — version liste d'attente.
 *
 * L'authentification n'est pas encore ouverte : plutôt qu'un faux formulaire
 * de connexion, cette page l'annonce honnêtement et propose de rejoindre la
 * liste d'attente (WaitlistForm → POST /api/waitlist, source "connexion").
 *
 * Contenu :
 *   - Message : « Dixipolis ouvre bientôt ses comptes utilisateurs »
 *   - Bénéfices à venir : recherches sauvegardées, alertes personnalisées,
 *     suivi de politiciens
 *   - Formulaire de liste d'attente
 *
 * Design :
 *   - Carte blanche centrée sur fond page (palette Dixipolis)
 *   - Logo Dixipolis en en-tête de la carte
 *   - Toutes les couleurs via CSS variables (pas de Tailwind raw colors)
 *
 * Note :
 *   - Composant serveur : l'interactivité est déléguée à WaitlistForm
 *   - Les metadata SEO restent exportées dans layout.tsx
 *   - Pas de pt-offset — le root layout gère le padding pour le header
 * ============================================================================= */

import Link from "next/link";
import { Bookmark, Bell, Users } from "lucide-react";
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
 * ConnexionPage — Composant principal de la page de connexion
 * -------------------------------------------------------------------------- */
export default function ConnexionPage() {
  return (
    <main
      className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      {/* ================================================================
       * Carte centrale
       * max-w-md pour une largeur confortable sur desktop.
       * ================================================================ */}
      <div
        className="card w-full max-w-md p-8 sm:p-10"
        role="region"
        aria-label="Liste d'attente Dixipolis"
      >
        {/* ---- En-tête : logo Dixipolis ---- */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-block"
            aria-label="Retour à l'accueil Dixipolis"
          >
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--color-primary)" }}
            >
              Dixipolis
            </span>
          </Link>
          <h1
            className="mt-4 text-xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Dixipolis ouvre bient&ocirc;t ses comptes utilisateurs
          </h1>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            La connexion n&apos;est pas encore disponible. Laissez votre email
            pour &ecirc;tre pr&eacute;venu d&egrave;s l&apos;ouverture.
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
        <WaitlistForm source="connexion" />

        {/* ---- Lien retour vers l'accueil ---- */}
        <div className="mt-6 text-center">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            En attendant, la{" "}
            <Link
              href="/"
              className="font-semibold transition-opacity hover:opacity-80 hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              recherche dans le corpus
            </Link>{" "}
            est d&eacute;j&agrave; ouverte &agrave; tous.
          </p>
        </div>
      </div>
    </main>
  );
}

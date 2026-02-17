/* =============================================================================
 * app/connexion/layout.tsx
 *
 * Layout serveur pour la page de connexion.
 *
 * Pourquoi ce fichier existe :
 *   - La page connexion/page.tsx est un Client Component ("use client")
 *   - Les Client Components ne peuvent PAS exporter de metadata Next.js
 *   - Ce layout serveur sert uniquement a exporter les metadata SEO
 *   - Il rend ses enfants sans aucun wrapper supplementaire
 *
 * Le padding-top pour le header est deja gere par le layout racine (root layout).
 * Aucun padding additionnel n'est ajoute ici.
 * ============================================================================= */

import type { Metadata } from "next";

/* --------------------------------------------------------------------------
 * METADATA SEO
 * Titre affiche dans l'onglet du navigateur et les resultats de recherche.
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous a votre compte Dixipolis pour acceder a vos analyses politiques et donnees parlementaires.",
};

/* --------------------------------------------------------------------------
 * ConnexionLayout
 * Layout transparent — rend ses enfants sans modification.
 * -------------------------------------------------------------------------- */
export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

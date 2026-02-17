/* =============================================================================
 * app/inscription/layout.tsx
 *
 * Layout serveur pour la page d'inscription.
 *
 * Pourquoi ce fichier existe :
 *   - La page inscription/page.tsx est un Client Component ("use client")
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
  title: "Inscription",
  description:
    "Creez votre compte Dixipolis gratuitement et accedez aux analyses politiques, donnees parlementaires et bien plus.",
};

/* --------------------------------------------------------------------------
 * InscriptionLayout
 * Layout transparent — rend ses enfants sans modification.
 * -------------------------------------------------------------------------- */
export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

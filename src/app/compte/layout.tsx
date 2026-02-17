/* =============================================================================
 * app/compte/layout.tsx
 *
 * Layout serveur pour la page Mon Compte (tableau de bord utilisateur).
 *
 * Pourquoi ce fichier existe :
 *   - La page compte/page.tsx est un Client Component ("use client")
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
  title: "Mon Compte",
  description:
    "Gerez votre profil, votre abonnement, vos recherches sauvegardees et vos alertes sur Dixipolis.",
};

/* --------------------------------------------------------------------------
 * CompteLayout
 * Layout transparent — rend ses enfants sans modification.
 * -------------------------------------------------------------------------- */
export default function CompteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

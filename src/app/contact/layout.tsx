/* =============================================================================
 * app/contact/layout.tsx
 *
 * Layout serveur pour la page Contact de Dixipolis.
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Ce layout existe car la page Contact est un composant client ("use client")
 * qui utilise useState pour gerer l'etat du formulaire. Les composants client
 * ne peuvent pas exporter de metadata dans Next.js 15+.
 *
 * Responsabilites :
 *   - Exporter les metadonnees SEO (title, description) pour la page Contact
 *   - Transmettre les enfants (la page Contact elle-meme) sans modification
 *
 * Le titre sera automatiquement combine avec le template defini dans le
 * layout racine (ex: "Contact | Dixipolis").
 * ============================================================================= */

import type { Metadata } from "next";

/* --------------------------------------------------------------------------
 * METADONNEES SEO — Titre et description de la page Contact
 * Surcharge le template defini dans le layout racine.
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'equipe Dixipolis. Question, partenariat ou support technique — nous vous repondons dans les 48 heures.",
};

/* --------------------------------------------------------------------------
 * ContactLayout — Composant layout minimal
 *
 * Ne fait que transmettre les enfants. Aucune modification du DOM.
 * Existe uniquement pour permettre l'export de metadata car la page
 * Contact est un composant client.
 * -------------------------------------------------------------------------- */
export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

/* =============================================================================
 * app/prompt/layout.tsx
 *
 * Layout intermediaire pour la section Prompt de Dixipolis.
 *
 * Ce fichier existe pour deux raisons :
 *   1. Exporter les metadonnees SEO (title, description) — impossible depuis
 *      un composant "use client" (page.tsx est "use client" pour le chat)
 *   2. Envelopper les enfants dans un conteneur semantique si necessaire
 *
 * Le layout est un Server Component, ce qui permet l'export de metadata
 * tout en laissant page.tsx etre un Client Component interactif.
 *
 * Utilisation :
 *   Ce layout est automatiquement applique par Next.js a toutes les routes
 *   sous /prompt (ex: /prompt, /prompt/historique, etc.)
 * ============================================================================= */

import type { Metadata } from "next";

/* --------------------------------------------------------------------------
 * METADONNEES SEO — Specifiques a la page Prompt
 *
 * Le titre utilise le template defini dans le root layout :
 *   "%s | Dixipolis" => "Prompt | Dixipolis"
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Prompt",
  description:
    "Interrogez la base de donnees des discours politiques francais. " +
    "Posez vos questions et retrouvez les verbatims exacts avec sources " +
    "video horodatees grace a l'intelligence artificielle Dixipolis.",
};

/* --------------------------------------------------------------------------
 * COMPOSANT LAYOUT
 *
 * Simple pass-through qui rend les enfants sans wrapper supplementaire.
 * Le root layout fournit deja le <main> avec le padding-top du header.
 * -------------------------------------------------------------------------- */
export default function PromptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

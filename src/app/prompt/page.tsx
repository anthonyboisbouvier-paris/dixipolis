/* =============================================================================
 * app/prompt/page.tsx
 *
 * Page "Prompt" de l'application Dixipolis.
 *
 * Cette page est le coeur de l'experience utilisateur : une interface de chat
 * de type ChatGPT permettant d'interroger la base de donnees des discours
 * politiques francais via l'IA.
 *
 * Architecture de mise en page :
 *   - La page occupe 100% de la hauteur du viewport MOINS la hauteur du header
 *     (64px, definie par --header-height dans globals.css)
 *   - Aucun PageWrapper n'est utilise : l'interface de chat gere elle-meme
 *     son scroll interne et sa disposition en plein ecran
 *   - Le composant ChatInterface remplit tout l'espace disponible
 *
 * Metadonnees SEO :
 *   - Titre et description optimises pour le referencement
 *   - Le contenu dynamique du chat n'est pas indexe (cote client)
 *
 * Utilisation :
 *   Route : /prompt
 *   Rendu : Server component (page) -> Client component (ChatInterface)
 * ============================================================================= */

import type { Metadata } from "next";
import ChatInterface from "@/components/prompt/ChatInterface";

/* --------------------------------------------------------------------------
 * METADONNEES SEO — Optimisation pour les moteurs de recherche
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Prompt — Interrogez le discours politique | Dixipolis",
  description:
    "Posez vos questions sur les declarations des politiciens francais. " +
    "Dixipolis retrouve les verbatims exacts avec sources video horodatees " +
    "grace a l'intelligence artificielle.",
};

/* --------------------------------------------------------------------------
 * PAGE PROMPT
 *
 * Conteneur plein ecran ajuste a la hauteur du viewport moins le header.
 * Le style utilise calc() avec la variable CSS --header-height pour garantir
 * une coherence parfaite avec le composant de navigation.
 * -------------------------------------------------------------------------- */
export default function PromptPage() {
  return (
    <main
      className="w-full"
      style={{ height: "calc(100vh - var(--header-height, 64px))" }}
    >
      {/* Interface de chat — composant client interactif */}
      <ChatInterface />
    </main>
  );
}

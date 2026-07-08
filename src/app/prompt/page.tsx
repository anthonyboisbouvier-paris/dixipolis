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
 *     (72px, definie par --header-height dans globals.css)
 *   - Aucun PageWrapper n'est utilise : l'interface de chat gere elle-meme
 *     son scroll interne et sa disposition en plein ecran
 *   - Le composant ChatInterface remplit tout l'espace disponible
 *   - PAS de padding-top supplementaire (gere par le root layout)
 *
 * Metadonnees SEO :
 *   - Exportees dans le fichier layout.tsx voisin (car ce composant est "use client")
 *   - Le contenu dynamique du chat n'est pas indexe (cote client)
 *
 * Utilisation :
 *   Route : /prompt
 *   Rendu : "use client" page -> ChatInterface
 * ============================================================================= */

"use client";

import { Suspense } from "react";
import ChatInterface from "@/components/prompt/ChatInterface";

/* --------------------------------------------------------------------------
 * PAGE PROMPT
 *
 * Conteneur plein ecran ajuste a la hauteur du viewport moins le header.
 * Le style utilise calc() avec la variable CSS --header-height pour garantir
 * une coherence parfaite avec le composant de navigation fixe.
 *
 * IMPORTANT :
 *   - Pas de padding-top : le root layout l'applique deja sur <main>
 *   - Pas de PageWrapper : le chat est plein-ecran (full-width)
 *   - Pas de Footer visible : l'interface chat occupe toute la hauteur
 * -------------------------------------------------------------------------- */
export default function PromptPage() {
  return (
    <div
      className="w-full"
      style={{ height: "calc(100vh - var(--header-height, 72px))" }}
    >
      {/* Interface de chat — composant client interactif.
          Suspense requis : ChatInterface lit ?q= via useSearchParams
          (recherche initiale lancée automatiquement depuis la homepage). */}
      <Suspense fallback={null}>
        <ChatInterface />
      </Suspense>
    </div>
  );
}

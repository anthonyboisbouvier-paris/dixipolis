/* =============================================================================
 * components/layout/PageWrapper.tsx
 *
 * Composant enveloppe (wrapper) pour le contenu principal des pages.
 *
 * Responsabilites :
 *   - Applique la classe "page-container" definie dans globals.css, qui fournit :
 *       > Largeur maximale (--max-content-width : 1280px)
 *       > Centrage horizontal (margin auto)
 *       > Padding lateral responsive (1rem mobile, 1.5rem tablette, 2rem desktop)
 *   - Ajoute un padding-top de 64px (var(--header-height)) pour compenser
 *     le header fixe et eviter que le contenu ne soit masque derriere lui.
 *   - Utilise la balise semantique <main> pour indiquer le contenu principal
 *     de la page aux lecteurs d'ecran et aux moteurs de recherche.
 *
 * Ce composant est volontairement simple et sans etat (composant serveur).
 * Il sert de fondation commune a toutes les pages de l'application.
 *
 * Props :
 *   - children  : contenu de la page (React.ReactNode)
 *   - className : classes CSS supplementaires optionnelles, fusionnees via cn()
 *
 * Utilisation typique :
 *   <PageWrapper>
 *     <h1>Titre de la page</h1>
 *     <p>Contenu de la page...</p>
 *   </PageWrapper>
 *
 * Avec classes supplementaires :
 *   <PageWrapper className="py-12">
 *     <SomeComponent />
 *   </PageWrapper>
 * ============================================================================= */

import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Types — Props du composant PageWrapper
 * -------------------------------------------------------------------------- */
interface PageWrapperProps {
  /** Contenu de la page a afficher dans le wrapper */
  children: React.ReactNode;

  /** Classes CSS supplementaires a appliquer sur la balise <main> */
  className?: string;
}

/* --------------------------------------------------------------------------
 * PageWrapper — Composant principal
 *
 * Enveloppe le contenu de chaque page avec :
 *   1. La balise <main> pour la semantique HTML
 *   2. Le padding-top pour compenser le header fixe
 *   3. La classe page-container pour le centrage et la largeur max
 *   4. Les classes supplementaires passees en prop
 * -------------------------------------------------------------------------- */
export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main
      className={cn(
        // Classe utilitaire globale : centrage + largeur max + padding lateral
        "page-container",
        // Padding superieur pour compenser la hauteur du header fixe (64px).
        // On utilise la variable CSS pour rester synchronise avec la valeur
        // definie dans globals.css (--header-height: 64px).
        "pt-[var(--header-height)]",
        // Classes supplementaires fournies par la page appelante
        className
      )}
    >
      {children}
    </main>
  );
}

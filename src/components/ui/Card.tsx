/* =============================================================================
 * components/ui/Card.tsx
 *
 * Composant carte réutilisable pour l'application Dixipolis.
 *
 * Fournit un conteneur structuré avec en-tête, corps et pied de page
 * optionnels. Utilisé pour afficher du contenu regroupé : articles,
 * profils de politiciens, résultats de recherche, etc.
 *
 * Fonctionnalités :
 *   - En-tête optionnel (Card.Header) avec séparateur
 *   - Corps principal (Card.Body) avec padding cohérent
 *   - Pied de page optionnel (Card.Footer) avec séparateur
 *   - Mode interactif : effet hover avec élévation et translation
 *   - Entièrement personnalisable via className
 *   - Peut être rendu comme un <a> lien via la prop "href"
 *
 * Utilisation :
 *   <Card>
 *     <Card.Header>
 *       <h3>Titre de la carte</h3>
 *     </Card.Header>
 *     <Card.Body>
 *       <p>Contenu principal de la carte.</p>
 *     </Card.Body>
 *     <Card.Footer>
 *       <Button variant="ghost">Voir plus</Button>
 *     </Card.Footer>
 *   </Card>
 *
 *   <Card interactive href="/article/1">
 *     <Card.Body>Carte cliquable</Card.Body>
 *   </Card>
 * ============================================================================= */

import type { ReactNode, HTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Props du composant Card (conteneur principal)
 * -------------------------------------------------------------------------- */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Contenu de la carte (Header, Body, Footer, ou contenu libre) */
  children: ReactNode;

  /** Active l'effet hover interactif (élévation + translation) */
  interactive?: boolean;

  /** Si fourni, la carte entière devient un lien cliquable <a> */
  href?: string;

  /** Attributs de lien supplémentaires (target, rel, etc.) */
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

  /** Classes CSS supplémentaires */
  className?: string;
}

/* --------------------------------------------------------------------------
 * Props partagées pour les sous-composants (Header, Body, Footer)
 * -------------------------------------------------------------------------- */
interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/* --------------------------------------------------------------------------
 * Composant principal Card
 *
 * Utilise les variables CSS de globals.css pour les couleurs, ombres et
 * rayons de bordure. L'aspect est cohérent avec la classe .card définie
 * dans les styles globaux, mais entièrement contrôlé via Tailwind ici.
 * -------------------------------------------------------------------------- */
function CardRoot({
  children,
  interactive = false,
  href,
  linkProps,
  className,
  ...restProps
}: CardProps) {
  /* Classes communes : fond, bordure, ombre, arrondi */
  const cardClasses = cn(
    /* Surface : fond blanc, bordure subtile, ombre légère */
    "bg-[var(--color-bg-card)]",
    "border border-[var(--color-border)]",
    "rounded-[var(--radius-lg)]",
    "shadow-[var(--shadow-card)]",

    /* Transition fluide pour l'ombre et la translation */
    "transition-all duration-[var(--transition-normal)]",

    /* Débordement masqué pour respecter les coins arrondis */
    "overflow-hidden",

    /* Mode interactif : élévation et translation au hover */
    interactive && [
      "cursor-pointer",
      "hover:shadow-[var(--shadow-lg)]",
      "hover:-translate-y-0.5",
      "active:shadow-[var(--shadow-md)]",
      "active:translate-y-0",
    ],

    /* Classes personnalisées */
    className
  );

  /*
   * Si un href est fourni, on enveloppe tout dans un <a>.
   * Cela rend la carte entière cliquable comme un lien.
   */
  if (href) {
    return (
      <a
        href={href}
        className={cn(cardClasses, "block no-underline text-inherit")}
        {...linkProps}
      >
        {/* Le div interne conserve la sémantique de section */}
        <div {...restProps}>{children}</div>
      </a>
    );
  }

  /* Rendu standard en <div> */
  return (
    <div className={cardClasses} {...restProps}>
      {children}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Sous-composant Card.Header
 *
 * Affiche un en-tête avec un séparateur inférieur.
 * Idéal pour les titres, les icônes de statut ou les actions.
 * -------------------------------------------------------------------------- */
function CardHeader({ children, className, ...restProps }: CardSectionProps) {
  return (
    <div
      className={cn(
        "px-5 py-4",
        "border-b border-[var(--color-border)]",
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Sous-composant Card.Body
 *
 * Zone de contenu principale de la carte.
 * Fournit un padding cohérent.
 * -------------------------------------------------------------------------- */
function CardBody({ children, className, ...restProps }: CardSectionProps) {
  return (
    <div
      className={cn("px-5 py-4", className)}
      {...restProps}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Sous-composant Card.Footer
 *
 * Pied de page avec séparateur supérieur.
 * Utilisé pour les actions, liens "voir plus", métadonnées.
 * -------------------------------------------------------------------------- */
function CardFooter({ children, className, ...restProps }: CardSectionProps) {
  return (
    <div
      className={cn(
        "px-5 py-3",
        "border-t border-[var(--color-border)]",
        "bg-[var(--color-bg-section)]",
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Export composé
 *
 * Permet l'utilisation avec la syntaxe pointée :
 *   <Card>
 *     <Card.Header>...</Card.Header>
 *     <Card.Body>...</Card.Body>
 *     <Card.Footer>...</Card.Footer>
 *   </Card>
 * -------------------------------------------------------------------------- */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

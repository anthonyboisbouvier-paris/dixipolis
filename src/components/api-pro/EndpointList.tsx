/* =============================================================================
 * components/api-pro/EndpointList.tsx
 *
 * Section listant les endpoints disponibles de l'API Dixipolis.
 *
 * Affiche une liste structuree de 6 endpoints REST avec pour chacun :
 *   - Un badge de methode HTTP colore (GET = vert, POST = bleu)
 *   - Le chemin de l'endpoint (path) en police monospace
 *   - Une description courte en francais
 *
 * Endpoints presentes :
 *   1. GET  /api/v1/search          — Recherche semantique
 *   2. GET  /api/v1/politicians     — Liste des politiciens
 *   3. GET  /api/v1/politicians/:id — Details d'un politicien
 *   4. GET  /api/v1/excerpts        — Extraits de discours
 *   5. GET  /api/v1/themes          — Themes et statistiques
 *   6. POST /api/v1/analyze         — Analyse thematique
 *
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Design :
 *   - Fond blanc pour la section
 *   - Chaque ligne est un element de liste avec separateurs
 *   - Badges de methode avec coins arrondis et couleurs distinctes
 *   - Police monospace pour les chemins d'endpoint
 *   - Responsive : sur mobile, le path passe sous le badge
 * ============================================================================= */

import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Types — Structure d'un endpoint API
 * -------------------------------------------------------------------------- */
interface ApiEndpoint {
  /** Identifiant unique pour la cle React */
  id: string;
  /** Methode HTTP (GET ou POST) */
  method: "GET" | "POST";
  /** Chemin de l'endpoint (ex: /api/v1/search) */
  path: string;
  /** Description courte en francais */
  description: string;
}

/* --------------------------------------------------------------------------
 * Donnees statiques — Les 6 endpoints de l'API Dixipolis
 *
 * Ces donnees sont definies ici car elles sont specifiques a cette page
 * et ne sont pas reutilisees ailleurs dans l'application.
 * Lorsque la documentation OpenAPI sera generee, ces donnees pourront
 * etre remplacees par une source dynamique.
 * -------------------------------------------------------------------------- */
const endpoints: ApiEndpoint[] = [
  {
    id: "search",
    method: "GET",
    path: "/api/v1/search",
    description:
      "Recherche s\u00e9mantique dans l\u2019ensemble des discours index\u00e9s. Supporte les filtres par politicien, parti, date et th\u00e8me.",
  },
  {
    id: "politicians-list",
    method: "GET",
    path: "/api/v1/politicians",
    description:
      "Liste pagin\u00e9e de tous les politiciens index\u00e9s avec leur parti, r\u00f4le et nombre de discours.",
  },
  {
    id: "politician-detail",
    method: "GET",
    path: "/api/v1/politicians/:id",
    description:
      "D\u00e9tails complets d\u2019un politicien : biographie, th\u00e8mes principaux, statistiques et derniers discours.",
  },
  {
    id: "excerpts",
    method: "GET",
    path: "/api/v1/excerpts",
    description:
      "Extraits de discours avec verbatim, lien vid\u00e9o horodat\u00e9, m\u00e9tadonn\u00e9es compl\u00e8tes et score de pertinence.",
  },
  {
    id: "themes",
    method: "GET",
    path: "/api/v1/themes",
    description:
      "Th\u00e8mes d\u00e9tect\u00e9s avec statistiques agr\u00e9g\u00e9es : nombre de mentions, tendance et r\u00e9partition par parti.",
  },
  {
    id: "analyze",
    method: "POST",
    path: "/api/v1/analyze",
    description:
      "Analyse th\u00e9matique d\u2019un texte soumis. Retourne les th\u00e8mes d\u00e9tect\u00e9s, le sentiment et les politiciens associ\u00e9s.",
  },
];

/* --------------------------------------------------------------------------
 * Classes de style pour les badges de methode HTTP
 *
 * GET  : fond vert clair, texte vert fonce — lecture seule, safe
 * POST : fond bleu clair, texte bleu fonce — action, ecriture
 * -------------------------------------------------------------------------- */
const methodStyles: Record<"GET" | "POST", string> = {
  GET: "bg-green-50 text-green-700 border-green-200",
  POST: "bg-blue-50 text-blue-700 border-blue-200",
};

/* --------------------------------------------------------------------------
 * EndpointList — Composant principal de la section endpoints
 *
 * Structure :
 *   1. En-tete de section (titre + sous-titre)
 *   2. Conteneur de la liste avec bordure et coins arrondis
 *   3. Elements de liste separes par des bordures horizontales
 * -------------------------------------------------------------------------- */
export default function EndpointList() {
  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Liste des endpoints de l'API Dixipolis"
    >
      <div className="page-container">
        {/* ----------------------------------------------------------------
         * En-tete de section
         * Titre avec icone Server et description.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            <Server className="h-3.5 w-3.5" aria-hidden="true" />
            Endpoints
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Endpoints disponibles
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Tous les endpoints de l&apos;API Dixipolis en un coup d&apos;oeil.
            Chaque endpoint retourne des donn&eacute;es JSON structur&eacute;es.
          </p>
        </div>

        {/* ----------------------------------------------------------------
         * Conteneur de la liste d'endpoints
         * Carte blanche avec bordure, coins arrondis et ombre legere.
         * Chaque endpoint est un element de liste avec separateur.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
          {/* En-tete du tableau */}
          <div className="hidden items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-section)] px-6 py-3 sm:flex">
            <span className="w-20 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              M&eacute;thode
            </span>
            <span className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Endpoint
            </span>
            <span className="hidden text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] lg:block lg:w-80">
              Description
            </span>
          </div>

          {/* Liste des endpoints */}
          <ul role="list">
            {endpoints.map((endpoint, index) => (
              <EndpointRow
                key={endpoint.id}
                endpoint={endpoint}
                isLast={index === endpoints.length - 1}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * EndpointRow — Ligne individuelle d'un endpoint
 *
 * Props :
 *   - endpoint : objet ApiEndpoint contenant les informations de l'endpoint
 *   - isLast   : indique si c'est le dernier element (pas de bordure en bas)
 *
 * Layout responsive :
 *   - Mobile : badge methode + path empiles, description en dessous
 *   - Desktop : badge methode | path | description sur une seule ligne
 * -------------------------------------------------------------------------- */
function EndpointRow({
  endpoint,
  isLast,
}: {
  endpoint: ApiEndpoint;
  isLast: boolean;
}) {
  const { method, path, description } = endpoint;

  return (
    <li
      className={cn(
        /* Base : padding, flex, alignement */
        "flex flex-col gap-2 px-6 py-4 transition-colors duration-[var(--transition-fast)] hover:bg-[var(--color-bg-section)] sm:flex-row sm:items-center sm:gap-4",
        /* Bordure en bas sauf pour le dernier element */
        !isLast && "border-b border-[var(--color-border)]"
      )}
    >
      {/* Badge de methode HTTP */}
      <span
        className={cn(
          /* Base : inline-flex, centre, arrondi, police mono, bordure */
          "inline-flex w-fit shrink-0 items-center justify-center rounded-[var(--radius-sm)] border px-2.5 py-1 font-mono text-xs font-bold sm:w-20",
          /* Couleur conditionnelle selon la methode */
          methodStyles[method]
        )}
      >
        {method}
      </span>

      {/* Chemin de l'endpoint en police monospace */}
      <span className="min-w-0 flex-1 font-mono text-sm font-medium text-[var(--color-text-primary)]">
        {path}
      </span>

      {/* Description de l'endpoint */}
      <span className="text-sm leading-relaxed text-[var(--color-text-secondary)] lg:w-80 lg:shrink-0">
        {description}
      </span>
    </li>
  );
}

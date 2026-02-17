/* =============================================================================
 * components/api-pro/EndpointList.tsx
 *
 * Liste des endpoints de l'API Dixipolis.
 * Mise a jour pour refleter les 5 vrais endpoints des tickets Linear :
 *   1. POST /search/semantic   — Recherche semantique (DIX-17)
 *   2. POST /search/text       — Recherche textuelle exacte (DIX-18)
 *   3. POST /videos/list       — Inventaire des videos (DIX-19)
 *   4. POST /context/expand    — Enrichissement contextuel (DIX-20)
 *   5. POST /entities/match    — Resolution d'entites (DIX-21)
 *
 * Composant serveur (Server Component) — pas de "use client".
 * ============================================================================= */

import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
interface ApiEndpoint {
  id: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  tag: string;
}

/* --------------------------------------------------------------------------
 * Les 5 endpoints reels de l'API Dixipolis (issus des tickets Linear).
 * -------------------------------------------------------------------------- */
const endpoints: ApiEndpoint[] = [
  {
    id: "semantic-search",
    method: "POST",
    path: "/search/semantic",
    description:
      "Recherche par proximit\u00e9 s\u00e9mantique dans les discours. Retrouve des passages par le sens, m\u00eame sans correspondance de mots exacts. Filtres par politicien, parti, th\u00e8me et p\u00e9riode.",
    tag: "Recherche",
  },
  {
    id: "text-search",
    method: "POST",
    path: "/search/text",
    description:
      "Recherche lexicale stricte (full-text). Id\u00e9al pour retrouver des citations, chiffres ou expressions pr\u00e9cises. Chaque r\u00e9sultat inclut le verbatim exact et le lien vid\u00e9o horodat\u00e9.",
    tag: "Recherche",
  },
  {
    id: "videos-list",
    method: "POST",
    path: "/videos/list",
    description:
      "Liste les vid\u00e9os par politicien, parti ou th\u00e9matique sur une p\u00e9riode donn\u00e9e. Outil d\u2019inventaire pour construire des corpus cibl\u00e9s avant analyse.",
    tag: "Inventaire",
  },
  {
    id: "context-expand",
    method: "POST",
    path: "/context/expand",
    description:
      "R\u00e9cup\u00e8re le contexte autour d\u2019un segment : tour de parole seul, avec contexte (tours pr\u00e9c\u00e9dent/suivant), ou transcript complet de la vid\u00e9o.",
    tag: "Contexte",
  },
  {
    id: "entities-match",
    method: "POST",
    path: "/entities/match",
    description:
      "R\u00e9sout une entit\u00e9 politique (personne, parti ou th\u00e8me) vers un ID en base avec score de confiance. Un appel = un type d\u2019entit\u00e9.",
    tag: "Entit\u00e9s",
  },
];

/* -------------------------------------------------------------------------- */
const methodStyles: Record<"GET" | "POST", string> = {
  GET: "bg-green-50 text-green-700 border-green-200",
  POST: "bg-blue-50 text-blue-700 border-blue-200",
};

const tagStyles: Record<string, string> = {
  Recherche: "bg-purple-50 text-purple-700",
  Inventaire: "bg-orange-50 text-orange-700",
  Contexte: "bg-teal-50 text-teal-700",
  "Entit\u00e9s": "bg-pink-50 text-pink-700",
};

/* -------------------------------------------------------------------------- */
export default function EndpointList() {
  return (
    <section
      id="documentation"
      className="bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Endpoints de l'API Dixipolis"
    >
      <div className="page-container">
        {/* En-tete */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            <Server className="h-3.5 w-3.5" aria-hidden="true" />
            5 Endpoints
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Endpoints de l&apos;API
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Cinq outils con&ccedil;us pour &ecirc;tre utilis&eacute;s par un agent IA.
            Chaque endpoint est d&eacute;terministe, sourc&eacute; et compatible avec un usage interactif.
          </p>
        </div>

        {/* Liste */}
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

/* -------------------------------------------------------------------------- */
function EndpointRow({
  endpoint,
  isLast,
}: {
  endpoint: ApiEndpoint;
  isLast: boolean;
}) {
  const { method, path, description, tag } = endpoint;

  return (
    <li
      className={cn(
        "flex flex-col gap-2 px-6 py-4 transition-colors duration-[var(--transition-fast)] hover:bg-[var(--color-bg-section)] sm:flex-row sm:items-center sm:gap-4",
        !isLast && "border-b border-[var(--color-border)]"
      )}
    >
      {/* Badge methode HTTP */}
      <span
        className={cn(
          "inline-flex w-fit shrink-0 items-center justify-center rounded-[var(--radius-sm)] border px-2.5 py-1 font-mono text-xs font-bold sm:w-20",
          methodStyles[method]
        )}
      >
        {method}
      </span>

      {/* Chemin + tag */}
      <div className="min-w-0 flex-1">
        <span className="font-mono text-sm font-medium text-[var(--color-text-primary)]">
          {path}
        </span>
        <span
          className={cn(
            "ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
            tagStyles[tag] ?? "bg-gray-50 text-gray-600"
          )}
        >
          {tag}
        </span>
      </div>

      {/* Description */}
      <span className="text-sm leading-relaxed text-[var(--color-text-secondary)] lg:w-80 lg:shrink-0">
        {description}
      </span>
    </li>
  );
}

/* =============================================================================
 * components/analytique/ActivityTimeline.tsx
 *
 * Composant Server : chronologie visuelle des activites politiques recentes.
 * Presente une timeline verticale avec une ligne continue a gauche et
 * des points colores pour chaque evenement. Chaque entree montre :
 *   - La date de l'evenement
 *   - Une description de l'activite
 *   - Le politicien concerne
 *   - Un indicateur visuel (point colore sur la ligne verticale)
 *
 * Les donnees sont actuellement en mock et seront remplacees par des
 * appels API une fois le backend connecte.
 * ============================================================================= */

import { cn, formatDate } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Interface pour un evenement de la timeline
 * -------------------------------------------------------------------------- */
interface TimelineEvent {
  /** Identifiant unique de l'evenement */
  id: string;
  /** Date de l'evenement au format ISO */
  date: string;
  /** Description textuelle de l'evenement */
  description: string;
  /** Nom du politicien concerne */
  politician: string;
  /** Categorie de l'evenement (determine la couleur du point) */
  category: "discours" | "declaration" | "vote" | "publication";
}

/* --------------------------------------------------------------------------
 * Donnees mock de la timeline
 * Activites recentes fictives pour la demonstration du composant.
 * -------------------------------------------------------------------------- */
const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "evt-1",
    date: "2025-01-15T14:30:00Z",
    description:
      "Discours sur la politique economique et la reindustrialisation de la France lors d'une visite d'usine dans le Nord.",
    politician: "Emmanuel Macron",
    category: "discours",
  },
  {
    id: "evt-2",
    date: "2025-01-14T10:00:00Z",
    description:
      "Declaration sur le projet de loi immigration a l'Assemblee nationale, critiquant les mesures proposees.",
    politician: "Marine Le Pen",
    category: "declaration",
  },
  {
    id: "evt-3",
    date: "2025-01-13T16:45:00Z",
    description:
      "Vote sur le budget 2025 a l'Assemblee nationale. Position contre les coupes dans les services publics.",
    politician: "Jean-Luc Melenchon",
    category: "vote",
  },
  {
    id: "evt-4",
    date: "2025-01-12T09:15:00Z",
    description:
      "Publication d'une tribune sur les enjeux de la jeunesse et de l'emploi dans un quotidien national.",
    politician: "Jordan Bardella",
    category: "publication",
  },
  {
    id: "evt-5",
    date: "2025-01-11T11:30:00Z",
    description:
      "Discours a l'Assemblee nationale sur la reforme de l'education et le decrochage scolaire.",
    politician: "Gabriel Attal",
    category: "discours",
  },
  {
    id: "evt-6",
    date: "2025-01-10T15:00:00Z",
    description:
      "Declaration sur les conditions de travail dans l'industrie agroalimentaire en Picardie.",
    politician: "Francois Ruffin",
    category: "declaration",
  },
  {
    id: "evt-7",
    date: "2025-01-09T08:45:00Z",
    description:
      "Discours lors du Conseil europeen sur la defense et la securite du continent.",
    politician: "Emmanuel Macron",
    category: "discours",
  },
];

/* --------------------------------------------------------------------------
 * Couleurs des points de la timeline selon la categorie de l'evenement
 * -------------------------------------------------------------------------- */
const CATEGORY_COLORS: Record<TimelineEvent["category"], string> = {
  discours: "bg-blue-500",
  declaration: "bg-emerald-500",
  vote: "bg-violet-500",
  publication: "bg-amber-500",
};

/* --------------------------------------------------------------------------
 * Labels des categories en francais
 * -------------------------------------------------------------------------- */
const CATEGORY_LABELS: Record<TimelineEvent["category"], string> = {
  discours: "Discours",
  declaration: "Declaration",
  vote: "Vote",
  publication: "Publication",
};

/* --------------------------------------------------------------------------
 * TimelineItem — Element individuel de la chronologie
 * Affiche un evenement avec son point colore, sa date,
 * la description et le nom du politicien.
 * -------------------------------------------------------------------------- */
function TimelineItem({
  event,
  isLast,
}: {
  event: TimelineEvent;
  isLast: boolean;
}) {
  const dotColor = CATEGORY_COLORS[event.category];
  const categoryLabel = CATEGORY_LABELS[event.category];

  return (
    <div className="relative flex gap-4">
      {/* -- Colonne gauche : ligne verticale + point colore -- */}
      <div className="flex flex-col items-center">
        {/* Point colore de la timeline */}
        <div
          className={cn(
            "relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
            "ring-4 ring-white",
            dotColor
          )}
        />

        {/* Ligne verticale continue (masquee pour le dernier element) */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gray-200" />
        )}
      </div>

      {/* -- Colonne droite : contenu de l'evenement -- */}
      <div className={cn("pb-8", isLast && "pb-0")}>
        {/* Date + badge de categorie */}
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <time
            dateTime={event.date}
            className="text-xs font-medium text-gray-500"
          >
            {formatDate(event.date, {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>

          {/* Badge de categorie */}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5",
              "text-[10px] font-semibold uppercase tracking-wide",
              "bg-gray-100 text-gray-600"
            )}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Description de l'evenement */}
        <p className="text-sm leading-relaxed text-gray-700">
          {event.description}
        </p>

        {/* Nom du politicien */}
        <p className="mt-1.5 text-xs font-medium text-blue-600">
          {event.politician}
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * ActivityTimeline — Chronologie des activites recentes
 * Composant principal exporte. Affiche la timeline complete dans une
 * carte blanche avec ombre, coherente avec le design du tableau de bord.
 * -------------------------------------------------------------------------- */
export default function ActivityTimeline() {
  return (
    <section
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      )}
      aria-label="Chronologie des activites recentes"
    >
      {/* -- En-tete de la section -- */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Activite recente
        </h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Derniers evenements politiques indexes par la plateforme
        </p>
      </div>

      {/* -- Timeline verticale -- */}
      <div className="ml-1">
        {MOCK_TIMELINE_EVENTS.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={index === MOCK_TIMELINE_EVENTS.length - 1}
          />
        ))}
      </div>

      {/* -- Legende des categories -- */}
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
        <span className="text-xs font-medium text-gray-400">Legende :</span>
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
            <span className="text-xs text-gray-500">
              {CATEGORY_LABELS[category as TimelineEvent["category"]]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

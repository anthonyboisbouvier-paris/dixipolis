/* ActivityTimeline.tsx - Composant Server : chronologie visuelle des activites politiques.
 * DESIGN PREMIUM : points colores avec ring blanc, ligne verticale via CSS variables,
 * badges de categorie, legende en bas. Pas de couleurs Tailwind brutes. */

import { cn, formatDate } from "@/lib/utils";

interface TimelineEvent {
  id: string; date: string; description: string; politician: string;
  category: "discours" | "declaration" | "vote" | "publication";
}

const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "evt-1", date: "2025-01-15T14:30:00Z", description: "Discours sur la politique economique et la reindustrialisation de la France lors d'une visite d'usine dans le Nord.", politician: "Emmanuel Macron", category: "discours" },
  { id: "evt-2", date: "2025-01-14T10:00:00Z", description: "Declaration sur le projet de loi immigration a l'Assemblee nationale, critiquant les mesures proposees.", politician: "Marine Le Pen", category: "declaration" },
  { id: "evt-3", date: "2025-01-13T16:45:00Z", description: "Vote sur le budget 2025 a l'Assemblee nationale. Position contre les coupes dans les services publics.", politician: "Jean-Luc Melenchon", category: "vote" },
  { id: "evt-4", date: "2025-01-12T09:15:00Z", description: "Publication d'une tribune sur les enjeux de la jeunesse et de l'emploi dans un quotidien national.", politician: "Jordan Bardella", category: "publication" },
  { id: "evt-5", date: "2025-01-11T11:30:00Z", description: "Discours a l'Assemblee nationale sur la reforme de l'education et le decrochage scolaire.", politician: "Gabriel Attal", category: "discours" },
  { id: "evt-6", date: "2025-01-10T15:00:00Z", description: "Declaration sur les conditions de travail dans l'industrie agroalimentaire en Picardie.", politician: "Francois Ruffin", category: "declaration" },
  { id: "evt-7", date: "2025-01-09T08:45:00Z", description: "Discours lors du Conseil europeen sur la defense et la securite du continent.", politician: "Emmanuel Macron", category: "discours" },
];

const CATEGORY_COLORS: Record<TimelineEvent["category"], string> = {
  discours: "var(--color-primary)", declaration: "var(--color-success)", vote: "#8b5cf6", publication: "#f59e0b",
};
const CATEGORY_LABELS: Record<TimelineEvent["category"], string> = {
  discours: "Discours", declaration: "Declaration", vote: "Vote", publication: "Publication",
};

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const dotColor = CATEGORY_COLORS[event.category];
  const categoryLabel = CATEGORY_LABELS[event.category];
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: dotColor, boxShadow: "0 0 0 4px var(--color-bg-card)" }} />
        {!isLast && <div className="w-0.5 flex-1" style={{ backgroundColor: "var(--color-border)" }} />}
      </div>
      <div className={cn("pb-8", isLast && "pb-0")}>
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <time dateTime={event.date} className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{formatDate(event.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</time>
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: "var(--color-bg-section)", color: "var(--color-text-secondary)" }}>{categoryLabel}</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{event.description}</p>
        <p className="mt-1.5 text-xs font-medium" style={{ color: "var(--color-primary)" }}>{event.politician}</p>
      </div>
    </div>
  );
}

export default function ActivityTimeline() {
  return (
    <section className="card p-6" aria-label="Chronologie des activites recentes">
      <div className="mb-6">
        <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>Activite recente</h2>
        <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>Derniers evenements politiques indexes par la plateforme</p>
      </div>
      <div className="ml-1">
        {MOCK_TIMELINE_EVENTS.map((event, index) => (
          <TimelineItem key={event.id} event={event} isLast={index === MOCK_TIMELINE_EVENTS.length - 1} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
        <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Legende :</span>
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <div key={category} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{CATEGORY_LABELS[category as TimelineEvent["category"]]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

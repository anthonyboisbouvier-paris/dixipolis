/* =============================================================================
 * components/analytique/StatsOverview.tsx
 *
 * Composant Server : affiche 4 cartes statistiques en ligne horizontale.
 * Chaque carte presente une metrique cle du tableau de bord Dixipolis :
 *   1. Total des discours indexes
 *   2. Nombre de politiciens suivis
 *   3. Heures de contenu analysees
 *   4. Date de la derniere mise a jour
 *
 * DESIGN PREMIUM :
 *   - Utilise la classe .card pour le fond, bordure, ombre et coins arrondis
 *   - Toutes les couleurs via CSS variables (pas de raw Tailwind)
 *   - Icones dans des cercles arrondis avec fond primaire leger
 *   - Indicateurs de variation colores selon la tendance
 *   - Animation entree via .stagger-children
 *
 * Ce composant est un Server Component (pas de use client).
 * ============================================================================= */

import { BarChart3, Users, Activity, Calendar } from "lucide-react";
import { cn, formatNumber, formatDate } from "@/lib/utils";
/* --------------------------------------------------------------------------
 * Interface pour une carte statistique individuelle
 * -------------------------------------------------------------------------- */
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changePositive?: boolean;
}

/* --------------------------------------------------------------------------
 * StatCard — Carte individuelle affichant une statistique
 * Design : .card + icone dans cercle var(--color-primary-light)
 * -------------------------------------------------------------------------- */
function StatCard({ label, value, icon, change, changePositive }: StatCardProps) {
  return (
    <div className={cn("card flex items-center gap-4 p-5")}>
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: "var(--color-primary-light)" }}
      >
        <div style={{ color: "var(--color-primary)" }}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {value}
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </p>
        {change && (
          <p
            className="mt-0.5 text-xs font-semibold"
            style={{
              color: changePositive
                ? "var(--color-success)"
                : "var(--color-error, #ef4444)",
            }}
          >
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * StatsOverview — Grille de 4 cartes statistiques
 * Responsive : 1 col mobile / 2 col tablette / 4 col desktop.
 * Animation : .stagger-children applique un delai progressif.
 * -------------------------------------------------------------------------- */
export default function StatsOverview() {
  const lastUpdateDate = formatDate("2025-01-15T14:30:00Z", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const stats: StatCardProps[] = [
    {
      label: "Discours indexes",
      value: formatNumber(45230),
      icon: <BarChart3 className="h-6 w-6" />,
      change: "+8.2% ce mois",
      changePositive: true,
    },
    {
      label: "Politiciens suivis",
      value: "2 000+",
      icon: <Users className="h-6 w-6" />,
      change: "+24 nouveaux",
      changePositive: true,
    },
    {
      label: "Heures analysees",
      value: "10 500+",
      icon: <Activity className="h-6 w-6" />,
      change: "+320h ce mois",
      changePositive: true,
    },
    {
      label: "Derniere mise a jour",
      value: lastUpdateDate,
      icon: <Calendar className="h-6 w-6" />,
    },
  ];

  return (
    <section aria-label="Statistiques generales">
      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

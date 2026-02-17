/* =============================================================================
 * components/analytique/StatsOverview.tsx
 *
 * 6 cartes statistiques pour le dashboard analytique Dixipolis.
 * Mise a jour pour refleter les vrais KPI des tickets Linear :
 *   - Discours indexes, politiciens, heures, fact-checks, propagande, toxicite
 *
 * Chaque carte a une micro-barre de progression visuelle et une tendance.
 * Composant serveur (Server Component).
 * ============================================================================= */

import {
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changePositive?: boolean;
  progressPercent: number;
  progressColor: string;
  iconBg: string;
  iconColor: string;
}

/* -------------------------------------------------------------------------- */
function StatCard({
  label,
  value,
  icon,
  change,
  changePositive,
  progressPercent,
  progressColor,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
        {change && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold"
            style={{
              backgroundColor: changePositive
                ? "var(--color-success-light)"
                : "var(--color-error-light)",
              color: changePositive
                ? "var(--color-success)"
                : "var(--color-error)",
            }}
          >
            {change}
          </span>
        )}
      </div>

      <p
        className="text-2xl font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </p>
      <p className="mb-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>

      {/* Barre de progression */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--color-bg-section)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: progressColor,
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
export default function StatsOverview() {
  const stats: StatCardProps[] = [
    {
      label: "Discours index\u00e9s",
      value: formatNumber(45230),
      icon: <BarChart3 className="h-5 w-5" />,
      change: "+8.2%",
      changePositive: true,
      progressPercent: 72,
      progressColor: "var(--color-primary)",
      iconBg: "var(--color-primary-light)",
      iconColor: "var(--color-primary)",
    },
    {
      label: "Politiciens suivis",
      value: formatNumber(2048),
      icon: <Users className="h-5 w-5" />,
      change: "+24",
      changePositive: true,
      progressPercent: 85,
      progressColor: "var(--color-accent)",
      iconBg: "var(--color-accent-light)",
      iconColor: "var(--color-accent)",
    },
    {
      label: "Heures analys\u00e9es",
      value: formatNumber(10500) + "h",
      icon: <Clock className="h-5 w-5" />,
      change: "+320h",
      changePositive: true,
      progressPercent: 65,
      progressColor: "var(--color-success)",
      iconBg: "var(--color-success-light)",
      iconColor: "var(--color-success)",
    },
    {
      label: "Fact-checks effectu\u00e9s",
      value: formatNumber(3812),
      icon: <CheckCircle className="h-5 w-5" />,
      change: "+142",
      changePositive: true,
      progressPercent: 58,
      progressColor: "#10b981",
      iconBg: "#ecfdf5",
      iconColor: "#10b981",
    },
    {
      label: "Propagande d\u00e9tect\u00e9e",
      value: formatNumber(847),
      icon: <AlertTriangle className="h-5 w-5" />,
      change: "+12%",
      changePositive: false,
      progressPercent: 34,
      progressColor: "var(--color-warning)",
      iconBg: "var(--color-warning-light)",
      iconColor: "var(--color-warning)",
    },
    {
      label: "Score toxicit\u00e9 moyen",
      value: "0.23",
      icon: <Flame className="h-5 w-5" />,
      change: "-0.04",
      changePositive: true,
      progressPercent: 23,
      progressColor: "var(--color-error)",
      iconBg: "var(--color-error-light)",
      iconColor: "var(--color-error)",
    },
  ];

  return (
    <section aria-label="Statistiques g\u00e9n\u00e9rales">
      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

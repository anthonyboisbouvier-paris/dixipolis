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
 * Ce composant est un Server Component (pas de "use client") car il ne
 * necessite aucune interactivite cote navigateur.
 * ============================================================================= */

import { BarChart3, Users, Activity, Calendar } from "lucide-react";
import { cn, formatNumber, formatDate } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Interface pour une carte statistique individuelle
 * -------------------------------------------------------------------------- */
interface StatCardProps {
  /** Libelle descriptif de la statistique */
  label: string;
  /** Valeur affichee en grand (nombre formate ou texte) */
  value: string;
  /** Icone Lucide React a afficher dans la carte */
  icon: React.ReactNode;
  /** Couleur de fond de l'icone (classe Tailwind) */
  iconBgColor: string;
  /** Couleur de l'icone elle-meme (classe Tailwind) */
  iconColor: string;
}

/* --------------------------------------------------------------------------
 * StatCard — Carte individuelle affichant une statistique
 * Design : fond blanc, ombre legere, icone coloree a gauche,
 * valeur en gros et libelle en dessous.
 * -------------------------------------------------------------------------- */
function StatCard({ label, value, icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-gray-100",
        "bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      )}
    >
      {/* -- Conteneur de l'icone avec fond colore arrondi -- */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
          iconBgColor
        )}
      >
        <div className={iconColor}>{icon}</div>
      </div>

      {/* -- Texte : valeur + libelle -- */}
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-gray-900">
          {value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * StatsOverview — Grille de 4 cartes statistiques
 * Affiche les metriques principales du tableau de bord analytique.
 * Responsive : 1 colonne sur mobile, 2 sur tablette, 4 sur desktop.
 * -------------------------------------------------------------------------- */
export default function StatsOverview() {
  /* -- Date de la derniere mise a jour (donnee mock) -- */
  const lastUpdateDate = formatDate("2025-01-15T14:30:00Z", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  /* -- Definition des 4 cartes statistiques -- */
  const stats: StatCardProps[] = [
    {
      label: "Discours indexes",
      value: formatNumber(45230),
      icon: <BarChart3 className="h-6 w-6" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Politiciens suivis",
      value: "2 000+",
      icon: <Users className="h-6 w-6" />,
      iconBgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Heures analysees",
      value: "10 500+",
      icon: <Activity className="h-6 w-6" />,
      iconBgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Derniere mise a jour",
      value: lastUpdateDate,
      icon: <Calendar className="h-6 w-6" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <section aria-label="Statistiques generales">
      {/* -- Grille responsive : 1 col mobile / 2 col tablette / 4 col desktop -- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

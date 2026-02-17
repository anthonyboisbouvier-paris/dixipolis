/* =============================================================================
 * components/home/StatsSection.tsx
 *
 * Section de statistiques cles de la page d'accueil Dixipolis.
 * Affiche 4 indicateurs chiffres impressionnants pour etablir la credibilite
 * de la plateforme aupres des visiteurs.
 *
 * Composant serveur (Server Component) — pas de "use client".
 * Utilise formatNumber de "@/lib/utils" pour le formatage des nombres
 * avec separateur de milliers a la francaise (espace insecable).
 * ============================================================================= */

import { Users, Clock, Database, Zap } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Interface locale pour definir la structure d'un bloc statistique.
 * Chaque stat possede une valeur numerique, un label descriptif,
 * un suffixe optionnel (ex: "+") et une icone.
 * -------------------------------------------------------------------------- */
interface StatItem {
  /** Identifiant unique pour la cle React */
  id: string;
  /** Valeur numerique brute (sera formatee avec formatNumber) */
  value: number;
  /** Suffixe affiche apres le nombre (ex: "+", "M") */
  suffix: string;
  /** Label descriptif sous le nombre */
  label: string;
  /** Composant icone Lucide */
  icon: React.ComponentType<{ className?: string }>;
}

/* --------------------------------------------------------------------------
 * Donnees statiques des 4 indicateurs cles.
 *
 * Ces chiffres communiquent la taille et la pertinence de la base de donnees
 * Dixipolis. Ils seront remplaces par des donnees dynamiques lorsque
 * l'API backend sera disponible.
 *
 * Choix des metriques :
 *   - Heures indexees   : volume de contenu traite
 *   - Politiques suivis : couverture de la classe politique
 *   - Extraits          : granularite de l'indexation
 *   - Mises a jour/jour : fraicheur des donnees
 * -------------------------------------------------------------------------- */
const stats: StatItem[] = [
  {
    id: "hours",
    value: 10000,
    suffix: "+",
    label: "Heures index\u00e9es",
    icon: Clock,
  },
  {
    id: "politicians",
    value: 2000,
    suffix: "+",
    label: "Politiques suivis",
    icon: Users,
  },
  {
    id: "excerpts",
    value: 500000,
    suffix: "+",
    label: "Extraits analys\u00e9s",
    icon: Database,
  },
  {
    id: "updates",
    value: 150,
    suffix: "+",
    label: "Mises \u00e0 jour / jour",
    icon: Zap,
  },
];

/* --------------------------------------------------------------------------
 * StatsSection — Composant principal de la section statistiques
 *
 * Layout :
 *   - Fond blanc pour contraster avec les sections adjacentes (fond gris)
 *   - Grille 2x2 sur mobile, 4 colonnes sur desktop
 *   - Chaque bloc stat est centre avec icone, nombre et label
 *   - Separateurs visuels entre les blocs via bordure gauche (desktop)
 *
 * Accessibilite :
 *   - Chaque chiffre est encapsule dans un <p> semantique
 *   - Les icones sont decoratives (aria-hidden)
 *   - La section possede un aria-label descriptif
 * -------------------------------------------------------------------------- */
export default function StatsSection() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-label="Chiffres cles de la plateforme Dixipolis"
    >
      <div className="page-container">
        {/* ----------------------------------------------------------------
         * En-tete de section (optionnel mais renforce le contexte)
         * ---------------------------------------------------------------- */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Des donn&eacute;es &agrave; grande &eacute;chelle
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Notre plateforme indexe en continu le discours politique fran&ccedil;ais
            pour vous offrir la base de donn&eacute;es la plus exhaustive.
          </p>
        </div>

        {/* ----------------------------------------------------------------
         * Grille des 4 blocs statistiques
         *
         * Sur mobile : grille 2 colonnes
         * Sur desktop : grille 4 colonnes avec separateurs visuels
         *
         * Chaque bloc utilise un padding genereux et un alignement centre.
         * ---------------------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.id}
                className={cn(
                  "flex flex-col items-center text-center",
                  /* Separateur vertical sur desktop (sauf premier element) */
                  index > 0 && "lg:border-l lg:border-[var(--color-border)]"
                )}
              >
                {/* Icone decorative au-dessus du nombre */}
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)]"
                  aria-hidden="true"
                >
                  <Icon className="h-6 w-6 text-[var(--color-primary)]" />
                </div>

                {/* Nombre formate avec suffixe */}
                <p className="mb-1 text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
                  {formatNumber(stat.value)}
                  <span className="text-[var(--color-primary)]">{stat.suffix}</span>
                </p>

                {/* Label descriptif */}
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Fonction utilitaire cn — re-import local pour la lisibilite
 * (deja importee en haut du fichier)
 * -------------------------------------------------------------------------- */
// Note : cn est importe depuis "@/lib/utils" et utilise clsx pour combiner
// les classes CSS de maniere conditionnelle, ce qui permet d'ajouter
// les separateurs uniquement sur desktop et pas sur le premier element.

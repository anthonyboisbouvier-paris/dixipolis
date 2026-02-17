/* =============================================================================
 * components/analytique/TopPoliticians.tsx
 *
 * Composant Server : liste classee des politiciens les plus actifs.
 * Affiche un tableau visuel des politiciens tries par nombre de discours
 * indexes, avec pour chaque entree :
 *   - Rang (position dans le classement)
 *   - Nom complet du politicien
 *   - Badge du parti politique (abreviation coloree)
 *   - Nombre de discours indexes
 *   - Date de la derniere activite
 *
 * Chaque ligne est un lien cliquable vers la fiche du politicien
 * (/politicien/[slug]). Ce composant n'a pas besoin de "use client"
 * car il ne contient aucune logique interactive cote navigateur.
 * ============================================================================= */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn, formatNumber, formatDate } from "@/lib/utils";
import { MOCK_POLITICIANS } from "@/lib/constants";

/* --------------------------------------------------------------------------
 * Couleurs associees aux partis politiques
 * Mapping entre l'abreviation du parti et ses couleurs Tailwind (fond + texte).
 * Utilise pour le badge colore affiche a cote du nom du politicien.
 * -------------------------------------------------------------------------- */
const PARTY_COLORS: Record<string, { bg: string; text: string }> = {
  RE:   { bg: "bg-yellow-100", text: "text-yellow-800" },
  RN:   { bg: "bg-blue-900/10", text: "text-blue-900" },
  LFI:  { bg: "bg-red-100", text: "text-red-800" },
  LR:   { bg: "bg-blue-100", text: "text-blue-800" },
  PS:   { bg: "bg-pink-100", text: "text-pink-800" },
  EELV: { bg: "bg-green-100", text: "text-green-800" },
  PCF:  { bg: "bg-red-200", text: "text-red-900" },
  PD:   { bg: "bg-orange-100", text: "text-orange-800" },
};

/* --------------------------------------------------------------------------
 * Couleur par defaut si le parti n'est pas dans le mapping
 * -------------------------------------------------------------------------- */
const DEFAULT_PARTY_COLOR = { bg: "bg-gray-100", text: "text-gray-700" };

/* --------------------------------------------------------------------------
 * PartyBadge — Badge affichant l'abreviation du parti
 * Petit badge arrondi avec couleurs specifiques au parti.
 * -------------------------------------------------------------------------- */
function PartyBadge({ abbreviation }: { abbreviation: string }) {
  const colors = PARTY_COLORS[abbreviation] ?? DEFAULT_PARTY_COLOR;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        colors.bg,
        colors.text
      )}
    >
      {abbreviation}
    </span>
  );
}

/* --------------------------------------------------------------------------
 * RankBadge — Badge affichant le rang du politicien
 * Le top 3 recoit un style dore/argente/bronze ; les autres sont gris.
 * -------------------------------------------------------------------------- */
function RankBadge({ rank }: { rank: number }) {
  /* -- Couleurs speciales pour le podium -- */
  const podiumStyles: Record<number, string> = {
    1: "bg-amber-100 text-amber-800 border-amber-200",
    2: "bg-gray-100 text-gray-700 border-gray-200",
    3: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const style = podiumStyles[rank] ?? "bg-gray-50 text-gray-500 border-gray-100";

  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full",
        "border text-xs font-bold",
        style
      )}
    >
      {rank}
    </span>
  );
}

/* --------------------------------------------------------------------------
 * TopPoliticians — Classement des politiciens les plus actifs
 * Composant principal exporte. Affiche la liste classee dans une carte
 * blanche avec ombre legere, coherente avec le design global.
 * -------------------------------------------------------------------------- */
export default function TopPoliticians() {
  /* -- Tri des politiciens par nombre de discours (decroissant) -- */
  const rankedPoliticians = [...MOCK_POLITICIANS]
    .sort((a, b) => b.speechCount - a.speechCount)
    .slice(0, 10); // Limite aux 10 premiers

  return (
    <section
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      )}
      aria-label="Classement des politiciens"
    >
      {/* -- En-tete de la section -- */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Politiciens les plus actifs
        </h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Classes par nombre de discours indexes
        </p>
      </div>

      {/* -- En-tete de colonnes (masque sur mobile) -- */}
      <div className="mb-2 hidden items-center gap-3 px-3 text-xs font-medium uppercase tracking-wider text-gray-400 sm:flex">
        <span className="w-7 shrink-0 text-center">#</span>
        <span className="flex-1">Politicien</span>
        <span className="w-20 shrink-0 text-center">Parti</span>
        <span className="w-20 shrink-0 text-right">Discours</span>
        <span className="w-28 shrink-0 text-right">Activite</span>
        <span className="w-6 shrink-0" />
      </div>

      {/* -- Separateur -- */}
      <div className="border-t border-gray-100" />

      {/* -- Liste des politiciens -- */}
      <div className="divide-y divide-gray-50">
        {rankedPoliticians.map((politician, index) => (
          <Link
            key={politician.id}
            href={`/politicien/${politician.slug}`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3",
              "transition-colors hover:bg-blue-50/50",
              "group"
            )}
          >
            {/* -- Rang -- */}
            <div className="w-7 shrink-0 flex justify-center">
              <RankBadge rank={index + 1} />
            </div>

            {/* -- Nom complet -- */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {politician.fullName}
              </p>
              <p className="text-xs text-gray-400 truncate sm:hidden">
                {politician.partyAbbreviation} &middot; {formatNumber(politician.speechCount)} discours
              </p>
            </div>

            {/* -- Badge du parti (masque sur mobile, visible dans le texte secondaire) -- */}
            <div className="hidden w-20 shrink-0 sm:flex justify-center">
              <PartyBadge abbreviation={politician.partyAbbreviation} />
            </div>

            {/* -- Nombre de discours -- */}
            <span className="hidden w-20 shrink-0 text-right text-sm font-semibold text-gray-700 sm:block">
              {formatNumber(politician.speechCount)}
            </span>

            {/* -- Derniere activite -- */}
            <span className="hidden w-28 shrink-0 text-right text-xs text-gray-400 sm:block">
              {formatDate(politician.lastActivity, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>

            {/* -- Fleche d'ouverture -- */}
            <div className="w-6 shrink-0 flex justify-center">
              <ArrowUpRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-blue-500" />
            </div>
          </Link>
        ))}
      </div>

      {/* -- Lien vers la liste complete -- */}
      <div className="mt-4 border-t border-gray-100 pt-4 text-center">
        <Link
          href="/politiciens"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Voir tous les politiciens &rarr;
        </Link>
      </div>
    </section>
  );
}

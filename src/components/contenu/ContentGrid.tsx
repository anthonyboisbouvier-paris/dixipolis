/* =============================================================================
 * components/contenu/ContentGrid.tsx
 *
 * Composant client ("use client") qui orchestre l'affichage et le filtrage
 * de la liste des contenus generes par l'IA.
 *
 * Responsabilites :
 *   - Importe les donnees mock (MOCK_CONTENT) comme source de contenus
 *   - Integre le composant ContentFilter pour permettre le filtrage
 *   - Filtre les contenus selon le type selectionne et le terme de recherche
 *   - Affiche les contenus filtres dans une grille responsive :
 *       > 1 colonne sur mobile
 *       > 2 colonnes sur tablette (md)
 *       > 3 colonnes sur desktop (lg)
 *   - Affiche un message "Aucun contenu trouve" quand aucun resultat
 *     ne correspond aux criteres de filtrage
 *
 * Architecture :
 *   - ContentGrid (client) gere l'etat de filtrage
 *   - ContentFilter (client) fournit l'interface de filtrage
 *   - ContentCard (serveur) affiche chaque carte individuellement
 *
 * Utilisation :
 *   <ContentGrid />
 * ============================================================================= */

"use client";

import { useState, useMemo } from "react";
import { Newspaper, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_CONTENT } from "@/lib/constants";
import ContentFilter from "@/components/contenu/ContentFilter";
import ContentCard from "@/components/contenu/ContentCard";
import type { ContentFilterParams, ContentTypeFilter } from "@/components/contenu/ContentFilter";

/* --------------------------------------------------------------------------
 * ContentGrid — Composant principal
 *
 * Gere l'etat de filtrage et calcule la liste filtree avec useMemo
 * pour eviter des recalculs inutiles a chaque rendu.
 *
 * Structure :
 *   1. ContentFilter : barre de filtrage en haut
 *   2. Compteur de resultats
 *   3. Grille de ContentCard ou message "aucun resultat"
 * -------------------------------------------------------------------------- */
export default function ContentGrid() {
  /* ---- Etat local du filtrage ---- */

  /** Type de contenu actuellement selectionne */
  const [activeType, setActiveType] = useState<ContentTypeFilter>("all");

  /** Terme de recherche saisi par l'utilisateur */
  const [searchTerm, setSearchTerm] = useState("");

  /* --------------------------------------------------------------------------
   * handleFilterChange — Callback appele par ContentFilter
   *
   * Met a jour les deux parametres de filtrage (type et recherche)
   * en une seule operation pour eviter un double rendu.
   * -------------------------------------------------------------------------- */
  const handleFilterChange = (params: ContentFilterParams) => {
    setActiveType(params.type);
    setSearchTerm(params.search);
  };

  /* --------------------------------------------------------------------------
   * filteredContent — Liste de contenus filtres (memoises)
   *
   * Le filtrage s'applique en deux etapes :
   *   1. Filtre par type : si un type specifique est selectionne, seuls
   *      les contenus de ce type sont conserves
   *   2. Filtre par recherche : le terme de recherche est compare au titre,
   *      au resume et au theme du contenu (insensible a la casse)
   *
   * useMemo evite de recalculer la liste filtree si ni le type ni le terme
   * de recherche n'ont change depuis le dernier rendu.
   * -------------------------------------------------------------------------- */
  const filteredContent = useMemo(() => {
    return MOCK_CONTENT.filter((item) => {
      /* Etape 1 : Filtre par type de contenu */
      if (activeType !== "all" && item.type !== activeType) {
        return false;
      }

      /* Etape 2 : Filtre par terme de recherche */
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(term);
        const matchesSummary = item.summary.toLowerCase().includes(term);
        const matchesTheme = item.theme.toLowerCase().includes(term);
        /* Le politicien peut aussi correspondre a la recherche */
        const matchesPolitician = item.relatedPoliticians.some((p) =>
          p.toLowerCase().includes(term)
        );

        /* Au moins un champ doit correspondre */
        if (!matchesTitle && !matchesSummary && !matchesTheme && !matchesPolitician) {
          return false;
        }
      }

      return true;
    });
  }, [activeType, searchTerm]);

  return (
    <section aria-label="Liste des contenus generes">
      {/* ================================================================
       * BARRE DE FILTRAGE
       * Le composant ContentFilter gere ses propres onglets et champ
       * de recherche, et notifie ContentGrid via le callback.
       * ================================================================ */}
      <ContentFilter onFilterChange={handleFilterChange} />

      {/* ================================================================
       * COMPTEUR DE RESULTATS
       * Affiche le nombre de contenus correspondant aux filtres actifs.
       * Aide l'utilisateur a comprendre l'etendue des resultats.
       * ================================================================ */}
      <div className="mt-4 mb-5 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <Newspaper className="h-4 w-4" aria-hidden="true" />
        <span>
          {filteredContent.length}{" "}
          {filteredContent.length <= 1 ? "contenu trouve" : "contenus trouves"}
        </span>
      </div>

      {/* ================================================================
       * GRILLE DE CONTENUS ou MESSAGE "AUCUN RESULTAT"
       *
       * Si des contenus correspondent aux filtres :
       *   -> Grille responsive (1/2/3 colonnes selon la largeur)
       *
       * Sinon :
       *   -> Message informatif avec icone et suggestion
       * ================================================================ */}
      {filteredContent.length > 0 ? (
        /* ---- Grille de cartes de contenu ---- */
        <div
          className={cn(
            /* Grille responsive avec espacement uniforme */
            "grid gap-5",
            "grid-cols-1",       /* Mobile : 1 colonne */
            "md:grid-cols-2",    /* Tablette : 2 colonnes */
            "lg:grid-cols-3"     /* Desktop : 3 colonnes */
          )}
        >
          {filteredContent.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        /* ---- Message quand aucun contenu ne correspond ---- */
        <div
          className={cn(
            /* Centrage vertical et horizontal */
            "flex flex-col items-center justify-center",

            /* Espacement genereux pour un rendu aere */
            "py-16",

            /* Style de carte avec fond blanc */
            "rounded-[var(--radius-lg)]",
            "border border-[var(--color-border)]",
            "bg-[var(--color-bg-card)]"
          )}
        >
          {/* Icone d'information dans un cercle */}
          <div
            className={cn(
              "mb-4 flex h-12 w-12 items-center justify-center",
              "rounded-full",
              "bg-[var(--color-bg-section)]"
            )}
          >
            <AlertCircle
              className="h-6 w-6 text-[var(--color-text-muted)]"
              aria-hidden="true"
            />
          </div>

          {/* Titre du message */}
          <h3 className="mb-1 text-base font-semibold text-[var(--color-text-primary)]">
            Aucun contenu trouve
          </h3>

          {/* Suggestion pour l'utilisateur */}
          <p className="text-sm text-[var(--color-text-muted)]">
            Essayez de modifier vos criteres de recherche ou de changer de filtre.
          </p>
        </div>
      )}
    </section>
  );
}

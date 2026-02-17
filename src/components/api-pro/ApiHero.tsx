/* =============================================================================
 * components/api-pro/ApiHero.tsx
 *
 * Section hero de la page API Pro de Dixipolis.
 *
 * Presente l'API Dixipolis aux developpeurs et entreprises avec :
 *   - Un titre percutant avec icone Code
 *   - Un sous-titre expliquant la proposition de valeur de l'API
 *   - Une description courte sur l'integration des donnees politiques
 *   - Deux boutons CTA : documentation (outline) et demarrage (primary)
 *   - Un arriere-plan en degrade bleu clair coherent avec la charte Dixipolis
 *
 * Composant serveur (Server Component) — pas de "use client".
 * Ce composant n'a aucune interactivite cote client, il se contente
 * de rendre du contenu statique avec des liens de navigation.
 *
 * Accessibilite :
 *   - Section avec aria-label descriptif
 *   - Hierarchie de titres respectee (h1)
 *   - Boutons accessibles via Link natif Next.js
 *   - Contraste conforme WCAG AA sur fond degrade
 * ============================================================================= */

import Link from "next/link";
import { Code, BookOpen, ArrowRight } from "lucide-react";

/* --------------------------------------------------------------------------
 * ApiHero — Section hero principale de la page API Pro
 *
 * Structure :
 *   1. Conteneur avec degrade bleu clair (hero-gradient)
 *   2. Badge "API RESTful" pour positionner le produit
 *   3. Titre h1 avec icone Code
 *   4. Sous-titre descriptif
 *   5. Paragraphe de contexte sur l'integration
 *   6. Deux boutons CTA cote a cote
 *   7. Element decoratif de fond (cercle flou)
 * -------------------------------------------------------------------------- */
export default function ApiHero() {
  return (
    <section
      className="hero-gradient relative overflow-hidden"
      aria-label="Presentation de l'API Pro Dixipolis"
    >
      {/* Conteneur principal avec espacement genereux */}
      <div className="page-container py-20 sm:py-28 lg:py-36">
        {/* Bloc de contenu centre */}
        <div className="mx-auto max-w-4xl text-center">

          {/* ----------------------------------------------------------------
           * Badge contextuel
           * Indique clairement qu'il s'agit d'une API RESTful.
           * Style coherent avec le badge de la page d'accueil.
           * ---------------------------------------------------------------- */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] backdrop-blur-sm">
            <Code
              className="h-4 w-4 text-[var(--color-primary)]"
              aria-hidden="true"
            />
            API RESTful pour developpeurs
          </div>

          {/* ----------------------------------------------------------------
           * Titre principal (h1)
           * "API Pro" est mis en valeur avec la couleur primaire.
           * L'icone Code est placee a cote du mot-cle pour renforcer
           * visuellement le positionnement technique du produit.
           * ---------------------------------------------------------------- */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
            <span className="text-[var(--color-primary)]">API Pro</span>{" "}
            Dixipolis
          </h1>

          {/* ----------------------------------------------------------------
           * Sous-titre
           * Phrase d'accroche synthetique qui resume la proposition de valeur.
           * Taille de texte plus grande que la description pour hierarchiser.
           * ---------------------------------------------------------------- */}
          <p className="mx-auto mb-4 max-w-2xl text-lg font-medium leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
            Utilisez notre API pour acc&eacute;der &agrave; l&apos;ensemble des donn&eacute;es de Dixipolis.
          </p>

          {/* ----------------------------------------------------------------
           * Description complementaire
           * Contexte supplementaire sur les cas d'usage de l'API :
           * integration dans des applications, outils d'analyse, etc.
           * ---------------------------------------------------------------- */}
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
            Int&eacute;grez les donn&eacute;es du discours politique fran&ccedil;ais dans vos
            applications, tableaux de bord et outils d&apos;analyse. Recherche
            s&eacute;mantique, extraction de citations, m&eacute;tadonn&eacute;es compl&egrave;tes — tout
            est accessible via des endpoints REST simples et document&eacute;s.
          </p>

          {/* ----------------------------------------------------------------
           * Boutons CTA
           * Deux actions principales disposees cote a cote :
           *   - "Voir la documentation" : style outline, secondaire
           *   - "Commencer" : style primary, action principale
           * Sur mobile, les boutons passent en colonne.
           * ---------------------------------------------------------------- */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* CTA secondaire — Documentation */}
            <Link
              href="#documentation"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-all duration-[var(--transition-fast)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-md sm:text-base"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Voir la documentation
            </Link>

            {/* CTA principal — Commencer */}
            <Link
              href="#tarifs"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-[var(--transition-fast)] hover:bg-[var(--color-primary-hover)] hover:shadow-md sm:text-base"
            >
              Commencer
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* ----------------------------------------------------------------
           * Indicateurs de credibilite
           * Statistiques et mentions rassurantes sous les CTA.
           * ---------------------------------------------------------------- */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"
                aria-hidden="true"
              />
              99.9% de disponibilit&eacute;
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
                aria-hidden="true"
              />
              Documentation compl&egrave;te
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
                aria-hidden="true"
              />
              R&eacute;ponse en &lt; 200ms
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------
       * Element decoratif de fond
       * Cercle flou en arriere-plan pour renforcer la profondeur du degrade.
       * Position absolue, aucun impact sur le layout.
       * ---------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--color-primary)] opacity-[0.04] blur-3xl"
        aria-hidden="true"
      />
    </section>
  );
}

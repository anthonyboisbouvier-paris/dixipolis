/* =============================================================================
 * components/home/CTASection.tsx
 *
 * Section d'appel a l'action (Call to Action) de la page d'accueil Dixipolis.
 * Derniere section de la page, elle invite le visiteur a essayer la plateforme
 * avec un message percutant sur fond bleu degrade.
 *
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Design :
 *   - Fond en degrade bleu (primaire vers primaire fonce)
 *   - Texte blanc pour un contraste maximal
 *   - Bouton blanc qui ressort sur le fond colore
 *   - Elements decoratifs subtils (cercles flous)
 * ============================================================================= */

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

/* --------------------------------------------------------------------------
 * CTASection — Composant principal de la section appel a l'action
 *
 * Structure :
 *   - Conteneur pleine largeur avec fond degrade bleu
 *   - Titre accrocheur en blanc
 *   - Description encourageante
 *   - Deux boutons : primaire (blanc sur bleu) et secondaire (transparent)
 *   - Elements decoratifs en arriere-plan (cercles flous)
 *
 * Accessibilite :
 *   - Contraste texte blanc sur fond bleu > 4.5:1 (WCAG AA)
 *   - Liens semantiques avec texte descriptif
 *   - Section labelisee pour les technologies d'assistance
 * -------------------------------------------------------------------------- */
export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-700)] to-[var(--color-primary-900)] py-16 sm:py-20 lg:py-24"
      aria-label="Essayer la plateforme Dixipolis"
    >
      {/* ----------------------------------------------------------------
       * Elements decoratifs de fond
       * Cercles flous semi-transparents pour creer de la profondeur
       * et du mouvement visuel dans le fond degrade.
       * ---------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white opacity-[0.06] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-96 w-96 rounded-full bg-white opacity-[0.04] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-white opacity-[0.08] blur-2xl"
        aria-hidden="true"
      />

      {/* ----------------------------------------------------------------
       * Contenu principal centre
       * ---------------------------------------------------------------- */}
      <div className="page-container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* ----------------------------------------------------------------
           * Badge decoratif au-dessus du titre
           * Petite pastille avec icone pour capter l'attention.
           * ---------------------------------------------------------------- */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            <Zap className="h-4 w-4" aria-hidden="true" />
            Acces gratuit disponible
          </div>

          {/* ----------------------------------------------------------------
           * Titre de la section CTA
           * Message percutant et orienté action pour encourager l'inscription.
           * ---------------------------------------------------------------- */}
          <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pret a decrypter le discours politique ?
          </h2>

          {/* ----------------------------------------------------------------
           * Description sous le titre
           * Message rassurant et incitatif, texte blanc legerement transparent
           * pour creer une hierarchie visuelle avec le titre.
           * ---------------------------------------------------------------- */}
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/80">
            Commencez gratuitement et decouvrez ce que les politiques ont
            vraiment dit. Pas de carte bancaire requise, acces immediat a la
            plateforme.
          </p>

          {/* ----------------------------------------------------------------
           * Groupe de boutons CTA
           * Deux boutons cote a cote :
           *   - Bouton primaire : blanc, lien vers /prompt
           *   - Bouton secondaire : transparent borde, lien vers /api-pro
           * ---------------------------------------------------------------- */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Bouton primaire — Commencer gratuitement */}
            <Link
              href="/prompt"
              className="group inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-white px-8 py-3.5 text-base font-semibold text-[var(--color-primary)] shadow-lg transition-all duration-[var(--transition-normal)] hover:bg-white/90 hover:shadow-xl"
            >
              Commencer gratuitement
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            {/* Bouton secondaire — Decouvrir l'API */}
            <Link
              href="/api-pro"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all duration-[var(--transition-normal)] hover:border-white/60 hover:bg-white/10"
            >
              Decouvrir l&apos;API
            </Link>
          </div>

          {/* ----------------------------------------------------------------
           * Mention rassurante sous les boutons
           * Petits textes de reassurance pour lever les freins a l'action.
           * ---------------------------------------------------------------- */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-white/60"
                aria-hidden="true"
              />
              Sans engagement
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-white/60"
                aria-hidden="true"
              />
              Donnees securisees
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-white/60"
                aria-hidden="true"
              />
              Support reactif
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

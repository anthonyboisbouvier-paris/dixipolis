/* =============================================================================
 * components/api-pro/ApiPricing.tsx
 *
 * Section tarifaire de la page API Pro Dixipolis.
 *
 * Affiche les 3 plans tarifaires API definis dans PRICING_PLANS_API :
 *   1. API Starter  — 129 EUR/mois (entree de gamme)
 *   2. API Pro       — 349 EUR/mois (populaire, badge mis en avant)
 *   3. API Entreprise — Sur devis (grands comptes)
 *
 * Composant serveur (Server Component) — pas de "use client".
 * Les donnees proviennent de la constante PRICING_PLANS_API (lib/constants.ts).
 *
 * Design :
 *   - Cartes blanches avec bordures subtiles
 *   - Le plan populaire (isPopular) recoit un badge bleu et une bordure coloree
 *   - Chaque plan affiche : nom, prix, description, liste de features, CTA
 *   - Le prix 0 EUR est affiche comme "Sur devis" pour le plan entreprise
 *   - Layout responsive : 1 col mobile, 3 col desktop
 *
 * Accessibilite :
 *   - Section avec aria-label descriptif
 *   - Utilisation de listes pour les features (semantique)
 *   - Boutons CTA accessibles via Link natif
 * ============================================================================= */

import Link from "next/link";
import { Check, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING_PLANS_API } from "@/lib/constants";
import type { PricingPlan } from "@/types";

/* --------------------------------------------------------------------------
 * ApiPricing — Composant principal de la section tarifaire
 *
 * Structure :
 *   1. En-tete de section (titre + sous-titre)
 *   2. Grille responsive de cartes PricingCard
 *   3. Note de bas de section (TVA, engagement, etc.)
 * -------------------------------------------------------------------------- */
export default function ApiPricing() {
  return (
    <section
      id="tarifs"
      className="bg-[var(--color-bg-page)] py-16 sm:py-20 lg:py-24"
      aria-label="Tarifs de l'API Dixipolis"
    >
      <div className="page-container">
        {/* ----------------------------------------------------------------
         * En-tete de section
         * Titre et description centres pour introduire les plans.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Tarifs transparents
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Choisissez le plan adapt&eacute; &agrave; votre volume de requ&ecirc;tes.
            &Eacute;voluez &agrave; tout moment, sans engagement.
          </p>
        </div>

        {/* ----------------------------------------------------------------
         * Grille de cartes tarifaires
         * 1 colonne mobile, 3 colonnes desktop.
         * Les cartes sont alignees en haut pour gerer les hauteurs differentes.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {PRICING_PLANS_API.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* ----------------------------------------------------------------
         * Note de bas de section
         * Informations complementaires sur la facturation.
         * ---------------------------------------------------------------- */}
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--color-text-muted)]">
          Tous les prix sont en euros HT. Facturation mensuelle. Aucun engagement
          de dur&eacute;e. R&eacute;siliation possible &agrave; tout moment depuis votre espace
          d&eacute;veloppeur.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * PricingCard — Carte individuelle d'un plan tarifaire
 *
 * Props :
 *   - plan : objet PricingPlan contenant toutes les informations du plan
 *
 * Logique conditionnelle :
 *   - Si plan.isPopular : bordure bleue, badge "Populaire", ombre renforcee
 *   - Si plan.price === 0 : affichage "Sur devis" au lieu du prix
 *   - Le CTA du plan entreprise redirige vers /contact
 *
 * Structure interne :
 *   1. Badge "Populaire" (conditionnel)
 *   2. Nom du plan
 *   3. Description
 *   4. Prix (ou "Sur devis")
 *   5. Liste de fonctionnalites avec icones Check
 *   6. Bouton CTA
 * -------------------------------------------------------------------------- */
function PricingCard({ plan }: { plan: PricingPlan }) {
  const { name, description, price, features, isPopular, ctaLabel } = plan;

  /* Determine l'URL du CTA en fonction du type de plan */
  const ctaHref = price === 0 ? "/contact" : "/connexion";

  /* Le plan entreprise (prix = 0) affiche "Sur devis" */
  const isEnterprise = price === 0;

  return (
    <div
      className={cn(
        /* Base : carte blanche avec bordure et coins arrondis */
        "relative flex flex-col rounded-[var(--radius-xl)] border bg-white p-6 sm:p-8",
        "transition-all duration-[var(--transition-normal)]",
        /* Plan populaire : bordure bleue, ombre renforcee */
        isPopular
          ? "border-[var(--color-primary)] shadow-lg ring-1 ring-[var(--color-primary)]/20"
          : "border-[var(--color-border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)]"
      )}
    >
      {/* ----------------------------------------------------------------
       * Badge "Populaire"
       * Affiche uniquement sur le plan marque isPopular.
       * Positionne en haut a droite de la carte.
       * ---------------------------------------------------------------- */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <Zap className="h-3 w-3" aria-hidden="true" />
            Populaire
          </span>
        </div>
      )}

      {/* ----------------------------------------------------------------
       * Nom du plan
       * Taille et poids de texte importants pour hierarchiser.
       * ---------------------------------------------------------------- */}
      <h3 className="mb-2 text-xl font-bold text-[var(--color-text-primary)]">
        {name}
      </h3>

      {/* ----------------------------------------------------------------
       * Description courte du plan
       * Texte secondaire pour contextualiser l'offre.
       * ---------------------------------------------------------------- */}
      <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {description}
      </p>

      {/* ----------------------------------------------------------------
       * Prix
       * Affichage conditionnel :
       *   - Plan standard : "XXX EUR / mois"
       *   - Plan entreprise : "Sur devis"
       * ---------------------------------------------------------------- */}
      <div className="mb-6">
        {isEnterprise ? (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
              Sur devis
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
              {price}&nbsp;&euro;
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              / mois
            </span>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------
       * Separateur visuel
       * Ligne horizontale fine pour separer le prix des features.
       * ---------------------------------------------------------------- */}
      <hr className="mb-6 border-[var(--color-border)]" />

      {/* ----------------------------------------------------------------
       * Liste des fonctionnalites
       * Chaque feature est precedee d'une icone Check verte.
       * flex-1 permet de pousser le CTA vers le bas.
       * ---------------------------------------------------------------- */}
      <ul className="mb-8 flex-1 space-y-3" role="list">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {/* Icone Check dans un cercle vert clair */}
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50"
              aria-hidden="true"
            >
              <Check className="h-3 w-3 text-[var(--color-success)]" />
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* ----------------------------------------------------------------
       * Bouton CTA
       * Style conditionnel :
       *   - Plan populaire : fond bleu primaire, texte blanc
       *   - Autres plans : fond transparent, bordure, texte sombre
       * ---------------------------------------------------------------- */}
      <Link
        href={ctaHref}
        className={cn(
          /* Base : pleine largeur, centre, arrondi, transition */
          "flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-6 py-3 text-sm font-semibold transition-all duration-[var(--transition-fast)]",
          /* Style conditionnel selon la popularite */
          isPopular
            ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] hover:shadow-md"
            : "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        )}
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

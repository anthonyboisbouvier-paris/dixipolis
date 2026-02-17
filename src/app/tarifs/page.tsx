/* =============================================================================
 * app/tarifs/page.tsx
 *
 * Page de tarification de Dixipolis.
 * Composant serveur (Server Component) affichant les offres Web et API.
 *
 * Structure de la page :
 *   1. En-tete de page       — Titre "Tarifs" et sous-titre explicatif
 *   2. Section "Offres Web"  — 3 cartes tarifaires (Decouverte, Essentiel, Pro)
 *   3. Section "Offres API"  — 3 cartes tarifaires (Starter, Pro, Entreprise)
 *   4. Section FAQ            — 4 questions/reponses avec details/summary
 *
 * Donnees :
 *   - Les plans tarifaires sont importes depuis lib/constants.ts
 *   - Chaque plan suit l'interface PricingPlan definie dans types/index.ts
 *
 * Design :
 *   - Fond gris clair (bg-page) pour la page globale
 *   - Cartes blanches avec bordures et ombres coherentes avec le design system
 *   - Le plan "isPopular" est mis en evidence avec une bordure bleue et un badge
 *   - Les icones Check (lucide-react) accompagnent chaque fonctionnalite
 *   - FAQ utilise l'element natif <details> pour la simplicite (pas de JS)
 * ============================================================================= */

import PageWrapper from "@/components/layout/PageWrapper";
import { PRICING_PLANS_WEB, PRICING_PLANS_API } from "@/lib/constants";
import { Check, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/types";

/* --------------------------------------------------------------------------
 * DONNEES FAQ
 * Questions frequentes affichees en bas de page.
 * Chaque entree contient une question et sa reponse detaillee.
 * -------------------------------------------------------------------------- */
const FAQ_ITEMS = [
  {
    question: "Puis-je changer d'offre a tout moment ?",
    answer:
      "Oui, vous pouvez passer d'une offre a une autre a tout moment depuis votre espace personnel. " +
      "Le changement prend effet immediatement. Si vous passez a une offre superieure, la difference " +
      "est calculee au prorata. Si vous revenez a une offre inferieure, le credit restant est reporte " +
      "sur votre prochaine facture.",
  },
  {
    question: "Comment fonctionne la periode d'essai ?",
    answer:
      "Chaque nouvelle inscription beneficie d'un essai gratuit de 14 jours sur l'offre Essentiel. " +
      "Durant cette periode, vous avez acces a toutes les fonctionnalites de l'offre sans engagement. " +
      "Aucun moyen de paiement n'est requis pour demarrer l'essai. A l'issue des 14 jours, vous pouvez " +
      "choisir de souscrire ou de continuer avec l'offre Decouverte gratuite.",
  },
  {
    question: "Les donnees sont-elles securisees ?",
    answer:
      "Absolument. Dixipolis heberge l'ensemble de ses donnees sur des serveurs situes en France, " +
      "conformement au RGPD. Les communications sont chiffrees en TLS 1.3, et les donnees au repos " +
      "sont chiffrees en AES-256. Nous ne revendons jamais vos donnees personnelles et vous pouvez " +
      "demander leur suppression a tout moment.",
  },
  {
    question: "Comment contacter le support ?",
    answer:
      "Notre equipe support est disponible par email a support@dixipolis.fr du lundi au vendredi, " +
      "de 9h a 18h (heure de Paris). Les abonnes Pro et API Pro beneficient d'un support prioritaire " +
      "avec un temps de reponse garanti sous 4 heures ouvrees. Vous pouvez egalement consulter notre " +
      "centre d'aide en ligne pour les questions les plus courantes.",
  },
];

/* --------------------------------------------------------------------------
 * PricingCard — Carte individuelle d'un plan tarifaire
 *
 * Affiche les informations d'un plan :
 *   - Nom et description
 *   - Prix mensuel (ou "Gratuit" / "Sur devis" selon le contexte)
 *   - Liste des fonctionnalites avec icones Check
 *   - Bouton d'action (CTA)
 *   - Badge "Populaire" si le plan est mis en avant (isPopular)
 *
 * Props :
 *   - plan : PricingPlan — donnees du plan tarifaire
 *   - isEnterprise : boolean — indique s'il s'agit du plan Entreprise (prix "Sur devis")
 * -------------------------------------------------------------------------- */
function PricingCard({
  plan,
  isEnterprise = false,
}: {
  plan: PricingPlan;
  isEnterprise?: boolean;
}) {
  return (
    <div
      className={cn(
        /* Carte blanche avec bordure, ombre et coins arrondis */
        "card relative flex flex-col p-6 lg:p-8",
        /* Le plan populaire se distingue par une bordure bleue et une ombre plus prononcee */
        plan.isPopular
          ? "border-2 border-[var(--color-primary)] shadow-[var(--shadow-lg)]"
          : "border border-[var(--color-border)]"
      )}
    >
      {/* ----------------------------------------------------------------
       * Badge "Populaire"
       * Affiche uniquement pour le plan marque isPopular.
       * Positionne en haut a droite de la carte.
       * ---------------------------------------------------------------- */}
      {plan.isPopular && (
        <div className="absolute -top-3 right-6 flex items-center gap-1 rounded-[var(--radius-full)] bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white">
          <Star className="h-3 w-3" aria-hidden="true" />
          <span>Populaire</span>
        </div>
      )}

      {/* ----------------------------------------------------------------
       * Nom et description du plan
       * ---------------------------------------------------------------- */}
      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
        {plan.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {plan.description}
      </p>

      {/* ----------------------------------------------------------------
       * Affichage du prix
       *   - "Gratuit" si le prix est 0 et que ce n'est pas le plan Entreprise
       *   - "Sur devis" pour le plan Entreprise
       *   - Prix formate avec "EUR / mois" sinon
       * ---------------------------------------------------------------- */}
      <div className="mt-6 mb-6">
        {isEnterprise ? (
          /* Plan Entreprise : affichage "Sur devis" */
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">
              Sur devis
            </span>
          </div>
        ) : plan.price === 0 ? (
          /* Plan gratuit : affichage "Gratuit" */
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">
              Gratuit
            </span>
          </div>
        ) : (
          /* Plan payant : affichage du prix mensuel */
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">
              {plan.price.toLocaleString("fr-FR", {
                minimumFractionDigits: plan.price % 1 === 0 ? 0 : 1,
                maximumFractionDigits: 2,
              })}
              &euro;
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              / mois
            </span>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------
       * Ligne de separation horizontale
       * Separateur visuel entre le prix et la liste des fonctionnalites.
       * ---------------------------------------------------------------- */}
      <hr className="border-[var(--color-border-light)]" />

      {/* ----------------------------------------------------------------
       * Liste des fonctionnalites incluses dans le plan
       * Chaque fonctionnalite est precedee d'une icone Check verte.
       * flex-1 permet de pousser le bouton CTA vers le bas de la carte.
       * ---------------------------------------------------------------- */}
      <ul className="mt-6 flex-1 space-y-3" aria-label={`Fonctionnalites de l'offre ${plan.name}`}>
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {/* Icone Check dans un cercle vert clair */}
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dcfce7]"
              aria-hidden="true"
            >
              <Check className="h-3 w-3 text-[var(--color-success)]" />
            </span>
            <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* ----------------------------------------------------------------
       * Bouton d'action (CTA)
       * Le plan populaire a un bouton plein bleu (primaire).
       * Les autres plans ont un bouton avec bordure (outline).
       * ---------------------------------------------------------------- */}
      <button
        className={cn(
          "mt-8 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-3 text-sm font-semibold transition-colors duration-[var(--transition-fast)]",
          plan.isPopular
            ? /* Bouton plein pour le plan populaire */
              "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
            : /* Bouton outline pour les autres plans */
              "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        )}
        aria-label={plan.ctaLabel}
      >
        <span>{plan.ctaLabel}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * PricingSectionHeader — En-tete de section (Offres Web / Offres API)
 *
 * Affiche un titre de section avec un trait decoratif bleu en dessous.
 * Utilise un style "tab-like" avec un fond leger et un accent bleu.
 * -------------------------------------------------------------------------- */
function PricingSectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8 text-center lg:mb-12">
      {/* Badge de section avec fond bleu clair et texte bleu */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-primary-light)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
        {title}
      </div>
      <p className="text-[var(--color-text-secondary)]">{subtitle}</p>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * TarifsPage — Composant principal de la page /tarifs
 *
 * Assemble toutes les sections de la page :
 *   1. En-tete avec titre et sous-titre
 *   2. Section Offres Web (3 cartes)
 *   3. Section Offres API (3 cartes)
 *   4. Section FAQ (4 questions)
 *
 * Composant serveur — pas de "use client".
 * -------------------------------------------------------------------------- */
export default function TarifsPage() {
  return (
    <PageWrapper className="py-12 sm:py-16 lg:py-20">
      {/* ==================================================================
       * SECTION 1 — En-tete de page
       * Titre principal et sous-titre explicatif centre.
       * ================================================================== */}
      <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
          Tarifs
        </h1>
        <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
          Des offres adaptees a tous les usages
        </p>
      </div>

      {/* ==================================================================
       * SECTION 2 — Offres Web
       * Grille de 3 cartes pour les plans web (Decouverte, Essentiel, Pro).
       * Le plan "Acces Pro" est mis en evidence avec isPopular.
       * ================================================================== */}
      <section className="mb-16 lg:mb-24" aria-labelledby="offres-web-heading">
        <PricingSectionHeader
          title="Offres Web"
          subtitle="Accedez a Dixipolis depuis votre navigateur"
        />

        {/* Grille responsive : 1 col mobile, 2 cols tablette, 3 cols desktop */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PRICING_PLANS_WEB.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* ==================================================================
       * SECTION 3 — Offres API
       * Grille de 3 cartes pour les plans API (Starter, Pro, Entreprise).
       * Le plan "API Pro" est populaire, le plan "Entreprise" est sur devis.
       * ================================================================== */}
      <section className="mb-16 lg:mb-24" aria-labelledby="offres-api-heading">
        <PricingSectionHeader
          title="Offres API"
          subtitle="Integrez les donnees Dixipolis dans vos applications"
        />

        {/* Grille responsive : 1 col mobile, 2 cols tablette, 3 cols desktop */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PRICING_PLANS_API.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              /* Le plan Entreprise a un prix de 0 mais ne doit pas afficher "Gratuit" */
              isEnterprise={plan.id === "api-enterprise"}
            />
          ))}
        </div>
      </section>

      {/* ==================================================================
       * SECTION 4 — Foire Aux Questions (FAQ)
       *
       * 4 questions/reponses en accordeon natif HTML (details/summary).
       * Avantages du details/summary natif :
       *   - Pas de JavaScript cote client necessaire (composant serveur pur)
       *   - Accessibilite native (keyboard nav, screen readers)
       *   - Semantique HTML correcte
       *
       * Les questions sont definies dans FAQ_ITEMS en haut de ce fichier.
       * ================================================================== */}
      <section className="mx-auto max-w-3xl" aria-labelledby="faq-heading">
        {/* Titre de la section FAQ */}
        <div className="mb-8 text-center lg:mb-12">
          <h2
            id="faq-heading"
            className="mb-4 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl"
          >
            Questions frequentes
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Tout ce que vous devez savoir sur nos offres et services
          </p>
        </div>

        {/* Liste des questions avec accordeon natif */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={index}
              className="card group overflow-hidden border border-[var(--color-border)]"
            >
              {/* --------------------------------------------------------
               * Summary — Titre cliquable de la question
               * Le chevron natif du navigateur est masque via marker:hidden.
               * Un indicateur "+" / "-" est simule via les pseudo-elements CSS.
               * -------------------------------------------------------- */}
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-primary)] [&::-webkit-details-marker]:hidden list-none">
                <span>{item.question}</span>
                {/* Indicateur visuel d'ouverture/fermeture */}
                <span
                  className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-section)] text-[var(--color-text-muted)] transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>

              {/* --------------------------------------------------------
               * Contenu de la reponse
               * Affiche uniquement lorsque le <details> est ouvert.
               * Fond legerement teinté pour creer une separation visuelle.
               * -------------------------------------------------------- */}
              <div className="border-t border-[var(--color-border-light)] px-6 pb-5 pt-4">
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}

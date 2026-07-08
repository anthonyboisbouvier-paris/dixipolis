/* =============================================================================
 * app/tarifs/page.tsx
 *
 * Page de tarification premium de Dixipolis.
 * Composant serveur (Server Component) affichant les offres Web et API.
 *
 * Structure de la page :
 *   1. En-tete de page        — Titre "Tarifs" et sous-titre explicatif
 *   2. Barre de navigation    — Liens ancres "Offres Web" / "Offres API" (CSS only)
 *   3. Section "Offres Web"   — 3 cartes tarifaires (Decouverte, Essentiel, Pro)
 *   4. Section "Offres API"   — 3 cartes tarifaires (Starter, Pro, Entreprise)
 *   5. Section liste d'attente — Les offres ne sont pas encore souscriptibles :
 *      chaque carte pointe vers l'ancre #waitlist (WaitlistForm source="tarifs")
 *   6. Section FAQ            — 4 questions/reponses avec details/summary
 *
 * Donnees :
 *   - Les plans tarifaires sont importes depuis lib/constants.ts
 *   - Chaque plan suit l'interface PricingPlan definie dans types/index.ts
 *
 * Design :
 *   - Fond page via PageWrapper (page-container + padding vertical)
 *   - Cartes blanches avec bordures et ombres coherentes avec le design system
 *   - Le plan "isPopular" est mis en evidence avec une bordure primaire + badge
 *   - Les icones Check (lucide-react) accompagnent chaque fonctionnalite
 *   - CTA utilise le composant Link (navigation sans rechargement)
 *   - FAQ utilise l'element natif <details> pour zero JS cote client
 *
 * SEO :
 *   - Composant serveur => peut exporter metadata directement
 *   - IDs sur les h2 pour les aria-labelledby
 * ============================================================================= */

import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import Link from "next/link";
import WaitlistForm from "@/components/shared/WaitlistForm";
import { PRICING_PLANS_WEB, PRICING_PLANS_API } from "@/lib/constants";
import { Check, ArrowRight, Star, Zap, Globe, Code, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/types";

/* --------------------------------------------------------------------------
 * METADATA SEO
 * Exportee directement car ce composant est un Server Component.
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Decouvrez les offres Web et API de Dixipolis. Des formules adaptees a tous les usages, du gratuit au sur-mesure.",
};

/* --------------------------------------------------------------------------
 * DONNEES FAQ
 * Questions frequentes affichees en bas de page.
 * Chaque entree contient une question et sa reponse detaillee.
 * -------------------------------------------------------------------------- */
const FAQ_ITEMS = [
  {
    question: "Quand les offres seront-elles disponibles ?",
    answer:
      "Les offres presentees sur cette page ne sont pas encore souscriptibles : elles seront ouvertes " +
      "au lancement commercial de Dixipolis. Inscrivez-vous a la liste d'attente pour etre prevenu " +
      "des l'ouverture et beneficier des premieres places.",
  },
  {
    question: "Pourrai-je changer d'offre ?",
    answer:
      "Oui, c'est prevu : une fois les offres ouvertes, vous pourrez passer d'une formule a une autre " +
      "depuis votre espace personnel. Les modalites precises (prorata, report de credit) seront " +
      "detaillees au lancement.",
  },
  {
    question: "Les donnees sont-elles securisees ?",
    answer:
      "La securite des donnees est une priorite : les communications sont chiffrees en transit et un " +
      "hebergement dans l'Union europeenne est prevu, dans le respect du RGPD. Nous ne revendons jamais " +
      "vos donnees personnelles et vous pouvez demander leur suppression a tout moment.",
  },
  {
    question: "Comment nous contacter ?",
    answer:
      "Pour toute question sur les offres ou le produit, ecrivez-nous via la page Contact du site. " +
      "Nous repondons a toutes les demandes dans les meilleurs delais.",
  },
];

/* --------------------------------------------------------------------------
 * PricingCard — Carte individuelle d'un plan tarifaire
 *
 * Affiche les informations d'un plan :
 *   - Nom et description
 *   - Prix mensuel (ou "Gratuit" / "Sur devis" selon le contexte)
 *   - Liste des fonctionnalites avec icones Check
 *   - CTA : les offres n'etant pas encore souscriptibles, chaque plan pointe
 *     vers l'ancre #waitlist (liste d'attente en bas de page). Seul le plan
 *     Entreprise conserve un lien vers la page Contact (demande de devis).
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
  /* ---- CTA : ancre vers la liste d'attente (ou Contact pour Entreprise) ---- */
  const ctaHref = isEnterprise ? "/contact" : "#waitlist";
  const ctaLabel = isEnterprise ? plan.ctaLabel : "Rejoindre la liste d'attente";

  return (
    <div
      className={cn(
        /* Carte blanche avec coins arrondis et transition au survol */
        "card relative flex flex-col p-6 lg:p-8 transition-shadow duration-300",
        /* Le plan populaire se distingue par une bordure primaire et une ombre plus prononcee */
        plan.isPopular
          ? "border-2 shadow-lg"
          : "border hover:shadow-md"
      )}
      style={{
        borderColor: plan.isPopular
          ? "var(--color-primary)"
          : "var(--color-border)",
      }}
    >
      {/* ----------------------------------------------------------------
       * Badge "Populaire"
       * Affiche uniquement pour le plan marque isPopular.
       * Positionne en haut a droite de la carte.
       * ---------------------------------------------------------------- */}
      {plan.isPopular && (
        <div
          className="absolute -top-3 right-6 flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-bold tracking-wide text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Star className="h-3 w-3" aria-hidden="true" />
          <span>Populaire</span>
        </div>
      )}

      {/* ----------------------------------------------------------------
       * Nom et description du plan
       * ---------------------------------------------------------------- */}
      <h3
        className="text-xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {plan.name}
      </h3>
      <p
        className="mt-2 text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
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
            <span
              className="text-3xl font-extrabold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Sur devis
            </span>
          </div>
        ) : plan.price === 0 ? (
          /* Plan gratuit : affichage "Gratuit" */
          <div className="flex items-baseline gap-1">
            <span
              className="text-3xl font-extrabold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Gratuit
            </span>
          </div>
        ) : (
          /* Plan payant : affichage du prix mensuel */
          <div className="flex items-baseline gap-1">
            <span
              className="text-3xl font-extrabold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {plan.price.toLocaleString("fr-FR", {
                minimumFractionDigits: plan.price % 1 === 0 ? 0 : 1,
                maximumFractionDigits: 2,
              })}
              &euro;
            </span>
            <span
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              / mois
            </span>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------
       * Ligne de separation horizontale
       * Separateur visuel entre le prix et la liste des fonctionnalites.
       * ---------------------------------------------------------------- */}
      <hr style={{ borderColor: "var(--color-border-light)" }} />

      {/* ----------------------------------------------------------------
       * Liste des fonctionnalites incluses dans le plan
       * Chaque fonctionnalite est precedee d'une icone Check dans un cercle.
       * flex-1 permet de pousser le CTA vers le bas de la carte.
       * ---------------------------------------------------------------- */}
      <ul
        className="mt-6 flex-1 space-y-3"
        aria-label={`Fonctionnalites de l'offre ${plan.name}`}
      >
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {/* Icone Check dans un cercle vert clair */}
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-success-light, #dcfce7)" }}
              aria-hidden="true"
            >
              <Check
                className="h-3 w-3"
                style={{ color: "var(--color-success)" }}
              />
            </span>
            <span
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* ----------------------------------------------------------------
       * CTA — Lien de navigation (pas un bouton)
       * Le plan populaire a un style plein primaire.
       * Les autres plans ont un style outline.
       * Pointe vers l'ancre #waitlist (liste d'attente) ou /contact.
       * ---------------------------------------------------------------- */}
      <Link
        href={ctaHref}
        className={cn(
          "mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200",
          plan.isPopular
            ? "text-white hover:opacity-90"
            : "border hover:opacity-80"
        )}
        style={
          plan.isPopular
            ? { backgroundColor: "var(--color-primary)" }
            : {
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                backgroundColor: "var(--color-bg-card)",
              }
        }
      >
        <span>{ctaLabel}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * PricingSectionHeader — En-tete de section (Offres Web / Offres API)
 *
 * Affiche un badge de section avec une icone, un titre et un sous-titre.
 * Le badge utilise un fond primaire clair et un texte primaire.
 * -------------------------------------------------------------------------- */
function PricingSectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className="mb-8 text-center lg:mb-12">
      {/* Badge de section avec fond primaire clair et texte primaire */}
      <div
        className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
        style={{
          backgroundColor: "var(--color-primary-light)",
          color: "var(--color-primary)",
        }}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        {title}
      </div>
      <p style={{ color: "var(--color-text-secondary)" }}>{subtitle}</p>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * TarifsPage — Composant principal de la page /tarifs
 *
 * Assemble toutes les sections de la page :
 *   1. En-tete avec titre et sous-titre
 *   2. Navigation par ancres (Offres Web / Offres API)
 *   3. Section Offres Web (3 cartes)
 *   4. Section Offres API (3 cartes)
 *   5. Section FAQ (4 questions)
 *
 * Composant serveur — pas de "use client".
 * -------------------------------------------------------------------------- */
export default function TarifsPage() {
  return (
    <PageWrapper>
      {/* ==================================================================
       * SECTION 1 — En-tete de page
       * Titre principal et sous-titre explicatif centre.
       * ================================================================== */}
      <div className="mx-auto mb-8 max-w-3xl text-center lg:mb-12">
        <h1
          className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Tarifs
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Des offres adaptees a tous les usages
        </p>
      </div>

      {/* ==================================================================
       * SECTION 2 — Navigation par ancres (tab-like, CSS only)
       * Deux liens ancres vers les sections Offres Web et Offres API.
       * Pas de JavaScript — navigation par ancres HTML natives.
       * Effet visuel "tab-like" avec fond et coins arrondis.
       * ================================================================== */}
      <nav
        className="mx-auto mb-12 flex max-w-md items-center justify-center gap-2 rounded-full p-1.5 lg:mb-16"
        style={{ backgroundColor: "var(--color-bg-section)" }}
        aria-label="Naviguer entre les sections tarifaires"
      >
        <a
          href="#offres-web-heading"
          className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          Offres Web
        </a>
        <a
          href="#offres-api-heading"
          className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Code className="h-4 w-4" aria-hidden="true" />
          Offres API
        </a>
      </nav>

      {/* ==================================================================
       * SECTION 3 — Offres Web
       * Grille de 3 cartes pour les plans web (Decouverte, Essentiel, Pro).
       * Le plan "Acces Pro" est mis en evidence avec isPopular.
       * ================================================================== */}
      <section className="mb-16 lg:mb-24" aria-labelledby="offres-web-heading">
        {/* Titre de section avec id pour aria-labelledby ET navigation ancre */}
        <h2 id="offres-web-heading" className="sr-only">
          Offres Web
        </h2>
        <PricingSectionHeader
          title="Offres Web"
          subtitle="Accedez a Dixipolis depuis votre navigateur"
          icon={Globe}
        />

        {/* Grille responsive : 1 col mobile, 2 cols tablette, 3 cols desktop */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PRICING_PLANS_WEB.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* ==================================================================
       * SECTION 4 — Offres API
       * Grille de 3 cartes pour les plans API (Starter, Pro, Entreprise).
       * Le plan "API Pro" est populaire, le plan "Entreprise" est sur devis.
       * ================================================================== */}
      <section className="mb-16 lg:mb-24" aria-labelledby="offres-api-heading">
        {/* Titre de section avec id pour aria-labelledby ET navigation ancre */}
        <h2 id="offres-api-heading" className="sr-only">
          Offres API
        </h2>
        <PricingSectionHeader
          title="Offres API"
          subtitle="Integrez les donnees Dixipolis dans vos applications"
          icon={Code}
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
       * SECTION 5 — Liste d'attente
       *
       * Les offres ne sont pas encore souscriptibles : les CTA des cartes
       * tarifaires pointent vers cette section (ancre #waitlist).
       * scroll-mt compense le header fixe lors de la navigation par ancre.
       * ================================================================== */}
      <section
        id="waitlist"
        className="mx-auto mb-16 max-w-md scroll-mt-24 lg:mb-24"
        aria-labelledby="waitlist-heading"
      >
        <div className="card p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)",
              }}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Liste d&apos;attente
            </div>
            <h2
              id="waitlist-heading"
              className="mb-3 text-2xl font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Les offres ouvrent bient&ocirc;t
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Les abonnements ne sont pas encore souscriptibles. Laissez votre
              email pour &ecirc;tre pr&eacute;venu du lancement des offres Web
              et API.
            </p>
          </div>
          <WaitlistForm source="tarifs" />
        </div>
      </section>

      {/* ==================================================================
       * SECTION 6 — Foire Aux Questions (FAQ)
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
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
            }}
          >
            <Zap className="h-4 w-4" aria-hidden="true" />
            FAQ
          </div>
          <h2
            id="faq-heading"
            className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Questions frequentes
          </h2>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Tout ce que vous devez savoir sur nos offres et services
          </p>
        </div>

        {/* Liste des questions avec accordeon natif */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={index}
              className="card group overflow-hidden border"
              style={{ borderColor: "var(--color-border)" }}
            >
              {/* --------------------------------------------------------
               * Summary — Titre cliquable de la question
               * Le chevron natif du navigateur est masque via marker:hidden.
               * Un indicateur "+" est simule et tourne a 45deg quand ouvert.
               * -------------------------------------------------------- */}
              <summary
                className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold transition-colors list-none [&::-webkit-details-marker]:hidden"
                style={{ color: "var(--color-text-primary)" }}
              >
                <span>{item.question}</span>
                {/* Indicateur visuel d'ouverture/fermeture */}
                <span
                  className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform group-open:rotate-45"
                  style={{
                    backgroundColor: "var(--color-bg-section)",
                    color: "var(--color-text-muted)",
                  }}
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>

              {/* --------------------------------------------------------
               * Contenu de la reponse
               * Affiche uniquement lorsque le <details> est ouvert.
               * Bordure superieure pour creer une separation visuelle.
               * -------------------------------------------------------- */}
              <div
                className="border-t px-6 pb-5 pt-4"
                style={{ borderColor: "var(--color-border-light)" }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
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

/* =============================================================================
 * app/api-pro/page.tsx
 *
 * Page principale "API Pro" de l'application Dixipolis.
 *
 * Cette page presente l'offre API destinee aux developpeurs et entreprises
 * souhaitant integrer les donnees du discours politique francais dans
 * leurs propres applications, outils d'analyse ou tableaux de bord.
 *
 * Structure de la page :
 *   1. ApiHero       — Section hero avec titre, description et CTAs
 *   2. ApiFeatures   — Grille des 6 fonctionnalites de l'API
 *   3. CodeExample   — Exemple interactif de requete/reponse (client component)
 *   4. EndpointList  — Liste des endpoints REST disponibles
 *   5. ApiPricing    — Grille tarifaire des 3 plans API
 *   6. Section CTA   — Appel a l'action final avec lien vers contact
 *
 * Composant serveur (Server Component) par defaut.
 * Seul CodeExample est un composant client (gestion d'onglets + copie).
 *
 * Metadonnees SEO :
 *   - Titre optimise pour le referencement ("API Pro — Dixipolis")
 *   - Description meta ciblant les developpeurs et entreprises
 *
 * PageWrapper :
 *   - Utilise le composant layout/PageWrapper pour appliquer le container
 *     centre, le padding-top (header fixe) et la balise <main> semantique.
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import ApiHero from "@/components/api-pro/ApiHero";
import ApiFeatures from "@/components/api-pro/ApiFeatures";
import CodeExample from "@/components/api-pro/CodeExample";
import EndpointList from "@/components/api-pro/EndpointList";
import ApiPricing from "@/components/api-pro/ApiPricing";

/* --------------------------------------------------------------------------
 * Metadonnees SEO — Next.js App Router (export statique)
 *
 * Le titre suit le pattern "[Nom de page] — [Nom du site]" pour une
 * hierarchie coherente dans les onglets du navigateur et les SERP.
 * La description cible les mots-cles techniques pertinents pour le
 * public vise (developpeurs, entreprises, API, integration).
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "API Pro \u2014 Dixipolis",
  description:
    "Acc\u00e9dez aux donn\u00e9es du discours politique fran\u00e7ais via l\u2019API RESTful Dixipolis. Recherche s\u00e9mantique, extraction de citations, m\u00e9tadonn\u00e9es compl\u00e8tes. Documentation, exemples de code et tarifs.",
};

/* --------------------------------------------------------------------------
 * ApiProPage — Composant de page principal
 *
 * Assemble toutes les sections de la page API Pro dans l'ordre voulu.
 * Le PageWrapper fournit le conteneur centre et le padding-top pour
 * compenser le header fixe. Cependant, les sections hero, features,
 * code example, endpoints et pricing gèrent leur propre mise en page
 * (pleine largeur avec page-container interne).
 *
 * La section CTA finale est rendue directement ici car elle est
 * specifique a cette page et n'a pas besoin d'etre un composant separe.
 * -------------------------------------------------------------------------- */
export default function ApiProPage() {
  return (
    <PageWrapper className="!max-w-none !px-0">
      {/* =================================================================
       * 1. HERO — Presentation de l'API Pro
       * Section plein ecran avec degrade, titre, sous-titre et CTAs.
       * ================================================================= */}
      <ApiHero />

      {/* =================================================================
       * 2. FONCTIONNALITES — Grille des 6 capacites de l'API
       * Recherche semantique, extraction, metadonnees, webhooks, etc.
       * ================================================================= */}
      <ApiFeatures />

      {/* =================================================================
       * 3. EXEMPLE DE CODE — Requete/reponse interactive
       * Composant client avec onglets (cURL, Python, JavaScript),
       * bloc de code colore et bouton de copie.
       * ================================================================= */}
      <CodeExample />

      {/* =================================================================
       * 4. ENDPOINTS — Liste des routes API disponibles
       * Tableau structure avec methode, chemin et description.
       * ================================================================= */}
      <EndpointList />

      {/* =================================================================
       * 5. TARIFS — Plans API (Starter, Pro, Entreprise)
       * Cartes tarifaires avec features et CTAs.
       * ================================================================= */}
      <ApiPricing />

      {/* =================================================================
       * 6. SECTION CTA FINALE
       * Appel a l'action pour encourager les developpeurs a demarrer
       * ou a contacter l'equipe pour des besoins specifiques.
       * Section avec fond bleu fonce pour contraster avec le reste.
       * ================================================================= */}
      <section
        className="bg-[var(--color-bg-header)] py-16 sm:py-20 lg:py-24"
        aria-label="Appel \u00e0 l'action final"
      >
        <div className="page-container">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icone decorative */}
            <div
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]"
              aria-hidden="true"
            >
              <Code className="h-7 w-7 text-white" />
            </div>

            {/* Titre CTA */}
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pr&ecirc;t &agrave; int&eacute;grer Dixipolis ?
            </h2>

            {/* Description CTA */}
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[var(--color-text-on-dark)]">
              Cr&eacute;ez votre cl&eacute; API en quelques minutes et commencez
              &agrave; exploiter les donn&eacute;es du discours politique fran&ccedil;ais
              dans vos applications.
            </p>

            {/* Boutons CTA */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* CTA principal — Creer un compte */}
              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-all duration-[var(--transition-fast)] hover:bg-slate-100 hover:shadow-md sm:text-base"
              >
                Cr&eacute;er ma cl&eacute; API
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              {/* CTA secondaire — Contacter l'equipe */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-[var(--transition-fast)] hover:border-white hover:bg-white/10 sm:text-base"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

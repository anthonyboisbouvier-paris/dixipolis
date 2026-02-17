/* =============================================================================
 * app/mentions-legales/page.tsx
 *
 * Page "Mentions Legales" de l'application Dixipolis.
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Contenu obligatoire au regard de la loi francaise (loi n°2004-575 du
 * 21 juin 2004 pour la confiance dans l'economie numerique — LCEN).
 *
 * Sections :
 *   1. Editeur du site    — Identite de la societe, representant legal
 *   2. Hebergeur          — Informations sur l'hebergeur (Vercel Inc.)
 *   3. Propriete intellectuelle — Droits sur le contenu et la marque
 *   4. Responsabilite     — Limitation de responsabilite, liens externes
 *   5. Contact            — Coordonnees pour toute demande
 *
 * Conventions :
 *   - Variables CSS du theme Dixipolis
 *   - Carte blanche unique contenant toutes les sections
 *   - Hierarchie : h1 > h2 pour chaque section > p pour le contenu
 *   - Separateurs visuels entre les sections
 *   - Ton formel et precis, adapte a un document juridique
 *
 * SEO :
 *   - Exporte un objet metadata Next.js
 *   - Page indexable mais non prioritaire (noindex optionnel)
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

/* --------------------------------------------------------------------------
 * METADONNEES SEO
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Mentions Legales",
  description:
    "Mentions legales du site Dixipolis. Informations sur l'editeur, l'hebergeur, la propriete intellectuelle et la responsabilite.",
};

/* --------------------------------------------------------------------------
 * CONSTANTE — Date de derniere mise a jour des mentions legales
 * A actualiser manuellement a chaque modification du contenu.
 * -------------------------------------------------------------------------- */
const LAST_UPDATED = "15 janvier 2025";

/* --------------------------------------------------------------------------
 * MentionsLegalesPage — Composant principal
 *
 * Structure en une seule carte blanche avec des sections separees
 * par des bordures horizontales pour une lecture claire.
 * -------------------------------------------------------------------------- */
export default function MentionsLegalesPage() {
  return (
    <PageWrapper className="py-12 md:py-16 lg:py-20">
      {/* ================================================================
       * EN-TETE — Titre et date de mise a jour
       * ================================================================ */}
      <section className="text-center mb-10 md:mb-14" aria-label="Introduction">
        {/* Badge contextuel */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)]">
          <FileText className="h-4 w-4" aria-hidden="true" />
          Document legal
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Mentions Legales
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Derniere mise a jour : {LAST_UPDATED}
        </p>
      </section>

      {/* ================================================================
       * CONTENU PRINCIPAL — Carte unique avec sections separees
       * ================================================================ */}
      <div className="card p-6 sm:p-8 md:p-10 lg:p-12 max-w-4xl mx-auto">
        {/* ----------------------------------------------------------------
         * SECTION 1 — Editeur du site
         * Conformement a l'article 6 de la LCEN.
         * ---------------------------------------------------------------- */}
        <section className="mb-8 pb-8 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            1. Editeur du site
          </h2>
          <div className="space-y-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <p>
              Le site <strong className="text-[var(--color-text-primary)]">dixipolis.fr</strong> est
              edite par :
            </p>
            <ul className="list-none space-y-1.5 pl-0 mt-3">
              <li>
                <strong className="text-[var(--color-text-primary)]">Raison sociale :</strong>{" "}
                Dixipolis (SAS en cours de creation)
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Representant legal :</strong>{" "}
                Anthony Boisbouvier, President
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Adresse du siege :</strong>{" "}
                Paris, France (adresse precise communiquee sur demande)
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Email :</strong>{" "}
                <a
                  href="mailto:contact@dixipolis.fr"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  contact@dixipolis.fr
                </a>
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Numero SIRET :</strong>{" "}
                En cours d&apos;immatriculation
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Directeur de la publication :</strong>{" "}
                Anthony Boisbouvier
              </li>
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------------------
         * SECTION 2 — Hebergeur
         * Identification de l'hebergeur conformement a la LCEN.
         * ---------------------------------------------------------------- */}
        <section className="mb-8 pb-8 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            2. Hebergeur
          </h2>
          <div className="space-y-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <p>Le site est heberge par :</p>
            <ul className="list-none space-y-1.5 pl-0 mt-3">
              <li>
                <strong className="text-[var(--color-text-primary)]">Raison sociale :</strong>{" "}
                Vercel Inc.
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Adresse :</strong>{" "}
                340 S Lemon Ave #4133, Walnut, CA 91789, Etats-Unis
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Site web :</strong>{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  https://vercel.com
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------------------
         * SECTION 3 — Propriete intellectuelle
         * Protection du contenu, de la marque et du code source.
         * ---------------------------------------------------------------- */}
        <section className="mb-8 pb-8 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            3. Propriete intellectuelle
          </h2>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <p>
              L&apos;ensemble du contenu du site dixipolis.fr (textes, images,
              graphismes, logo, icones, logiciels, bases de donnees,
              architecture technique) est protege par le droit d&apos;auteur et
              les lois relatives a la propriete intellectuelle.
            </p>
            <p>
              La marque Dixipolis, son logo et ses elements visuels
              distinctifs sont la propriete exclusive de Dixipolis SAS (en
              cours de creation). Toute reproduction, representation,
              modification ou exploitation non autorisee de tout ou partie
              de ces elements est interdite et constitue une contrefacon
              sanctionnee par les articles L.335-2 et suivants du Code de la
              propriete intellectuelle.
            </p>
            <p>
              Les analyses generees par la plateforme sont le resultat de
              traitements automatises par intelligence artificielle. Elles
              ne constituent ni une oeuvre originale ni un avis editorial.
              Les citations de discours politiques sont reproduites a titre
              d&apos;information et dans le cadre du droit de courte citation
              (article L.122-5 du Code de la propriete intellectuelle).
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------
         * SECTION 4 — Responsabilite
         * Limitation de responsabilite sur le contenu et les liens externes.
         * ---------------------------------------------------------------- */}
        <section className="mb-8 pb-8 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            4. Responsabilite
          </h2>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <p>
              Dixipolis s&apos;efforce de fournir des informations aussi
              precises et actualisees que possible. Toutefois, Dixipolis ne
              saurait garantir l&apos;exactitude, la completude ou
              l&apos;actualite des informations diffusees sur le site.
            </p>
            <p>
              Les analyses et resultats fournis par la plateforme sont
              generes automatiquement par des algorithmes d&apos;intelligence
              artificielle. Ils sont presentes a titre informatif et ne
              sauraient se substituer a une analyse humaine approfondie.
              L&apos;utilisateur reste seul responsable de l&apos;usage qu&apos;il
              fait des informations obtenues via la plateforme.
            </p>
            <p>
              Le site peut contenir des liens hypertextes vers des sites
              tiers. Dixipolis n&apos;exerce aucun controle sur le contenu de
              ces sites et decline toute responsabilite quant a leur contenu
              ou aux eventuels dommages resultant de leur consultation.
            </p>
            <p>
              Dixipolis ne pourra etre tenu responsable des dommages directs
              ou indirects resultant de l&apos;acces au site ou de
              l&apos;impossibilite d&apos;y acceder, ainsi que de l&apos;utilisation
              des informations qui y sont diffusees.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------
         * SECTION 5 — Contact
         * Coordonnees pour toute question relative aux mentions legales.
         * ---------------------------------------------------------------- */}
        <section>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            5. Contact
          </h2>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <p>
              Pour toute question ou reclamation concernant les presentes
              mentions legales, vous pouvez nous contacter :
            </p>
            <ul className="list-none space-y-1.5 pl-0 mt-3">
              <li>
                <strong className="text-[var(--color-text-primary)]">Par email :</strong>{" "}
                <a
                  href="mailto:contact@dixipolis.fr"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  contact@dixipolis.fr
                </a>
              </li>
              <li>
                <strong className="text-[var(--color-text-primary)]">Via le formulaire :</strong>{" "}
                <Link
                  href="/contact"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Page de contact
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

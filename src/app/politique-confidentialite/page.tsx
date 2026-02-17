/* =============================================================================
 * app/politique-confidentialite/page.tsx
 *
 * Page "Politique de Confidentialite" de l'application Dixipolis.
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Redesign premium avec typographie soignee et hierarchie de sections claire.
 *
 * Document conforme au Reglement General sur la Protection des Donnees (RGPD)
 * — Reglement (UE) 2016/679 — et a la loi Informatique et Libertes modifiee.
 *
 * Sections obligatoires RGPD :
 *   1. Introduction
 *   2. Responsable du traitement
 *   3. Donnees collectees
 *   4. Finalites du traitement
 *   5. Base legale
 *   6. Durees de conservation
 *   7. Destinataires
 *   8. Transferts hors UE
 *   9. Droits des utilisateurs
 *  10. Cookies
 *  11. Securite
 *  12. Contact DPO
 *  13. Modifications
 *
 * Conventions :
 *   - Variables CSS du theme Dixipolis via style={{ }}
 *   - Pas de Tailwind brut pour les couleurs
 *   - Carte blanche unique avec sections numerotees
 *   - Hierarchie : h1 > h2 (numerotees) > h3 (sous-sections) > p pour le contenu
 *   - Ton formel et precis, vocabulaire juridique RGPD
 *
 * SEO :
 *   - Exporte un objet metadata Next.js
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

/* --------------------------------------------------------------------------
 * METADONNEES SEO
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Politique de Confidentialite",
  description:
    "Politique de confidentialite de Dixipolis. Informations sur la collecte, le traitement et la protection de vos donnees personnelles conformement au RGPD.",
};

/* --------------------------------------------------------------------------
 * CONSTANTE — Date de derniere mise a jour
 * -------------------------------------------------------------------------- */
const LAST_UPDATED = "15 fevrier 2025";

/* --------------------------------------------------------------------------
 * Composant reutilisable pour les sections juridiques
 * Evite la repetition du pattern section + bordure + titre + contenu.
 * -------------------------------------------------------------------------- */
function LegalSection({
  title,
  children,
  isLast = false,
}: {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <section
      className={isLast ? "" : "mb-8 pb-8"}
      style={isLast ? undefined : { borderBottom: "1px solid var(--color-border)" }}
    >
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h2>
      <div
        className="space-y-3 text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {children}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
 * PolitiqueConfidentialitePage — Composant principal
 *
 * Document juridique structure en sections numerotees.
 * Chaque section traite d'un aspect specifique de la protection des donnees.
 * Pas de pt-offset car le root layout gere deja le padding-top de 72px.
 * -------------------------------------------------------------------------- */
export default function PolitiqueConfidentialitePage() {
  return (
    <PageWrapper>
      {/* ================================================================
       * EN-TETE — Titre et date de mise a jour
       * ================================================================ */}
      <section className="text-center mb-10 md:mb-14" aria-label="Introduction">
        {/* Badge contextuel */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Shield className="h-4 w-4" aria-hidden="true" />
          Protection des donnees
        </div>

        <h1
          className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Politique de Confidentialite
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Derniere mise a jour : {LAST_UPDATED}
        </p>
      </section>

      {/* ================================================================
       * CONTENU PRINCIPAL — Carte unique avec sections numerotees
       * ================================================================ */}
      <div className="card p-6 sm:p-8 md:p-10 lg:p-12 max-w-4xl mx-auto">
        {/* SECTION 1 — Introduction */}
        <LegalSection title="1. Introduction">
          <p>
            La societe Dixipolis (SAS en cours de creation), editrice du site
            dixipolis.fr, s&apos;engage a proteger la vie privee de ses
            utilisateurs conformement au Reglement General sur la Protection
            des Donnees (RGPD — Reglement UE 2016/679) et a la loi
            Informatique et Libertes du 6 janvier 1978 modifiee.
          </p>
          <p>
            La presente politique de confidentialite a pour objet de vous
            informer de maniere transparente sur la collecte, le traitement
            et la protection de vos donnees personnelles lorsque vous
            utilisez notre plateforme.
          </p>
        </LegalSection>

        {/* SECTION 2 — Responsable du traitement */}
        <LegalSection title="2. Responsable du traitement">
          <p>Le responsable du traitement des donnees personnelles est :</p>
          <ul className="list-none space-y-1.5 pl-0 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Societe :</strong>{" "}
              Dixipolis (SAS en cours de creation)
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Representant :</strong>{" "}
              Anthony Boisbouvier, President
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Email :</strong>{" "}
              <a
                href="mailto:contact@dixipolis.fr"
                style={{ color: "var(--color-primary)" }}
                className="hover:underline"
              >
                contact@dixipolis.fr
              </a>
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Adresse :</strong>{" "}
              Paris, France
            </li>
          </ul>
        </LegalSection>

        {/* SECTION 3 — Donnees collectees */}
        <LegalSection title="3. Donnees collectees">
          <p>
            Dans le cadre de l&apos;utilisation de la plateforme Dixipolis,
            nous pouvons etre amenes a collecter les categories de donnees
            suivantes :
          </p>

          <h3
            className="text-base font-semibold mt-4 mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            3.1. Donnees d&apos;identification
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nom et prenom (lors de la creation de compte)</li>
            <li>Adresse email (authentification via Supabase Auth)</li>
            <li>Mot de passe (stocke sous forme hashee par Supabase Auth)</li>
          </ul>

          <h3
            className="text-base font-semibold mt-4 mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            3.2. Donnees d&apos;utilisation
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Historique des requetes effectuees sur la plateforme</li>
            <li>Preferences de recherche et filtres utilises</li>
            <li>Contenus sauvegardes ou mis en favoris</li>
          </ul>

          <h3
            className="text-base font-semibold mt-4 mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            3.3. Donnees techniques
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Adresse IP (anonymisee dans les journaux de connexion)</li>
            <li>Type de navigateur et systeme d&apos;exploitation</li>
            <li>Pages visitees et duree des sessions</li>
            <li>Cookies techniques et fonctionnels</li>
          </ul>

          <h3
            className="text-base font-semibold mt-4 mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            3.4. Donnees de contact
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Informations transmises via le formulaire de contact (nom,
              email, message)
            </li>
          </ul>
        </LegalSection>

        {/* SECTION 4 — Finalites du traitement */}
        <LegalSection title="4. Finalites du traitement">
          <p>
            Vos donnees personnelles sont collectees et traitees pour les
            finalites suivantes :
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Gestion des comptes utilisateurs :</strong>{" "}
              creation, authentification et gestion de votre compte via
              Supabase Auth
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Fourniture du service :</strong>{" "}
              traitement de vos requetes de recherche, personnalisation de
              l&apos;experience utilisateur et affichage des resultats
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Amelioration de la plateforme :</strong>{" "}
              analyse des usages pour ameliorer nos algorithmes, notre
              interface et la qualite de nos resultats
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Communication :</strong>{" "}
              reponse a vos demandes de contact, envoi de newsletters
              (avec votre consentement)
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Securite :</strong>{" "}
              prevention des fraudes, detection des abus et protection de
              la plateforme
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Obligations legales :</strong>{" "}
              respect des obligations comptables, fiscales et reglementaires
            </li>
          </ul>
        </LegalSection>

        {/* SECTION 5 — Base legale du traitement */}
        <LegalSection title="5. Base legale du traitement">
          <p>
            Le traitement de vos donnees personnelles repose sur les bases
            legales suivantes :
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Execution du contrat</strong>{" "}
              (article 6.1.b du RGPD) : le traitement est necessaire a
              l&apos;execution du service auquel vous avez souscrit lors de la
              creation de votre compte
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Interet legitime</strong>{" "}
              (article 6.1.f du RGPD) : l&apos;amelioration de la plateforme,
              la securite du service et l&apos;analyse statistique anonymisee
              reposent sur notre interet legitime
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Consentement</strong>{" "}
              (article 6.1.a du RGPD) : l&apos;envoi de communications
              commerciales et l&apos;utilisation de cookies non essentiels sont
              soumis a votre consentement prealable
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Obligation legale</strong>{" "}
              (article 6.1.c du RGPD) : certains traitements sont
              necessaires au respect de nos obligations legales
            </li>
          </ul>
        </LegalSection>

        {/* SECTION 6 — Durees de conservation */}
        <LegalSection title="6. Durees de conservation">
          <p>
            Vos donnees personnelles sont conservees pour la duree
            strictement necessaire aux finalites pour lesquelles elles ont
            ete collectees :
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Donnees de compte :</strong>{" "}
              pendant toute la duree de votre inscription, puis 3 ans apres
              la derniere activite sur votre compte
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Donnees d&apos;utilisation :</strong>{" "}
              12 mois apres leur collecte (puis anonymisees pour les
              statistiques)
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Donnees de contact :</strong>{" "}
              3 ans a compter du dernier echange
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Journaux techniques :</strong>{" "}
              12 mois conformement aux obligations legales
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Donnees de facturation :</strong>{" "}
              10 ans conformement aux obligations comptables
            </li>
          </ul>
          <p className="mt-3">
            A l&apos;expiration de ces delais, les donnees sont supprimees ou
            anonymisees de maniere irreversible.
          </p>
        </LegalSection>

        {/* SECTION 7 — Destinataires des donnees */}
        <LegalSection title="7. Destinataires des donnees">
          <p>
            Vos donnees personnelles peuvent etre communiquees aux
            destinataires suivants :
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Equipe interne Dixipolis :</strong>{" "}
              personnel habilite dans le cadre de ses fonctions
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Supabase Inc. :</strong>{" "}
              sous-traitant pour l&apos;authentification et le stockage des
              donnees (serveurs UE)
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Vercel Inc. :</strong>{" "}
              sous-traitant pour l&apos;hebergement du site
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Prestataires de paiement :</strong>{" "}
              le cas echeant, pour le traitement des transactions (Stripe)
            </li>
          </ul>
          <p className="mt-3">
            Vos donnees ne sont jamais vendues a des tiers. Elles ne sont
            partagees qu&apos;avec des prestataires lies par des engagements
            contractuels de confidentialite conformes au RGPD.
          </p>
        </LegalSection>

        {/* SECTION 8 — Transferts hors Union europeenne */}
        <LegalSection title="8. Transferts hors Union europeenne">
          <p>
            Certains de nos sous-traitants (Vercel, Supabase) peuvent traiter
            des donnees en dehors de l&apos;Union europeenne, notamment aux
            Etats-Unis. Ces transferts sont encadres par :
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            <li>Le cadre de protection des donnees UE-Etats-Unis (EU-US Data Privacy Framework)</li>
            <li>Des clauses contractuelles types (CCT) approuvees par la Commission europeenne</li>
            <li>Des mesures supplementaires de securite technique (chiffrement, pseudonymisation)</li>
          </ul>
        </LegalSection>

        {/* SECTION 9 — Droits des utilisateurs */}
        <LegalSection title="9. Droits des utilisateurs">
          <p>
            Conformement au RGPD, vous disposez des droits suivants sur vos
            donnees personnelles :
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Droit d&apos;acces</strong>{" "}
              (article 15) : obtenir la confirmation que vos donnees sont
              traitees et en recevoir une copie
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Droit de rectification</strong>{" "}
              (article 16) : faire corriger des donnees inexactes ou
              incompletes
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Droit a l&apos;effacement</strong>{" "}
              (article 17) : demander la suppression de vos donnees dans
              les conditions prevues par le RGPD
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Droit a la limitation</strong>{" "}
              (article 18) : demander la suspension temporaire du
              traitement de vos donnees
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Droit a la portabilite</strong>{" "}
              (article 20) : recevoir vos donnees dans un format
              structure et lisible par machine
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Droit d&apos;opposition</strong>{" "}
              (article 21) : vous opposer au traitement de vos donnees
              pour des motifs legitimes
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Droit de retrait du consentement :</strong>{" "}
              retirer votre consentement a tout moment pour les traitements
              fondes sur celui-ci
            </li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, vous pouvez nous contacter a l&apos;adresse{" "}
            <a
              href="mailto:dpo@dixipolis.fr"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline"
            >
              dpo@dixipolis.fr
            </a>{" "}
            ou via notre{" "}
            <Link
              href="/contact"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline"
            >
              formulaire de contact
            </Link>
            . Nous repondrons dans un delai maximum de 30 jours.
          </p>
          <p>
            Vous disposez egalement du droit d&apos;introduire une
            reclamation aupres de la CNIL (Commission Nationale de
            l&apos;Informatique et des Libertes) :{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline"
            >
              www.cnil.fr
            </a>
          </p>
        </LegalSection>

        {/* SECTION 10 — Cookies */}
        <LegalSection title="10. Cookies">
          <p>
            Le site dixipolis.fr utilise des cookies pour assurer son bon
            fonctionnement et ameliorer l&apos;experience utilisateur.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Cookies strictement necessaires :</strong>{" "}
              indispensables au fonctionnement du site (session
              d&apos;authentification Supabase, preferences de langue). Ils ne
              necessitent pas votre consentement.
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Cookies analytiques :</strong>{" "}
              utilises pour mesurer l&apos;audience et comprendre comment les
              visiteurs utilisent le site. Soumis a votre consentement
              prealable.
            </li>
          </ul>
          <p className="mt-3">
            Vous pouvez a tout moment modifier vos preferences en matiere de
            cookies via les parametres de votre navigateur.
          </p>
        </LegalSection>

        {/* SECTION 11 — Securite des donnees */}
        <LegalSection title="11. Securite des donnees">
          <p>
            Dixipolis met en oeuvre des mesures techniques et
            organisationnelles appropriees pour proteger vos donnees
            personnelles contre tout acces non autorise, toute perte,
            alteration ou divulgation :
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            <li>Chiffrement des communications (HTTPS/TLS)</li>
            <li>Hashage des mots de passe (bcrypt via Supabase Auth)</li>
            <li>Authentification a deux facteurs (optionnelle)</li>
            <li>Controle d&apos;acces strict aux bases de donnees</li>
            <li>Sauvegardes regulieres et chiffrees</li>
            <li>Surveillance continue des infrastructures</li>
          </ul>
        </LegalSection>

        {/* SECTION 12 — Contact DPO */}
        <LegalSection title="12. Contact — Delegue a la Protection des Donnees">
          <p>
            Pour toute question relative a la protection de vos donnees
            personnelles ou pour exercer vos droits, vous pouvez contacter
            notre referent donnees personnelles :
          </p>
          <ul className="list-none space-y-1.5 pl-0 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Email DPO :</strong>{" "}
              <a
                href="mailto:dpo@dixipolis.fr"
                style={{ color: "var(--color-primary)" }}
                className="hover:underline"
              >
                dpo@dixipolis.fr
              </a>
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Adresse postale :</strong>{" "}
              Dixipolis — DPO, Paris, France
            </li>
          </ul>
        </LegalSection>

        {/* SECTION 13 — Modifications de la politique */}
        <LegalSection title="13. Modifications de la presente politique" isLast>
          <p>
            Dixipolis se reserve le droit de modifier la presente politique
            de confidentialite a tout moment afin de se conformer aux
            evolutions legislatives, reglementaires ou technologiques.
          </p>
          <p>
            En cas de modification substantielle, nous vous en informerons
            par email ou via une notification sur la plateforme. La date de
            derniere mise a jour est indiquee en haut de ce document.
          </p>
          <p>
            Nous vous invitons a consulter regulierement cette page pour
            rester informe de nos pratiques en matiere de protection des
            donnees.
          </p>
        </LegalSection>
      </div>
    </PageWrapper>
  );
}

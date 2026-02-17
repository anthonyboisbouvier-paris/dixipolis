/* =============================================================================
 * app/cgu/page.tsx
 *
 * Page "Conditions Generales d'Utilisation" (CGU) de Dixipolis.
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Redesign premium avec typographie soignee et LegalSection reutilisable.
 *
 * Document contractuel definissant les regles d'utilisation de la plateforme
 * Dixipolis par ses utilisateurs. Redige en conformite avec le droit francais
 * (Code civil, Code de la consommation, loi LCEN).
 *
 * Sections :
 *   1. Objet
 *   2. Definitions
 *   3. Acces au service
 *   4. Description du service
 *   5. Propriete intellectuelle
 *   6. Responsabilites de l'utilisateur
 *   7. Responsabilite de Dixipolis
 *   8. Donnees personnelles
 *   9. Modification des CGU
 *  10. Resiliation
 *  11. Droit applicable et litiges
 *  12. Contact
 *
 * Conventions :
 *   - Variables CSS du theme Dixipolis via style={{ }}
 *   - Pas de Tailwind brut pour les couleurs
 *   - Carte blanche unique avec sections numerotees
 *   - Hierarchie : h1 > h2 (numerotees) > h3 (sous-sections) > p
 *   - Ton contractuel et formel
 *
 * SEO :
 *   - Exporte un objet metadata Next.js
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

/* --------------------------------------------------------------------------
 * METADONNEES SEO
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "Conditions Generales d'Utilisation",
  description:
    "Conditions generales d'utilisation de la plateforme Dixipolis. Regles d'acces, propriete intellectuelle, responsabilites et droit applicable.",
};

/* --------------------------------------------------------------------------
 * CONSTANTE — Date de derniere mise a jour
 * -------------------------------------------------------------------------- */
const LAST_UPDATED = "15 fevrier 2025";

/* --------------------------------------------------------------------------
 * Composant reutilisable pour les sections juridiques
 * Evite la repetition du pattern section + bordure + titre + contenu.
 * Identique a celui de la politique de confidentialite pour coherence.
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
 * CGUPage — Composant principal
 *
 * Document contractuel structure en sections numerotees.
 * Chaque section couvre un aspect juridique des conditions d'utilisation.
 * Pas de pt-offset car le root layout gere deja le padding-top de 72px.
 * -------------------------------------------------------------------------- */
export default function CGUPage() {
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
          <FileText className="h-4 w-4" aria-hidden="true" />
          Document contractuel
        </div>

        <h1
          className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Conditions Generales d&apos;Utilisation
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
        {/* SECTION 1 — Objet */}
        <LegalSection title="1. Objet">
          <p>
            Les presentes Conditions Generales d&apos;Utilisation (ci-apres
            &quot;CGU&quot;) ont pour objet de definir les modalites et
            conditions d&apos;utilisation de la plateforme Dixipolis,
            accessible a l&apos;adresse{" "}
            <a
              href="https://dixipolis.fr"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline"
            >
              dixipolis.fr
            </a>
            , ainsi que les droits et obligations des parties dans ce cadre.
          </p>
          <p>
            L&apos;utilisation de la plateforme implique l&apos;acceptation
            pleine et entiere des presentes CGU. Si vous n&apos;acceptez pas
            ces conditions, vous etes invite a ne pas utiliser le service.
          </p>
        </LegalSection>

        {/* SECTION 2 — Definitions */}
        <LegalSection title="2. Definitions">
          <p>
            Dans les presentes CGU, les termes suivants ont la signification
            ci-apres :
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>&quot;Plateforme&quot; :</strong>{" "}
              designe le site web dixipolis.fr et l&apos;ensemble des
              services proposes par Dixipolis, incluant l&apos;interface web
              et l&apos;API
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>&quot;Utilisateur&quot; :</strong>{" "}
              designe toute personne physique ou morale qui accede a la
              Plateforme et utilise ses services, qu&apos;elle dispose ou
              non d&apos;un compte
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>&quot;Contenu&quot; :</strong>{" "}
              designe l&apos;ensemble des textes, analyses, donnees,
              graphiques, resultats de recherche et elements visuels
              generes ou affiches par la Plateforme
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>&quot;Service&quot; :</strong>{" "}
              designe les fonctionnalites proposees par Dixipolis, notamment
              la recherche semantique dans les discours politiques, les
              analyses thematiques et les alertes
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>&quot;Editeur&quot; :</strong>{" "}
              designe Dixipolis (SAS en cours de creation), editeur de la
              Plateforme
            </li>
          </ul>
        </LegalSection>

        {/* SECTION 3 — Acces au service */}
        <LegalSection title="3. Acces au service">
          <h3
            className="text-base font-semibold mt-2 mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            3.1. Conditions d&apos;inscription
          </h3>
          <p>
            L&apos;acces a certaines fonctionnalites de la Plateforme
            necessite la creation d&apos;un compte utilisateur.
            L&apos;inscription est ouverte a toute personne physique
            majeure ou a toute personne morale dument representee.
          </p>
          <p>
            L&apos;Utilisateur s&apos;engage a fournir des informations
            exactes, completes et a jour lors de son inscription. Il est
            responsable de la confidentialite de ses identifiants de
            connexion et de toutes les activites effectuees depuis son
            compte.
          </p>

          <h3
            className="text-base font-semibold mt-5 mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            3.2. Disponibilite du service
          </h3>
          <p>
            Dixipolis s&apos;efforce de maintenir la Plateforme accessible
            24 heures sur 24, 7 jours sur 7. Toutefois, l&apos;acces peut
            etre temporairement interrompu pour des raisons de maintenance,
            de mise a jour ou en cas de force majeure, sans que cela ne
            puisse donner lieu a une quelconque indemnite.
          </p>

          <h3
            className="text-base font-semibold mt-5 mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            3.3. Offres et tarification
          </h3>
          <p>
            La Plateforme propose differentes formules d&apos;acces,
            gratuites et payantes, dont les details sont decrits sur la
            page{" "}
            <Link
              href="/tarifs"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline"
            >
              Tarifs
            </Link>
            . Dixipolis se reserve le droit de modifier ses tarifs a tout
            moment, les nouvelles conditions tarifaires s&apos;appliquant
            a compter du renouvellement de l&apos;abonnement.
          </p>
        </LegalSection>

        {/* SECTION 4 — Description du service */}
        <LegalSection title="4. Description du service">
          <p>
            Dixipolis est une plateforme d&apos;intelligence artificielle
            dediee a l&apos;analyse du discours politique francais. Les
            services proposes incluent notamment :
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            <li>
              Recherche semantique par prompt dans une base de donnees de
              discours, debats et interviews politiques
            </li>
            <li>
              Extraction et affichage de citations sourcees avec liens
              vers les enregistrements video horodates
            </li>
            <li>Fiches detaillees par responsable politique</li>
            <li>Tableaux de bord analytiques et tendances thematiques</li>
            <li>Generation de syntheses et de newsletters automatisees</li>
            <li>
              API permettant l&apos;integration des donnees dans des
              applications tierces
            </li>
          </ul>
          <p className="mt-3">
            Les resultats fournis par la Plateforme sont generes
            automatiquement par des algorithmes d&apos;intelligence
            artificielle et sont presentes a titre informatif. Ils ne
            sauraient se substituer a une analyse humaine.
          </p>
        </LegalSection>

        {/* SECTION 5 — Propriete intellectuelle */}
        <LegalSection title="5. Propriete intellectuelle">
          <p>
            L&apos;ensemble des elements constituant la Plateforme (code
            source, architecture, design, textes, graphismes, logo, bases
            de donnees, algorithmes) est la propriete exclusive de
            Dixipolis ou fait l&apos;objet d&apos;autorisations
            d&apos;utilisation, et est protege par les lois francaises et
            internationales relatives a la propriete intellectuelle.
          </p>
          <p>
            L&apos;Utilisateur beneficie d&apos;un droit d&apos;usage
            personnel, non exclusif et non cessible de la Plateforme dans
            le cadre de son abonnement. Toute reproduction, representation,
            modification, publication ou adaptation de tout ou partie des
            elements de la Plateforme est interdite sans autorisation
            prealable ecrite de Dixipolis.
          </p>
          <p>
            Les analyses et resultats generes par la Plateforme peuvent
            etre utilises par l&apos;Utilisateur dans le cadre de ses
            activites professionnelles ou personnelles, sous reserve de
            mentionner la source &quot;Dixipolis&quot; pour toute
            publication ou diffusion publique.
          </p>
        </LegalSection>

        {/* SECTION 6 — Responsabilites de l'utilisateur */}
        <LegalSection title="6. Responsabilites de l'Utilisateur">
          <p>L&apos;Utilisateur s&apos;engage a :</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            <li>
              Utiliser la Plateforme conformement a sa destination et aux
              presentes CGU
            </li>
            <li>
              Ne pas tenter de contourner les mesures techniques de
              protection ou les limitations d&apos;acces
            </li>
            <li>
              Ne pas utiliser la Plateforme a des fins illicites,
              diffamatoires, discriminatoires ou contraires a l&apos;ordre
              public
            </li>
            <li>
              Ne pas extraire systematiquement (scraping) le contenu de la
              Plateforme sans autorisation prealable
            </li>
            <li>
              Ne pas partager ses identifiants de connexion avec des tiers
            </li>
            <li>
              Respecter les limites d&apos;utilisation prevues par la
              formule d&apos;abonnement souscrite
            </li>
            <li>
              Ne pas denaturer ou presenter de maniere trompeuse les
              resultats obtenus via la Plateforme
            </li>
          </ul>
          <p className="mt-3">
            En cas de manquement a ces obligations, Dixipolis se reserve le
            droit de suspendre ou de resilier le compte de l&apos;Utilisateur
            sans preavis ni indemnite.
          </p>
        </LegalSection>

        {/* SECTION 7 — Responsabilite de Dixipolis */}
        <LegalSection title="7. Responsabilite de Dixipolis">
          <p>
            Dixipolis met en oeuvre les moyens raisonnables pour assurer
            la qualite et la fiabilite de ses services. Toutefois, la
            Plateforme est fournie &quot;en l&apos;etat&quot; et Dixipolis
            ne garantit pas :
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-3">
            <li>
              L&apos;exactitude, l&apos;exhaustivite ou l&apos;actualite
              des resultats generes par l&apos;intelligence artificielle
            </li>
            <li>
              La disponibilite ininterrompue et exempte d&apos;erreurs de
              la Plateforme
            </li>
            <li>
              L&apos;absence de virus ou d&apos;elements nuisibles sur le
              site
            </li>
          </ul>
          <p className="mt-3">
            La responsabilite de Dixipolis ne saurait etre engagee en cas
            de dommages indirects, y compris toute perte de profit, perte
            de donnees, perte de chance ou prejudice moral, resultant de
            l&apos;utilisation ou de l&apos;impossibilite d&apos;utiliser
            la Plateforme.
          </p>
          <p>
            En tout etat de cause, la responsabilite de Dixipolis est
            limitee au montant des sommes effectivement versees par
            l&apos;Utilisateur au cours des douze (12) mois precedant
            l&apos;evenement ayant donne lieu au dommage.
          </p>
        </LegalSection>

        {/* SECTION 8 — Donnees personnelles */}
        <LegalSection title="8. Donnees personnelles">
          <p>
            La collecte et le traitement des donnees personnelles des
            Utilisateurs sont regis par notre Politique de Confidentialite,
            accessible a l&apos;adresse suivante :{" "}
            <Link
              href="/politique-confidentialite"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline"
            >
              Politique de Confidentialite
            </Link>
            .
          </p>
          <p>
            En utilisant la Plateforme, l&apos;Utilisateur reconnait avoir
            pris connaissance de cette politique et accepte les modalites
            de traitement de ses donnees personnelles qui y sont decrites.
          </p>
        </LegalSection>

        {/* SECTION 9 — Modification des CGU */}
        <LegalSection title="9. Modification des CGU">
          <p>
            Dixipolis se reserve le droit de modifier les presentes CGU a
            tout moment. Les modifications prennent effet des leur
            publication sur la Plateforme.
          </p>
          <p>
            En cas de modification substantielle, les Utilisateurs
            disposant d&apos;un compte seront informes par email ou via une
            notification sur la Plateforme au moins trente (30) jours avant
            l&apos;entree en vigueur des nouvelles conditions.
          </p>
          <p>
            La poursuite de l&apos;utilisation de la Plateforme apres la
            date d&apos;entree en vigueur des modifications vaut acceptation
            des nouvelles CGU. En cas de desaccord, l&apos;Utilisateur peut
            resilier son compte dans les conditions prevues a l&apos;article 10.
          </p>
        </LegalSection>

        {/* SECTION 10 — Resiliation */}
        <LegalSection title="10. Resiliation">
          <p>
            L&apos;Utilisateur peut a tout moment demander la fermeture de
            son compte depuis les parametres de son espace personnel ou en
            contactant le support a l&apos;adresse{" "}
            <a
              href="mailto:contact@dixipolis.fr"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline"
            >
              contact@dixipolis.fr
            </a>
            .
          </p>
          <p>
            Dixipolis se reserve le droit de suspendre ou de resilier
            unilateralement le compte d&apos;un Utilisateur en cas de
            violation des presentes CGU, sans preavis ni indemnite, et sans
            prejudice de tout dommage et interet que Dixipolis pourrait
            reclamer.
          </p>
          <p>
            La resiliation du compte entraine la suppression des donnees
            de l&apos;Utilisateur dans les delais prevus par la{" "}
            <Link
              href="/politique-confidentialite"
              style={{ color: "var(--color-primary)" }}
              className="hover:underline"
            >
              Politique de Confidentialite
            </Link>
            , sous reserve des obligations legales de conservation.
          </p>
        </LegalSection>

        {/* SECTION 11 — Droit applicable et litiges */}
        <LegalSection title="11. Droit applicable et litiges">
          <p>
            Les presentes CGU sont regies par le droit francais.
          </p>
          <p>
            En cas de litige relatif a l&apos;interpretation ou
            l&apos;execution des presentes CGU, les parties s&apos;engagent
            a rechercher une solution amiable avant toute action
            judiciaire.
          </p>
          <p>
            Conformement a l&apos;article L.612-1 du Code de la
            consommation, l&apos;Utilisateur consommateur peut recourir
            gratuitement a un mediateur de la consommation en vue de la
            resolution amiable du litige.
          </p>
          <p>
            A defaut de resolution amiable dans un delai de soixante (60)
            jours, le litige sera soumis aux tribunaux competents de
            Paris, France, sauf disposition legale contraire.
          </p>
        </LegalSection>

        {/* SECTION 12 — Contact */}
        <LegalSection title="12. Contact" isLast>
          <p>
            Pour toute question relative aux presentes Conditions Generales
            d&apos;Utilisation, vous pouvez nous contacter :
          </p>
          <ul className="list-none space-y-1.5 pl-0 mt-3">
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Par email :</strong>{" "}
              <a
                href="mailto:contact@dixipolis.fr"
                style={{ color: "var(--color-primary)" }}
                className="hover:underline"
              >
                contact@dixipolis.fr
              </a>
            </li>
            <li>
              <strong style={{ color: "var(--color-text-primary)" }}>Via le formulaire :</strong>{" "}
              <Link
                href="/contact"
                style={{ color: "var(--color-primary)" }}
                className="hover:underline"
              >
                Page de contact
              </Link>
            </li>
          </ul>
        </LegalSection>
      </div>
    </PageWrapper>
  );
}

/* =============================================================================
 * app/a-propos/page.tsx
 *
 * Page "A Propos" de l'application Dixipolis.
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Presente l'identite de Dixipolis : sa mission, son equipe fondatrice,
 * ses valeurs et ses jalons de developpement.
 *
 * Structure de la page :
 *   1. Hero          — Titre et declaration de mission
 *   2. Mission       — Vision et objectifs de transparence democratique
 *   3. Equipe        — Cartes des 3 membres fondateurs (id="equipe")
 *   4. Valeurs       — 4 piliers : Transparence, Neutralite, Innovation, Accessibilite
 *   5. Chronologie   — Jalons passes et futurs du projet
 *
 * Conventions :
 *   - Utilise les variables CSS du theme (--color-primary, --color-bg-card, etc.)
 *   - Classe utilitaire "page-container" pour le centrage et la largeur max
 *   - Classe utilitaire "card" pour les cartes blanches avec ombre
 *   - Icones lucide-react pour les valeurs
 *   - Hierarchie de titres : h1 (hero) > h2 (sections) > h3 (sous-elements)
 *
 * SEO :
 *   - Exporte un objet metadata Next.js pour le titre et la description
 *
 * Accessibilite :
 *   - Balises section avec aria-label
 *   - Hierarchie semantique respectee
 *   - Contraste conforme WCAG AA
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Target,
  Eye,
  Shield,
  Scale,
  Lightbulb,
  Heart,
  Award,
  Linkedin,
  Twitter,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * METADONNEES SEO — Titre et description de la page
 * Surcharge le template defini dans le layout racine.
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "A Propos",
  description:
    "Decouvrez la mission, l'equipe et les valeurs de Dixipolis, la plateforme d'IA pour l'analyse du discours politique francais.",
};

/* --------------------------------------------------------------------------
 * DONNEES LOCALES — Membres de l'equipe
 *
 * Chaque membre est decrit par :
 *   - name        : nom complet
 *   - role        : fonction au sein de Dixipolis
 *   - description : biographie courte et contributions
 *   - initials    : initiales pour le placeholder photo
 *   - linkedIn    : URL LinkedIn (optionnel, placeholder)
 * -------------------------------------------------------------------------- */
const TEAM_MEMBERS = [
  {
    name: "Anthony Boisbouvier",
    role: "Co-fondateur & Chef de projet",
    description:
      "Ingenieur en biotechnologies chez Servier, Anthony a concu et developpe le prototype initial de Dixipolis. Passionne par l'intersection entre la technologie et la democratie, il pilote la strategie produit et la vision globale de la plateforme.",
    initials: "AB",
    linkedIn: "https://linkedin.com/in/anthonyboisbouvier",
  },
  {
    name: "Loic Ginoux",
    role: "Co-fondateur & Responsable technique",
    description:
      "Ingenieur logiciel chez Cocolis, Loic apporte son expertise en architecture logicielle et en developpement full-stack. Il supervise les choix techniques, l'infrastructure cloud et les pipelines de traitement des donnees.",
    initials: "LG",
    linkedIn: "https://linkedin.com/in/loicginoux",
  },
  {
    name: "Thierry Boisbouvier",
    role: "Sponsor & Mentor",
    description:
      "Entrepreneur du numerique avec plus de 25 ans d'experience, Thierry accompagne Dixipolis en tant que sponsor et conseiller strategique. Son expertise en creation d'entreprise et en transformation digitale est un atout precieux pour le projet.",
    initials: "TB",
    linkedIn: "https://linkedin.com/in/thierryboisbouvier",
  },
] as const;

/* --------------------------------------------------------------------------
 * DONNEES LOCALES — Valeurs fondatrices
 *
 * Chaque valeur comporte :
 *   - icon        : composant icone lucide-react
 *   - title       : nom de la valeur
 *   - description : explication de cette valeur dans le contexte de Dixipolis
 * -------------------------------------------------------------------------- */
const VALUES = [
  {
    icon: Eye,
    title: "Transparence",
    description:
      "Rendre le discours politique accessible a tous. Chaque information est sourcee, horodatee et verifiable. Nous croyons que la transparence est le socle d'une democratie saine.",
  },
  {
    icon: Scale,
    title: "Neutralite",
    description:
      "Aucun biais partisan. Notre IA analyse les discours de maniere factuelle, sans jugement ni orientation politique. Les faits parlent d'eux-memes.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Exploiter les dernieres avancees en intelligence artificielle et en traitement du langage naturel pour offrir des outils d'analyse inedits au service de l'interet general.",
  },
  {
    icon: Heart,
    title: "Accessibilite",
    description:
      "Democratiser l'acces a l'information politique. Notre plateforme est concue pour etre utilisable par tous : citoyens, journalistes, chercheurs et associations.",
  },
] as const;

/* --------------------------------------------------------------------------
 * DONNEES LOCALES — Chronologie / Jalons du projet
 *
 * Chaque jalon comporte :
 *   - date   : periode ou annee
 *   - title  : intitule du jalon
 *   - description : detail de ce qui a ete accompli ou est prevu
 *   - status : "completed" | "in-progress" | "planned"
 * -------------------------------------------------------------------------- */
const MILESTONES = [
  {
    date: "Ete 2024",
    title: "Prototype initial",
    description:
      "Conception et developpement du prototype fonctionnel. Validation du concept de recherche semantique sur les discours politiques francais.",
    status: "completed" as const,
  },
  {
    date: "Debut 2025",
    title: "MVP — Phase 1",
    description:
      "Lancement de la version beta avec recherche par prompt, base de donnees de discours et interface web. Integration de Supabase et deploiement sur Vercel.",
    status: "in-progress" as const,
  },
  {
    date: "2025 - 2026",
    title: "Phase 2 — Expansion",
    description:
      "Ajout des tableaux de bord analytiques, de l'API Pro, des newsletters automatisees et de la couverture elargie des sources mediatiques.",
    status: "planned" as const,
  },
  {
    date: "2026+",
    title: "Phase 3 — Consolidation",
    description:
      "Ouverture a l'ensemble du paysage politique europeen. Partenariats institutionnels et mediatiques. Modele economique consolide.",
    status: "planned" as const,
  },
] as const;

/* --------------------------------------------------------------------------
 * AboutPage — Composant principal de la page "A Propos"
 *
 * Assemble les cinq sections dans un conteneur PageWrapper.
 * Chaque section est un bloc visuel distinct avec espacement genereux.
 * -------------------------------------------------------------------------- */
export default function AboutPage() {
  return (
    <PageWrapper className="py-12 md:py-16 lg:py-20">
      {/* ================================================================
       * SECTION 1 — HERO
       * Titre principal et declaration de mission.
       * Fond avec gradient hero pour coherence avec la page d'accueil.
       * ================================================================ */}
      <section
        className="text-center mb-16 md:mb-20"
        aria-label="Presentation de Dixipolis"
      >
        {/* Badge contextuel */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)]">
          <Users className="h-4 w-4" aria-hidden="true" />
          Notre mission
        </div>

        {/* Titre principal de la page (h1 unique) */}
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          A Propos de{" "}
          <span className="text-[var(--color-primary)]">Dixipolis</span>
        </h1>

        {/* Sous-titre — Declaration de mission */}
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
          Dixipolis est ne d&apos;une conviction simple : chaque citoyen devrait
          pouvoir acceder facilement et de maniere factuelle a ce que disent
          reellement les responsables politiques. Notre plateforme d&apos;intelligence
          artificielle analyse le discours politique francais pour vous offrir
          une information transparente, sourcee et verifiable.
        </p>
      </section>

      {/* ================================================================
       * SECTION 2 — MISSION
       * Explication detaillee de la mission et de la vision du projet.
       * Deux colonnes sur desktop : texte a gauche, points cles a droite.
       * ================================================================ */}
      <section
        className="mb-16 md:mb-20"
        aria-label="Mission et vision de Dixipolis"
      >
        <div className="card p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Colonne gauche — Texte de la mission */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4 sm:text-3xl">
                Notre mission
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Dans un paysage mediatique ou l&apos;information politique est souvent
                fragmentee, orientee ou difficile a verifier, Dixipolis se
                positionne comme un outil de reference pour un acces transparent
                et factuel au discours politique.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Grace a l&apos;intelligence artificielle et au traitement automatique
                du langage naturel, nous analysons des milliers d&apos;heures de
                debats parlementaires, d&apos;interviews televisees, de conferences
                de presse et de discours officiels.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Notre objectif : permettre a chaque citoyen, journaliste ou
                chercheur de retrouver exactement ce qui a ete dit, par qui,
                quand et dans quel contexte — en quelques secondes.
              </p>
            </div>

            {/* Colonne droite — Points cles de la vision */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Notre vision de la transparence democratique
              </h3>

              {/* Liste des engagements */}
              {[
                {
                  icon: Target,
                  title: "Acces universel",
                  text: "Toute parole publique d'un responsable politique doit etre retrouvable et verifiable par n'importe quel citoyen.",
                },
                {
                  icon: Shield,
                  title: "Integrite des donnees",
                  text: "Chaque citation est accompagnee de sa source originale, de son contexte et d'un lien vers l'enregistrement video horodate.",
                },
                {
                  icon: Award,
                  title: "Independance editoriale",
                  text: "Dixipolis n'est affilie a aucun parti politique, media ou groupe de pression. Notre financement est independant.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  {/* Icone dans un cercle colore */}
                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-[var(--color-primary-light)]">
                    <item.icon
                      className="h-5 w-5 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
       * SECTION 3 — EQUIPE (id="equipe")
       * Trois cartes presentant les membres fondateurs.
       * L'ancre #equipe permet un lien direct depuis le footer.
       * Chaque carte affiche : placeholder photo, nom, role, biographie.
       * ================================================================ */}
      <section
        id="equipe"
        className="mb-16 md:mb-20 scroll-mt-24"
        aria-label="Equipe fondatrice"
      >
        {/* Titre de section */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3 sm:text-3xl">
            L&apos;equipe fondatrice
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--color-text-secondary)]">
            Dixipolis est porte par une equipe complementaire unissant expertise
            technologique, vision produit et experience entrepreneuriale.
          </p>
        </div>

        {/* Grille des cartes equipe : 1 colonne mobile, 3 colonnes desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="card p-6 lg:p-8 text-center flex flex-col items-center"
            >
              {/* Placeholder photo — Cercle avec initiales */}
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-2xl font-bold mb-5">
                {member.initials}
              </div>

              {/* Nom du membre */}
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
                {member.name}
              </h3>

              {/* Role / fonction */}
              <p className="text-sm font-medium text-[var(--color-primary)] mb-4">
                {member.role}
              </p>

              {/* Biographie courte */}
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5 flex-1">
                {member.description}
              </p>

              {/* Lien LinkedIn */}
              <a
                href={member.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
                aria-label={`Profil LinkedIn de ${member.name}`}
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
       * SECTION 4 — VALEURS
       * 4 piliers fondateurs, chacun avec une icone, un titre et un texte.
       * Grille 2x2 sur desktop, empilee sur mobile.
       * ================================================================ */}
      <section
        className="mb-16 md:mb-20"
        aria-label="Valeurs de Dixipolis"
      >
        {/* Titre de section */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3 sm:text-3xl">
            Nos valeurs
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--color-text-secondary)]">
            Quatre principes fondamentaux guident chaque decision technique,
            editoriale et strategique de Dixipolis.
          </p>
        </div>

        {/* Grille des valeurs : 1 colonne mobile, 2 colonnes tablette, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="card p-6 text-center flex flex-col items-center"
            >
              {/* Icone dans un cercle colore */}
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4">
                <value.icon className="h-7 w-7" aria-hidden="true" />
              </div>

              {/* Titre de la valeur */}
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
       * SECTION 5 — CHRONOLOGIE / JALONS
       * Timeline verticale presentant les etapes cles du projet.
       * Chaque jalon a un statut : completed, in-progress, planned.
       * Le style visuel varie selon le statut (couleur du point, opacite).
       * ================================================================ */}
      <section
        className="mb-8"
        aria-label="Chronologie du projet Dixipolis"
      >
        {/* Titre de section */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3 sm:text-3xl">
            Notre parcours
          </h2>
          <p className="mx-auto max-w-2xl text-[var(--color-text-secondary)]">
            De l&apos;idee initiale au lancement de la plateforme : les etapes
            cles du developpement de Dixipolis.
          </p>
        </div>

        {/* Timeline verticale */}
        <div className="max-w-3xl mx-auto">
          {MILESTONES.map((milestone, index) => (
            <div
              key={milestone.title}
              className="relative flex gap-6 pb-10 last:pb-0"
            >
              {/* Ligne verticale de la timeline (sauf dernier element) */}
              {index < MILESTONES.length - 1 && (
                <div
                  className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-[var(--color-border)]"
                  aria-hidden="true"
                />
              )}

              {/* Point de la timeline — couleur selon le statut */}
              <div className="flex-shrink-0 relative z-10">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full border-4 border-white flex items-center justify-center",
                    /* Vert si complete, bleu si en cours, gris si planifie */
                    milestone.status === "completed"
                      ? "bg-[var(--color-success)]"
                      : milestone.status === "in-progress"
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-text-muted)]"
                  )}
                  aria-hidden="true"
                >
                  {/* Point blanc interieur pour le jalon en cours */}
                  {milestone.status === "in-progress" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              {/* Contenu du jalon */}
              <div className="card p-5 sm:p-6 flex-1">
                {/* Badge de date */}
                <span
                  className={cn(
                    "inline-block text-xs font-semibold uppercase tracking-wider mb-2 px-2.5 py-1 rounded-full",
                    milestone.status === "completed"
                      ? "bg-green-50 text-[var(--color-success)]"
                      : milestone.status === "in-progress"
                        ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                        : "bg-gray-100 text-[var(--color-text-muted)]"
                  )}
                >
                  {milestone.date}
                </span>

                {/* Titre du jalon */}
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                  {milestone.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}

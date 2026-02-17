/* =============================================================================
 * app/a-propos/page.tsx
 *
 * Page "A Propos" de l'application Dixipolis.
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Redesign premium de la page de presentation de Dixipolis.
 * Presente l'identite de la plateforme : mission, equipe, valeurs et jalons.
 *
 * Structure de la page :
 *   1. Hero          — Titre avec fond gradient-subtle, declaration de mission
 *   2. Mission       — Vision : acces transparent et factuel au discours politique
 *   3. Equipe        — 3 cartes membres fondateurs (id="equipe")
 *   4. Valeurs       — 4 piliers : Transparence, Neutralite, Innovation, Accessibilite
 *   5. Chronologie   — Jalons passes et futurs du projet
 *
 * Conventions :
 *   - Utilise les variables CSS du theme (--color-primary, --color-bg-card, etc.)
 *   - Pas de Tailwind brut pour les couleurs — tout via style={{ }}
 *   - Classe utilitaire "page-container" via PageWrapper
 *   - Classe utilitaire "card" pour les cartes blanches avec ombre
 *   - Classe "stagger-children" pour les animations echelonnees
 *   - Icones lucide-react pour les valeurs et les points de vision
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
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

/* --------------------------------------------------------------------------
 * METADONNEES SEO — Titre et description de la page
 * Surcharge le template defini dans le layout racine.
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: "\u00c0 Propos",
  description:
    "D\u00e9couvrez la mission, l'\u00e9quipe et les valeurs de Dixipolis, la plateforme d'IA pour l'analyse du discours politique fran\u00e7ais.",
};

/* --------------------------------------------------------------------------
 * DONNEES LOCALES — Membres de l'equipe
 *
 * Chaque membre est decrit par :
 *   - name        : nom complet
 *   - role        : fonction au sein de Dixipolis
 *   - description : biographie courte et contributions
 *   - initials    : initiales pour le placeholder avatar
 *   - linkedIn    : URL LinkedIn (placeholder)
 * -------------------------------------------------------------------------- */
const TEAM_MEMBERS = [
  {
    name: "Anthony Boisbouvier",
    role: "Co-fondateur & Chef de projet",
    description:
      "Ing\u00e9nieur en biotechnologies chez Servier, Anthony a con\u00e7u et d\u00e9velopp\u00e9 le prototype initial de Dixipolis. Passionn\u00e9 par l'intersection entre la technologie et la d\u00e9mocratie, il pilote la strat\u00e9gie produit et la vision globale de la plateforme.",
    initials: "AB",
    linkedIn: "https://linkedin.com/in/anthonyboisbouvier",
  },
  {
    name: "Lo\u00efc Ginoux",
    role: "Co-fondateur & Responsable technique",
    description:
      "Ing\u00e9nieur logiciel chez Cocolis, Lo\u00efc apporte son expertise en architecture logicielle et en d\u00e9veloppement full-stack. Il supervise les choix techniques, l'infrastructure cloud et les pipelines de traitement des donn\u00e9es.",
    initials: "LG",
    linkedIn: "https://linkedin.com/in/loicginoux",
  },
  {
    name: "Thierry Boisbouvier",
    role: "Sponsor & Mentor",
    description:
      "Entrepreneur du num\u00e9rique avec plus de 25 ans d'exp\u00e9rience, Thierry accompagne Dixipolis en tant que sponsor et conseiller strat\u00e9gique. Son expertise en cr\u00e9ation d'entreprise et en transformation digitale est un atout pr\u00e9cieux pour le projet.",
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
      "Rendre le discours politique accessible \u00e0 tous. Chaque information est sourc\u00e9e, horodat\u00e9e et v\u00e9rifiable. Nous croyons que la transparence est le socle d'une d\u00e9mocratie saine.",
  },
  {
    icon: Scale,
    title: "Neutralit\u00e9",
    description:
      "Aucun biais partisan. Notre IA analyse les discours de mani\u00e8re factuelle, sans jugement ni orientation politique. Les faits parlent d'eux-m\u00eames.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Exploiter les derni\u00e8res avanc\u00e9es en intelligence artificielle et en traitement du langage naturel pour offrir des outils d'analyse in\u00e9dits au service de l'int\u00e9r\u00eat g\u00e9n\u00e9ral.",
  },
  {
    icon: Heart,
    title: "Accessibilit\u00e9",
    description:
      "D\u00e9mocratiser l'acc\u00e8s \u00e0 l'information politique. Notre plateforme est con\u00e7ue pour \u00eatre utilisable par tous : citoyens, journalistes, chercheurs et associations.",
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
 *   - icon   : icone representant le statut du jalon
 * -------------------------------------------------------------------------- */
const MILESTONES = [
  {
    date: "\u00c9t\u00e9 2024",
    title: "Prototype initial",
    description:
      "Conception et d\u00e9veloppement du prototype fonctionnel. Validation du concept de recherche s\u00e9mantique sur les discours politiques fran\u00e7ais.",
    status: "completed" as const,
    icon: CheckCircle2,
  },
  {
    date: "Debut 2025",
    title: "MVP — Phase 1",
    description:
      "Lancement de la version b\u00eata avec recherche par prompt, base de donn\u00e9es de discours et interface web. Int\u00e9gration de Supabase et d\u00e9ploiement sur Vercel.",
    status: "completed" as const,
    icon: CheckCircle2,
  },
  {
    date: "2025 - 2026",
    title: "Phase 2 — Expansion",
    description:
      "Ajout des tableaux de bord analytiques, de l'API Pro, des newsletters automatis\u00e9es et de la couverture \u00e9largie des sources m\u00e9diatiques.",
    status: "planned" as const,
    icon: Sparkles,
  },
  {
    date: "2026+",
    title: "Phase 3 — Consolidation",
    description:
      "Ouverture \u00e0 l'ensemble du paysage politique europ\u00e9en. Partenariats institutionnels et m\u00e9diatiques. Mod\u00e8le \u00e9conomique consolid\u00e9.",
    status: "planned" as const,
    icon: Clock,
  },
] as Array<{
  date: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  icon: typeof CheckCircle2;
}>;

/* --------------------------------------------------------------------------
 * AboutPage — Composant principal de la page "A Propos"
 *
 * Assemble les cinq sections dans un conteneur PageWrapper.
 * Chaque section est un bloc visuel distinct avec espacement genereux.
 * Pas de pt-offset car le root layout gere deja le padding-top de 72px.
 * -------------------------------------------------------------------------- */
export default function AboutPage() {
  return (
    <PageWrapper>
      {/* ================================================================
       * SECTION 1 — HERO
       * Titre principal et declaration de mission.
       * Fond gradient-subtle pour coherence avec le design system.
       * ================================================================ */}
      <section
        className="gradient-subtle rounded-2xl px-6 py-16 text-center mb-16 md:mb-20 sm:px-12 md:py-20"
        aria-label="Presentation de Dixipolis"
      >
        {/* Badge contextuel */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Users className="h-4 w-4" aria-hidden="true" />
          Notre mission
        </div>

        {/* Titre principal de la page (h1 unique) */}
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          <span style={{ color: "var(--color-text-primary)" }}>
            &Agrave; Propos de{" "}
          </span>
          <span style={{ color: "var(--color-primary)" }}>Dixipolis</span>
        </h1>

        {/* Sous-titre — Declaration de mission */}
        <p
          className="mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Dixipolis est n&eacute; d&apos;une conviction simple : chaque citoyen devrait
          pouvoir acc&eacute;der facilement et de mani&egrave;re factuelle &agrave; ce que disent
          r&eacute;ellement les responsables politiques. Notre plateforme d&apos;intelligence
          artificielle analyse le discours politique fran&ccedil;ais pour vous offrir
          une information transparente, sourc&eacute;e et v&eacute;rifiable.
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
              <h2
                className="text-2xl font-bold mb-4 sm:text-3xl"
                style={{ color: "var(--color-text-primary)" }}
              >
                Notre mission
              </h2>
              <p
                className="leading-relaxed mb-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Dans un paysage m&eacute;diatique o&ugrave; l&apos;information politique est souvent
                fragment&eacute;e, orient&eacute;e ou difficile &agrave; v&eacute;rifier, Dixipolis se
                positionne comme un outil de r&eacute;f&eacute;rence pour un acc&egrave;s transparent
                et factuel au discours politique.
              </p>
              <p
                className="leading-relaxed mb-4"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Gr&acirc;ce &agrave; l&apos;intelligence artificielle et au traitement automatique
                du langage naturel, nous analysons des milliers d&apos;heures de
                d&eacute;bats parlementaires, d&apos;interviews t&eacute;l&eacute;vis&eacute;es, de conf&eacute;rences
                de presse et de discours officiels.
              </p>
              <p
                className="leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Notre objectif : permettre &agrave; chaque citoyen, journaliste ou
                chercheur de retrouver exactement ce qui a &eacute;t&eacute; dit, par qui,
                quand et dans quel contexte — en quelques secondes.
              </p>
            </div>

            {/* Colonne droite — Points cles de la vision */}
            <div className="space-y-6">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Notre vision de la transparence d&eacute;mocratique
              </h3>

              {/* Liste des engagements */}
              {[
                {
                  icon: Target,
                  title: "Acc\u00e8s universel",
                  text: "Toute parole publique d'un responsable politique doit \u00eatre retrouvable et v\u00e9rifiable par n'importe quel citoyen.",
                },
                {
                  icon: Shield,
                  title: "Int\u00e9grit\u00e9 des donn\u00e9es",
                  text: "Chaque citation est accompagn\u00e9e de sa source originale, de son contexte et d'un lien vers l'enregistrement vid\u00e9o horodat\u00e9.",
                },
                {
                  icon: Award,
                  title: "Ind\u00e9pendance \u00e9ditoriale",
                  text: "Dixipolis n'est affili\u00e9 \u00e0 aucun parti politique, m\u00e9dia ou groupe de pression. Notre financement est ind\u00e9pendant.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  {/* Icone dans un carre arrondi colore */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg"
                    style={{ backgroundColor: "var(--color-primary-light)" }}
                  >
                    <item.icon
                      className="h-5 w-5"
                      style={{ color: "var(--color-primary)" }}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
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
       * Chaque carte affiche : placeholder avatar, nom, role, biographie.
       * Animation stagger-children pour un effet d'entree echelonne.
       * ================================================================ */}
      <section
        id="equipe"
        className="mb-16 md:mb-20 scroll-mt-24"
        aria-label="Equipe fondatrice"
      >
        {/* Titre de section */}
        <div className="text-center mb-10">
          <h2
            className="text-2xl font-bold mb-3 sm:text-3xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            L&apos;&eacute;quipe fondatrice
          </h2>
          <p
            className="mx-auto max-w-2xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Dixipolis est port&eacute; par une &eacute;quipe compl&eacute;mentaire unissant expertise
            technologique, vision produit et exp&eacute;rience entrepreneuriale.
          </p>
        </div>

        {/* Grille des cartes equipe : 1 colonne mobile, 3 colonnes desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="card p-6 lg:p-8 text-center flex flex-col items-center"
            >
              {/* Placeholder photo — Grand cercle avec initiales */}
              <div
                className="flex items-center justify-center h-24 w-24 rounded-full text-2xl font-bold mb-5"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                }}
              >
                {member.initials}
              </div>

              {/* Nom du membre */}
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                {member.name}
              </h3>

              {/* Role / fonction */}
              <p
                className="text-sm font-medium mb-4"
                style={{ color: "var(--color-primary)" }}
              >
                {member.role}
              </p>

              {/* Biographie courte */}
              <p
                className="text-sm leading-relaxed mb-5 flex-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {member.description}
              </p>

              {/* Lien LinkedIn */}
              <a
                href={member.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
                style={{ color: "var(--color-text-muted)" }}
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
       * Animation stagger-children pour un effet d'entree echelonne.
       * ================================================================ */}
      <section
        className="mb-16 md:mb-20"
        aria-label="Valeurs de Dixipolis"
      >
        {/* Titre de section */}
        <div className="text-center mb-10">
          <h2
            className="text-2xl font-bold mb-3 sm:text-3xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Nos valeurs
          </h2>
          <p
            className="mx-auto max-w-2xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Quatre principes fondamentaux guident chaque d&eacute;cision technique,
            &eacute;ditoriale et strat&eacute;gique de Dixipolis.
          </p>
        </div>

        {/* Grille des valeurs : 1 colonne mobile, 2 colonnes tablette, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="card p-6 text-center flex flex-col items-center"
            >
              {/* Icone dans un carre arrondi colore */}
              <div
                className="flex items-center justify-center h-14 w-14 rounded-xl mb-4"
                style={{ backgroundColor: "var(--color-primary-light)" }}
              >
                <value.icon
                  className="h-7 w-7"
                  style={{ color: "var(--color-primary)" }}
                  aria-hidden="true"
                />
              </div>

              {/* Titre de la valeur */}
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                {value.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
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
          <h2
            className="text-2xl font-bold mb-3 sm:text-3xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Notre parcours
          </h2>
          <p
            className="mx-auto max-w-2xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            De l&apos;id&eacute;e initiale au lancement de la plateforme : les &eacute;tapes
            cl&eacute;s du d&eacute;veloppement de Dixipolis.
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
                  className="absolute left-[19px] top-10 bottom-0 w-0.5"
                  style={{ backgroundColor: "var(--color-border)" }}
                  aria-hidden="true"
                />
              )}

              {/* Point de la timeline — icone et couleur selon le statut */}
              <div className="flex-shrink-0 relative z-10">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      milestone.status === "completed"
                        ? "var(--color-success)"
                        : milestone.status === "in-progress"
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                    border: "3px solid var(--color-bg-card)",
                  }}
                  aria-hidden="true"
                >
                  <milestone.icon className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Contenu du jalon */}
              <div className="card p-5 sm:p-6 flex-1">
                {/* Badge de date */}
                <span
                  className="inline-block text-xs font-semibold uppercase tracking-wider mb-2 px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      milestone.status === "completed"
                        ? "var(--color-success-light)"
                        : milestone.status === "in-progress"
                          ? "var(--color-primary-light)"
                          : "var(--color-bg-section)",
                    color:
                      milestone.status === "completed"
                        ? "var(--color-success)"
                        : milestone.status === "in-progress"
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                  }}
                >
                  {milestone.date}
                </span>

                {/* Titre du jalon */}
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {milestone.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
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

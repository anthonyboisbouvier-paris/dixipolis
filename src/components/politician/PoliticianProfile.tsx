/* =============================================================================
 * components/politician/PoliticianProfile.tsx
 *
 * Composant de profil complet d'un politicien.
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Ce composant affiche une fiche detaillee style Wikipedia/encyclopedique
 * pour un politicien donne. Il est concu pour etre reutilisable et importable
 * dans n'importe quelle page.
 *
 * Structure du profil :
 *   1. En-tete        — Photo placeholder, nom complet, role et badge parti
 *   2. Biographie     — Texte de presentation du politicien
 *   3. Statistiques   — Nombre de discours, themes principaux, derniere activite
 *   4. Themes         — Badges des themes les plus abordes
 *   5. Derniers discours — 3 cartes d'extraits (donnees mock hardcodees)
 *   6. Lien d'action  — Vers la page /prompt avec requete pre-remplie
 *
 * Props :
 *   - politician : Politician — objet politicien conforme a l'interface
 *     definie dans types/index.ts
 *
 * Design :
 *   - Fond gris clair hérité de la page parente
 *   - Cartes blanches avec ombres du design system
 *   - Accents bleus pour les badges et actions
 *   - Style factuel, sobre et professionnel (Wikipedia-like)
 * ============================================================================= */

import Link from "next/link";
import {
  Users,
  MessageSquare,
  Calendar,
  Tag,
  ArrowRight,
  BarChart3,
  Building,
  Clock,
  MapPin,
} from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Politician } from "@/types";

/* --------------------------------------------------------------------------
 * DONNEES MOCK — Derniers discours
 *
 * Donnees fictives hardcodees pour la section "Derniers discours".
 * Elles seront remplacees par des appels API reels dans une version future.
 * Chaque entree represente un extrait de discours avec sa source et sa date.
 * -------------------------------------------------------------------------- */
const MOCK_RECENT_SPEECHES = [
  {
    id: "speech-1",
    title: "Sur la reforme des institutions",
    excerpt:
      "Nous devons moderniser nos institutions pour repondre aux defis du XXIe siecle. " +
      "La democratie exige une participation active et eclairee de chaque citoyen.",
    date: "2025-01-10",
    theme: "Institutions",
    source: "Assemblee nationale",
  },
  {
    id: "speech-2",
    title: "Politique economique et pouvoir d'achat",
    excerpt:
      "Le pouvoir d'achat des Francais reste notre priorite absolue. Nous mettons en place " +
      "des mesures concretes pour proteger les menages les plus modestes face a l'inflation.",
    date: "2025-01-05",
    theme: "Economie",
    source: "Conference de presse",
  },
  {
    id: "speech-3",
    title: "Transition ecologique et energie",
    excerpt:
      "La transition ecologique n'est pas une option mais une necessite. Notre plan " +
      "d'investissement de 50 milliards d'euros sur cinq ans temoigne de cet engagement.",
    date: "2024-12-18",
    theme: "Ecologie",
    source: "Senat",
  },
];

/* --------------------------------------------------------------------------
 * Props du composant PoliticianProfile
 * -------------------------------------------------------------------------- */
interface PoliticianProfileProps {
  /** Objet politicien complet a afficher */
  politician: Politician;
}

/* --------------------------------------------------------------------------
 * PoliticianProfile — Composant principal
 *
 * Assemble toutes les sections du profil dans un layout vertical.
 * Chaque section est encapsulee dans une carte blanche (class "card").
 *
 * Le composant est entierement serveur : aucun etat, aucun effet,
 * aucun gestionnaire d'evenement cote client.
 * -------------------------------------------------------------------------- */
export default function PoliticianProfile({ politician }: PoliticianProfileProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ==================================================================
       * SECTION 1 — En-tete du profil
       *
       * Affiche la photo placeholder (grand cercle gris avec icone),
       * le nom complet, le role actuel et un badge du parti politique.
       * Layout : photo a gauche, informations a droite (responsive).
       * ================================================================== */}
      <section className="card border border-[var(--color-border)] p-6 lg:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* --------------------------------------------------------
           * Photo placeholder
           * Grand cercle avec fond bleu clair et icone utilisateur.
           * Sera remplace par la vraie photo (politician.photoUrl)
           * lorsque les images seront disponibles.
           * -------------------------------------------------------- */}
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] lg:h-36 lg:w-36"
            aria-label={`Photo de ${politician.fullName}`}
          >
            <Users
              className="h-12 w-12 text-[var(--color-primary)] lg:h-16 lg:w-16"
              aria-hidden="true"
            />
          </div>

          {/* --------------------------------------------------------
           * Informations textuelles
           * Nom complet en titre H1, role en sous-titre, badge du parti.
           * -------------------------------------------------------- */}
          <div className="text-center sm:text-left">
            {/* Nom complet du politicien */}
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-3xl lg:text-4xl">
              {politician.fullName}
            </h1>

            {/* Role / Fonction actuelle */}
            <p className="mt-2 flex items-center justify-center gap-2 text-base text-[var(--color-text-secondary)] sm:justify-start lg:text-lg">
              <Building className="h-4 w-4 shrink-0" aria-hidden="true" />
              {politician.role}
            </p>

            {/* Badge du parti politique */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-primary-light)] px-4 py-1.5 text-sm font-semibold text-[var(--color-primary)]">
              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
              {politician.party} ({politician.partyAbbreviation})
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
       * SECTION 2 — Biographie
       *
       * Texte de presentation factuel et concis du politicien.
       * Encadre dans une carte blanche distincte pour la lisibilite.
       * ================================================================== */}
      <section className="card border border-[var(--color-border)] p-6 lg:p-8">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text-primary)]">
          Biographie
        </h2>
        <p className="leading-relaxed text-[var(--color-text-secondary)]">
          {politician.bio}
        </p>
      </section>

      {/* ==================================================================
       * SECTION 3 — Statistiques cles
       *
       * Ligne de 3 indicateurs cliquables :
       *   1. Nombre de discours indexes
       *   2. Nombre de themes principaux
       *   3. Date de la derniere activite
       *
       * Layout responsive : 1 colonne mobile, 3 colonnes desktop.
       * Chaque statistique est presentee dans un mini-conteneur avec icone.
       * ================================================================== */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
        {/* Stat 1 — Nombre de discours indexes */}
        <div className="card flex items-center gap-4 border border-[var(--color-border)] p-5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[#dbeafe]"
            aria-hidden="true"
          >
            <MessageSquare className="h-5 w-5 text-[#2563eb]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {formatNumber(politician.speechCount)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Discours indexes
            </p>
          </div>
        </div>

        {/* Stat 2 — Nombre de themes principaux */}
        <div className="card flex items-center gap-4 border border-[var(--color-border)] p-5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[#dcfce7]"
            aria-hidden="true"
          >
            <BarChart3 className="h-5 w-5 text-[#16a34a]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {politician.topThemes.length}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Themes principaux
            </p>
          </div>
        </div>

        {/* Stat 3 — Derniere activite detectee */}
        <div className="card flex items-center gap-4 border border-[var(--color-border)] p-5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[#fce7f3]"
            aria-hidden="true"
          >
            <Clock className="h-5 w-5 text-[#db2777]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {formatDate(politician.lastActivity, {
                day: "numeric",
                month: "short",
              })}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Derniere activite
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================
       * SECTION 4 — Themes principaux
       *
       * Affiche les themes les plus abordes par le politicien sous forme
       * de badges (pills) avec fond bleu clair et texte bleu.
       * Utilise la classe utilitaire .theme-badge definie dans globals.css.
       * ================================================================== */}
      <section className="card border border-[var(--color-border)] p-6 lg:p-8">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text-primary)]">
          Themes les plus abordes
        </h2>
        <div className="flex flex-wrap gap-2">
          {politician.topThemes.map((theme) => (
            <span
              key={theme}
              className="theme-badge"
            >
              {theme}
            </span>
          ))}
        </div>
      </section>

      {/* ==================================================================
       * SECTION 5 — Derniers discours
       *
       * Affiche 3 cartes d'extraits de discours recents (donnees mock).
       * Chaque carte montre :
       *   - Le titre du discours
       *   - Un extrait textuel (verbatim)
       *   - La date, le theme et la source
       *
       * Les donnees sont hardcodees dans MOCK_RECENT_SPEECHES.
       * Elles seront remplacees par des appels API reels ulterieurement.
       * ================================================================== */}
      <section className="card border border-[var(--color-border)] p-6 lg:p-8">
        <h2 className="mb-6 text-lg font-bold text-[var(--color-text-primary)]">
          Derniers discours
        </h2>

        <div className="space-y-4">
          {MOCK_RECENT_SPEECHES.map((speech) => (
            <article
              key={speech.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-[var(--color-bg-section)] p-5 transition-shadow hover:shadow-[var(--shadow-sm)]"
            >
              {/* Titre du discours */}
              <h3 className="mb-2 font-semibold text-[var(--color-text-primary)]">
                {speech.title}
              </h3>

              {/* Extrait textuel */}
              <p className="mb-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                &laquo; {speech.excerpt} &raquo;
              </p>

              {/* Metadonnees : date, theme, source */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
                {/* Date du discours */}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDate(speech.date)}
                </span>

                {/* Theme detecte */}
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  {speech.theme}
                </span>

                {/* Source du discours */}
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {speech.source}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================================================================
       * SECTION 6 — Lien vers toutes les interventions
       *
       * Bouton/lien qui redirige vers la page /prompt avec une requete
       * pre-remplie demandant les discours du politicien concerne.
       * Le parametre de requete est passe via un query string (?q=...).
       * ================================================================== */}
      <div className="text-center">
        <Link
          href={`/prompt?q=Quels sont les derniers discours de ${politician.fullName} ?`}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-[var(--transition-fast)] hover:bg-[var(--color-primary-hover)]"
        >
          <span>Voir toutes les interventions</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

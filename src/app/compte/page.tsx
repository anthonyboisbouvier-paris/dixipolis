/* =============================================================================
 * app/compte/page.tsx
 *
 * Tableau de bord du compte utilisateur (mock) de Dixipolis.
 *
 * Sections (onglets) :
 *   1. Profil       — Informations personnelles (nom, email) en lecture seule
 *   2. Abonnement   — Plan actuel avec lien vers /tarifs pour changer
 *   3. Recherches   — Liste de recherches sauvegardees (donnees fictives)
 *   4. Alertes      — Toggles d'alertes email (donnees fictives)
 *
 * Points d'attention :
 *   - Les politiciens suivis utilisent /politicien/ (singulier) dans les liens
 *   - Bouton "Se deconnecter" en bas de page
 *   - Toutes les couleurs via CSS variables (pas de Tailwind raw colors)
 *   - Ce composant est entierement front-end avec des donnees fictives
 *   - Il sera connecte a Supabase une fois l'authentification en place
 *
 * Design :
 *   - Fond page, cartes blanches avec ombre legere
 *   - Navigation par onglets horizontaux style pill
 *   - Palette Dixipolis (bleu primaire, gris, blanc)
 *
 * Note :
 *   - "use client" car utilise useState pour les onglets et les toggles
 *   - Les metadata SEO sont exportees dans layout.tsx (Server Component)
 *   - Pas de pt-offset — le root layout gere le padding pour le header
 * ============================================================================= */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Settings,
  Bell,
  Bookmark,
  Search,
  LogOut,
  Shield,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * DONNEES FICTIVES — Simulation de l'etat utilisateur
 *
 * Ces donnees seront remplacees par des appels API Supabase.
 * -------------------------------------------------------------------------- */

/** Informations du profil utilisateur */
const MOCK_USER = {
  firstName: "Marie",
  lastName: "Laurent",
  email: "marie.laurent@exemple.fr",
  plan: "Acc\u00e8s Pro",
} as const;

/** Recherches sauvegardees par l'utilisateur */
const MOCK_SAVED_SEARCHES = [
  {
    id: "s1",
    label: "R\u00e9forme des retraites 2025",
    date: "12 fev. 2026",
  },
  {
    id: "s2",
    label: "Discours pr\u00e9sidentiel — environnement",
    date: "8 fev. 2026",
  },
  {
    id: "s3",
    label: "D\u00e9bat Assembl\u00e9e nationale — budget 2026",
    date: "3 fev. 2026",
  },
] as const;

/** Politiciens suivis par l'utilisateur */
const MOCK_FOLLOWED_POLITICIANS = [
  {
    id: "p1",
    name: "Marine Le Pen",
    party: "Rassemblement National",
    slug: "marine-le-pen",
  },
  {
    id: "p2",
    name: "Jean-Luc M\u00e9lenchon",
    party: "La France Insoumise",
    slug: "jean-luc-melenchon",
  },
  {
    id: "p3",
    name: "Gabriel Attal",
    party: "Renaissance",
    slug: "gabriel-attal",
  },
] as const;

/* --------------------------------------------------------------------------
 * ONGLETS — Definition des sections du tableau de bord
 *
 * Chaque onglet a un id unique, un label visible et une icone Lucide.
 * -------------------------------------------------------------------------- */
type TabId = "profil" | "abonnement" | "recherches" | "alertes";

interface TabDefinition {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: TabDefinition[] = [
  { id: "profil", label: "Profil", icon: User },
  { id: "abonnement", label: "Abonnement", icon: CreditCard },
  { id: "recherches", label: "Recherches", icon: Bookmark },
  { id: "alertes", label: "Alertes", icon: Bell },
];

/* --------------------------------------------------------------------------
 * ComptePage — Composant principal du tableau de bord
 * -------------------------------------------------------------------------- */
export default function ComptePage() {
  /* ---- Onglet actif ---- */
  const [activeTab, setActiveTab] = useState<TabId>("profil");

  /* ---- Etat des toggles d'alertes (mock) ---- */
  const [alertNewAnalysis, setAlertNewAnalysis] = useState(true);
  const [alertFollowedPolitician, setAlertFollowedPolitician] = useState(true);
  const [alertWeeklyDigest, setAlertWeeklyDigest] = useState(false);

  /* ---- Rendu ---- */
  return (
    <main
      className="min-h-[calc(100vh-72px)] px-4 py-10 sm:py-14"
      style={{ backgroundColor: "var(--color-bg-page)" }}
    >
      <div className="mx-auto max-w-3xl">
        {/* ==============================================================
         * En-tete de la page
         * Titre "Mon Compte" avec sous-titre et lien retour accueil.
         * ============================================================== */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Mon Compte
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              G&eacute;rez votre profil et vos pr&eacute;f&eacute;rences
            </p>
          </div>
          {/* Lien de retour a l'accueil */}
          <Link
            href="/"
            className="text-sm font-medium transition-opacity hover:opacity-80 hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Retour &agrave; l&apos;accueil
          </Link>
        </div>

        {/* ==============================================================
         * Carte d'information utilisateur (resume)
         * Avatar avec initiales, nom complet, email et badge du plan.
         * ============================================================== */}
        <div className="card mb-8 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          {/* Avatar placeholder avec initiales */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold"
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
            }}
            aria-hidden="true"
          >
            {MOCK_USER.firstName[0]}
            {MOCK_USER.lastName[0]}
          </div>
          {/* Informations textuelles */}
          <div className="flex-1">
            <p
              className="text-lg font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {MOCK_USER.firstName} {MOCK_USER.lastName}
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {MOCK_USER.email}
            </p>
          </div>
          {/* Badge plan actuel */}
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "var(--color-primary)",
            }}
          >
            {MOCK_USER.plan}
          </span>
        </div>

        {/* ==============================================================
         * Navigation par onglets
         * Style pill avec fond section et onglet actif en carte blanche.
         * ============================================================== */}
        <nav
          className="mb-6 flex gap-1 overflow-x-auto rounded-lg p-1"
          style={{ backgroundColor: "var(--color-bg-section)" }}
          role="tablist"
          aria-label="Sections du compte"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2",
                  isActive ? "shadow-sm" : "hover:opacity-80"
                )}
                style={{
                  backgroundColor: isActive
                    ? "var(--color-bg-card)"
                    : "transparent",
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                }}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ==============================================================
         * Contenu de l'onglet actif
         * Chaque onglet affiche une section specifique du tableau de bord.
         * ============================================================== */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {/* --------------------------------------------------------
           * ONGLET : Profil
           * Affiche les informations personnelles en lecture seule.
           * Les champs sont pre-remplis avec les donnees mock.
           * -------------------------------------------------------- */}
          {activeTab === "profil" && (
            <section className="card p-6 sm:p-8" aria-label="Profil">
              <h2
                className="mb-6 flex items-center gap-2 text-lg font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                <Settings
                  size={20}
                  style={{ color: "var(--color-primary)" }}
                  aria-hidden="true"
                />
                Informations personnelles
              </h2>

              <div className="space-y-5">
                {/* Prenom */}
                <div>
                  <label
                    htmlFor="profile-firstname"
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Pr&eacute;nom
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      size={18}
                      style={{ color: "var(--color-text-muted)" }}
                      aria-hidden="true"
                    />
                    <input
                      id="profile-firstname"
                      type="text"
                      value={MOCK_USER.firstName}
                      readOnly
                      className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-bg-section)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                </div>

                {/* Nom */}
                <div>
                  <label
                    htmlFor="profile-lastname"
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Nom
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      size={18}
                      style={{ color: "var(--color-text-muted)" }}
                      aria-hidden="true"
                    />
                    <input
                      id="profile-lastname"
                      type="text"
                      value={MOCK_USER.lastName}
                      readOnly
                      className="w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-bg-section)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                </div>

                {/* Email (desactive — non modifiable) */}
                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      size={18}
                      style={{ color: "var(--color-text-muted)" }}
                      aria-hidden="true"
                    />
                    <input
                      id="profile-email"
                      type="email"
                      value={MOCK_USER.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-lg border py-2.5 pl-10 pr-4 text-sm opacity-60"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-bg-section)",
                        color: "var(--color-text-secondary)",
                      }}
                    />
                  </div>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    L&apos;email ne peut pas &ecirc;tre modifi&eacute; directement.
                    Contactez le support.
                  </p>
                </div>
              </div>

              {/* Bouton sauvegarder (desactive dans le mock) */}
              <button
                type="button"
                disabled
                className="mt-6 cursor-not-allowed rounded-lg px-5 py-2.5 text-sm font-semibold opacity-50"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-on-primary)",
                }}
              >
                Sauvegarder les modifications
              </button>
            </section>
          )}

          {/* --------------------------------------------------------
           * ONGLET : Abonnement
           * Carte du plan actuel avec details et lien vers /tarifs.
           * -------------------------------------------------------- */}
          {activeTab === "abonnement" && (
            <section className="card p-6 sm:p-8" aria-label="Abonnement">
              <h2
                className="mb-6 flex items-center gap-2 text-lg font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                <CreditCard
                  size={20}
                  style={{ color: "var(--color-primary)" }}
                  aria-hidden="true"
                />
                Mon abonnement
              </h2>

              {/* Carte du plan actuel avec bordure primaire */}
              <div
                className="rounded-lg border-2 p-5"
                style={{
                  borderColor: "var(--color-primary)",
                  backgroundColor: "var(--color-primary-light)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-lg font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {MOCK_USER.plan}
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Acc&egrave;s illimit&eacute; &agrave; toutes les analyses et fonctionnalit&eacute;s
                      avanc&eacute;es.
                    </p>
                  </div>
                  <Shield
                    size={32}
                    style={{ color: "var(--color-primary)" }}
                    aria-hidden="true"
                  />
                </div>

                {/* Details des avantages du plan */}
                <ul
                  className="mt-4 space-y-1 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <li>Analyses illimit&eacute;es</li>
                  <li>Alertes en temps r&eacute;el</li>
                  <li>Export des donn&eacute;es</li>
                  <li>Support prioritaire</li>
                </ul>
              </div>

              {/* Lien pour changer d'abonnement — pointe vers /tarifs */}
              <div className="mt-6">
                <Link
                  href="/tarifs"
                  className="inline-flex items-center gap-2 rounded-lg border-2 px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                  }}
                >
                  Changer d&apos;abonnement
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </section>
          )}

          {/* --------------------------------------------------------
           * ONGLET : Recherches sauvegardees
           * Liste des recherches avec date et bouton "Relancer".
           * Inclut egalement la sous-section des politiciens suivis.
           * -------------------------------------------------------- */}
          {activeTab === "recherches" && (
            <div className="space-y-6">
              {/* Section recherches sauvegardees */}
              <section
                className="card p-6 sm:p-8"
                aria-label="Recherches sauvegardees"
              >
                <h2
                  className="mb-6 flex items-center gap-2 text-lg font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <Bookmark
                    size={20}
                    style={{ color: "var(--color-primary)" }}
                    aria-hidden="true"
                  />
                  Recherches sauvegardees
                </h2>

                {/* Liste des recherches */}
                <ul
                  className="divide-y"
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  {MOCK_SAVED_SEARCHES.map((search) => (
                    <li
                      key={search.id}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <Search
                          size={16}
                          style={{ color: "var(--color-text-muted)" }}
                          aria-hidden="true"
                        />
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {search.label}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Sauvegard&eacute;e le {search.date}
                          </p>
                        </div>
                      </div>
                      {/* Bouton relancer la recherche (mock) */}
                      <button
                        type="button"
                        className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: "var(--color-primary-light)",
                          color: "var(--color-primary)",
                        }}
                      >
                        Relancer
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section politiciens suivis */}
              <section
                className="card p-6 sm:p-8"
                aria-label="Politiciens suivis"
              >
                <h2
                  className="mb-6 flex items-center gap-2 text-lg font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  <Shield
                    size={20}
                    style={{ color: "var(--color-primary)" }}
                    aria-hidden="true"
                  />
                  Politiciens suivis
                </h2>

                {/* Liste des politiciens avec avatar initiales */}
                <ul
                  className="divide-y"
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  {MOCK_FOLLOWED_POLITICIANS.map((politician) => (
                    <li
                      key={politician.id}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar placeholder avec initiales */}
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                          style={{
                            backgroundColor: "var(--color-primary-light)",
                            color: "var(--color-primary)",
                          }}
                          aria-hidden="true"
                        >
                          {politician.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {politician.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {politician.party}
                          </p>
                        </div>
                      </div>
                      {/* Lien vers la fiche du politicien — utilise /politicien/ (singulier) */}
                      <Link
                        href={`/politicien/${politician.slug}`}
                        className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: "var(--color-primary-light)",
                          color: "var(--color-primary)",
                        }}
                      >
                        Voir la fiche
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {/* --------------------------------------------------------
           * ONGLET : Alertes
           * Toggles d'alertes email pour differents types de notifications.
           * Chaque alerte a un label, une description et un switch toggle.
           * -------------------------------------------------------- */}
          {activeTab === "alertes" && (
            <section className="card p-6 sm:p-8" aria-label="Alertes email">
              <h2
                className="mb-6 flex items-center gap-2 text-lg font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                <Bell
                  size={20}
                  style={{ color: "var(--color-primary)" }}
                  aria-hidden="true"
                />
                Pr&eacute;f&eacute;rences d&apos;alertes
              </h2>

              <p
                className="mb-6 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Choisissez les notifications que vous souhaitez recevoir par
                email.
              </p>

              {/* Liste de toggles d'alertes */}
              <div className="space-y-4">
                {/* Toggle : Nouvelles analyses */}
                <AlertToggle
                  id="alert-new-analysis"
                  label="Nouvelles analyses"
                  description="Recevoir une alerte quand une nouvelle analyse est disponible sur un sujet suivi."
                  checked={alertNewAnalysis}
                  onChange={setAlertNewAnalysis}
                />

                {/* Toggle : Politicien suivi */}
                <AlertToggle
                  id="alert-followed-politician"
                  label="Interventions de politiciens suivis"
                  description="Recevoir une alerte quand un politicien que vous suivez prend la parole."
                  checked={alertFollowedPolitician}
                  onChange={setAlertFollowedPolitician}
                />

                {/* Toggle : Resume hebdomadaire */}
                <AlertToggle
                  id="alert-weekly-digest"
                  label="R\u00e9sum\u00e9 hebdomadaire"
                  description="Recevoir chaque lundi un r\u00e9sum\u00e9 des faits marquants de la semaine politique."
                  checked={alertWeeklyDigest}
                  onChange={setAlertWeeklyDigest}
                />
              </div>
            </section>
          )}
        </div>

        {/* ==============================================================
         * Bouton de deconnexion
         * Positionne en bas de page, style outline rouge pour signaler
         * l'action destructive.
         * ============================================================== */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => {
              // TODO : Remplacer par un appel Supabase Auth (signOut)
              console.log("[Dixipolis] Deconnexion demandee");
            }}
            className="inline-flex items-center gap-2 rounded-lg border-2 px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              borderColor: "var(--color-error)",
              color: "var(--color-error)",
              backgroundColor: "transparent",
            }}
          >
            <LogOut size={18} aria-hidden="true" />
            Se d&eacute;connecter
          </button>
        </div>
      </div>
    </main>
  );
}

/* =============================================================================
 * AlertToggle — Composant reutilisable pour un toggle d'alerte
 *
 * Affiche un interrupteur (switch) stylise avec label et description.
 * Utilise un <button role="switch"> natif pour l'accessibilite complete.
 *
 * @param id          - Identifiant unique pour le htmlFor / aria
 * @param label       - Titre de l'alerte
 * @param description - Description courte
 * @param checked     - Etat actuel du toggle
 * @param onChange    - Callback de changement d'etat
 * ============================================================================= */
function AlertToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className="flex items-start justify-between gap-4 rounded-lg border p-4"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Texte descriptif de l'alerte */}
      <div className="flex-1">
        <label
          htmlFor={id}
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label}
        </label>
        <p
          className="mt-0.5 text-xs leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {description}
        </p>
      </div>

      {/* Switch toggle personnalise
       * Utilise role="switch" et aria-checked pour l'accessibilite.
       * Le rond interne se deplace de gauche a droite selon l'etat. */}
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2"
        )}
        style={{
          backgroundColor: checked
            ? "var(--color-primary)"
            : "var(--color-border)",
        }}
      >
        {/* Rond du toggle */}
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

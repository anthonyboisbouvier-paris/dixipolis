/* =============================================================================
 * lib/constants.ts
 *
 * Constantes globales de l'application Dixipolis.
 * Centralise toutes les valeurs fixes : navigation, métadonnées, données mock, etc.
 * ============================================================================= */

import type { NavItem, PricingPlan, Politician, GeneratedContent, ThemeData } from "@/types";

/* --------------------------------------------------------------------------
 * MÉTADONNÉES DU SITE
 * -------------------------------------------------------------------------- */
export const SITE_NAME = "Dixipolis";
export const SITE_DESCRIPTION =
  "La plateforme d'IA puissante pour analyser le discours politique. Retrouvez facilement tout ce qui a été dit par les politiciens et partis grâce à l'intelligence artificielle.";
export const SITE_URL = "https://dixipolis.vercel.app";

/* --------------------------------------------------------------------------
 * NAVIGATION PRINCIPALE
 * -------------------------------------------------------------------------- */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Prompt", href: "/prompt" },
  { label: "Analytique", href: "/analytique" },
  { label: "Contenu", href: "/contenu" },
  { label: "API Pro", href: "/api-pro" },
  { label: "Tarifs", href: "/tarifs" },
];

/* --------------------------------------------------------------------------
 * NAVIGATION SECONDAIRE (menu hamburger)
 * -------------------------------------------------------------------------- */
export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { label: "À Propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
  { label: "Compte", href: "/compte" },
];

/* --------------------------------------------------------------------------
 * NAVIGATION FOOTER
 * -------------------------------------------------------------------------- */
export const FOOTER_NAV = {
  product: [
    { label: "Prompt", href: "/prompt" },
    { label: "Analytique", href: "/analytique" },
    { label: "Contenu", href: "/contenu" },
    { label: "API Pro", href: "/api-pro" },
    { label: "Tarifs", href: "/tarifs" },
  ],
  company: [
    { label: "À Propos", href: "/a-propos" },
    { label: "Contact", href: "/contact" },
    { label: "Équipe", href: "/a-propos#equipe" },
  ],
  legal: [
    { label: "Mentions Légales", href: "/mentions-legales" },
    { label: "Politique de Confidentialité", href: "/politique-confidentialite" },
    { label: "CGU", href: "/cgu" },
  ],
};

/* --------------------------------------------------------------------------
 * PLANS TARIFAIRES
 * -------------------------------------------------------------------------- */
export const PRICING_PLANS_WEB: PricingPlan[] = [
  {
    id: "free",
    name: "Découverte",
    description: "Explorez gratuitement la plateforme avec un accès limité.",
    price: 0,
    currency: "EUR",
    period: "month",
    features: [
      "5 requêtes par mois",
      "Recherche sémantique basique",
      "Accès aux verbatims sourcés",
      "Liens vidéo horodatés",
    ],
    ctaLabel: "Commencer gratuitement",
    category: "web",
  },
  {
    id: "essential",
    name: "Accès Essentiel",
    description: "Pour les citoyens exigeants et les recherches régulières.",
    price: 4.9,
    currency: "EUR",
    period: "month",
    features: [
      "30 requêtes par mois",
      "Recherche sémantique standard via LLM",
      "Verbatims sourcés (timecodes + liens vidéo)",
      "Fiches politiciens",
      "Newsletter généraliste",
    ],
    ctaLabel: "Choisir Essentiel",
    category: "web",
  },
  {
    id: "pro-web",
    name: "Accès Pro",
    description: "Pour les professionnels : journalistes, chercheurs, analystes.",
    price: 24.9,
    currency: "EUR",
    period: "month",
    features: [
      "Requêtes illimitées",
      "Recherche sémantique + filtres avancés",
      "Tableaux de bord essentiels",
      "Newsletters personnalisées",
      "Exports PDF",
      "Alertes sur sujets suivis",
    ],
    isPopular: true,
    ctaLabel: "Choisir Pro",
    category: "web",
  },
];

export const PRICING_PLANS_API: PricingPlan[] = [
  {
    id: "api-starter",
    name: "API Starter",
    description: "Pour les premiers pas avec l'API Dixipolis.",
    price: 129,
    currency: "EUR",
    period: "month",
    features: [
      "300 requêtes / mois",
      "Recherche sémantique et extraction de citations",
      "Métadonnées complètes (orateur, date, source)",
      "Documentation et exemples",
    ],
    ctaLabel: "Démarrer avec l'API",
    category: "api",
  },
  {
    id: "api-pro",
    name: "API Pro",
    description: "Pour les usages intensifs et l'intégration avancée.",
    price: 349,
    currency: "EUR",
    period: "month",
    features: [
      "3 000 requêtes / mois",
      "Recherche avancée multi-critères",
      "Statistiques agrégées et analyses thématiques",
      "Webhooks et automatisation",
      "Support prioritaire",
    ],
    isPopular: true,
    ctaLabel: "Choisir API Pro",
    category: "api",
  },
  {
    id: "api-enterprise",
    name: "API Entreprise",
    description: "Solution sur mesure pour les grands comptes.",
    price: 0, // Sur devis
    currency: "EUR",
    period: "month",
    features: [
      "Volumes élevés ou illimités",
      "SLA garanti",
      "Comparaisons historiques et détection d'incohérences",
      "Accompagnement et paramétrage sur mesure",
    ],
    ctaLabel: "Nous contacter",
    category: "api",
  },
];

/* --------------------------------------------------------------------------
 * DONNÉES MOCK — POLITICIENS
 * Données de démonstration. Seront remplacées par les appels API Supabase.
 * -------------------------------------------------------------------------- */
export const MOCK_POLITICIANS: Politician[] = [
  {
    id: "1",
    slug: "emmanuel-macron",
    firstName: "Emmanuel",
    lastName: "Macron",
    fullName: "Emmanuel Macron",
    party: "Renaissance",
    partyAbbreviation: "RE",
    role: "Président de la République",
    photoUrl: "/images/placeholder-politician.svg",
    bio: "Emmanuel Macron est le Président de la République française depuis 2017.",
    topThemes: ["Économie", "Europe", "Réformes", "Défense"],
    speechCount: 1245,
    lastActivity: "2025-01-15",
  },
  {
    id: "2",
    slug: "marine-le-pen",
    firstName: "Marine",
    lastName: "Le Pen",
    fullName: "Marine Le Pen",
    party: "Rassemblement National",
    partyAbbreviation: "RN",
    role: "Députée du Pas-de-Calais",
    photoUrl: "/images/placeholder-politician.svg",
    bio: "Marine Le Pen est une femme politique française, présidente du Rassemblement National.",
    topThemes: ["Immigration", "Sécurité", "Pouvoir d'achat", "Souveraineté"],
    speechCount: 987,
    lastActivity: "2025-01-14",
  },
  {
    id: "3",
    slug: "jean-luc-melenchon",
    firstName: "Jean-Luc",
    lastName: "Mélenchon",
    fullName: "Jean-Luc Mélenchon",
    party: "La France Insoumise",
    partyAbbreviation: "LFI",
    role: "Député des Bouches-du-Rhône",
    photoUrl: "/images/placeholder-politician.svg",
    bio: "Jean-Luc Mélenchon est le fondateur et leader de La France Insoumise.",
    topThemes: ["Social", "Écologie", "6e République", "Économie"],
    speechCount: 876,
    lastActivity: "2025-01-13",
  },
  {
    id: "4",
    slug: "jordan-bardella",
    firstName: "Jordan",
    lastName: "Bardella",
    fullName: "Jordan Bardella",
    party: "Rassemblement National",
    partyAbbreviation: "RN",
    role: "Président du Rassemblement National",
    photoUrl: "/images/placeholder-politician.svg",
    bio: "Jordan Bardella est le président du Rassemblement National depuis 2022.",
    topThemes: ["Immigration", "Europe", "Jeunesse", "Sécurité"],
    speechCount: 543,
    lastActivity: "2025-01-12",
  },
  {
    id: "5",
    slug: "gabriel-attal",
    firstName: "Gabriel",
    lastName: "Attal",
    fullName: "Gabriel Attal",
    party: "Renaissance",
    partyAbbreviation: "RE",
    role: "Ancien Premier Ministre",
    photoUrl: "/images/placeholder-politician.svg",
    bio: "Gabriel Attal a été le plus jeune Premier ministre de la Ve République.",
    topThemes: ["Éducation", "Jeunesse", "Réformes", "Budget"],
    speechCount: 412,
    lastActivity: "2025-01-11",
  },
  {
    id: "6",
    slug: "francois-ruffin",
    firstName: "François",
    lastName: "Ruffin",
    fullName: "François Ruffin",
    party: "Picardie Debout",
    partyAbbreviation: "PD",
    role: "Député de la Somme",
    photoUrl: "/images/placeholder-politician.svg",
    bio: "François Ruffin est député, journaliste et réalisateur.",
    topThemes: ["Travail", "Social", "Industrie", "Ruralité"],
    speechCount: 389,
    lastActivity: "2025-01-10",
  },
];

/* --------------------------------------------------------------------------
 * DONNÉES MOCK — THÈMES ANALYTIQUES
 * -------------------------------------------------------------------------- */
export const MOCK_THEMES: ThemeData[] = [
  { theme: "Économie", count: 4520, percentage: 22, trend: "up" },
  { theme: "Immigration", count: 3890, percentage: 19, trend: "up" },
  { theme: "Écologie", count: 3120, percentage: 15, trend: "stable" },
  { theme: "Sécurité", count: 2870, percentage: 14, trend: "down" },
  { theme: "Éducation", count: 2340, percentage: 11, trend: "stable" },
  { theme: "Santé", count: 1980, percentage: 10, trend: "up" },
  { theme: "Europe", count: 1650, percentage: 8, trend: "stable" },
];

/* --------------------------------------------------------------------------
 * DONNÉES MOCK — CONTENU GÉNÉRÉ
 * Reflète les vrais modules d'analyse des tickets Linear :
 *   - fact-check  : verdicts Factiverse (DIX-12)
 *   - propaganda  : détection de techniques de manipulation (DIX-11)
 *   - alert       : pics de toxicité ou nouvelles prises de parole (DIX-10)
 *   - synthesis   : comparaisons inter-partis (DIX-31/32)
 *   - article     : analyses thématiques croisées (DIX-8)
 *   - newsletter  : résumé hebdomadaire automatisé
 * -------------------------------------------------------------------------- */
export const MOCK_CONTENT: GeneratedContent[] = [
  {
    id: "1",
    title: "Fact-check : « Le chômage a baissé de 30 % depuis 2017 »",
    summary: "Verdict automatique : TROMPEUR. Le taux de chômage est passé de 9,5 % à 7,1 %, soit −25 %, pas −30 %. Sources INSEE croisées avec score de confiance 0.87.",
    content: "",
    type: "fact-check",
    theme: "Économie",
    publishedAt: "2025-01-15T08:00:00Z",
    readTimeMinutes: 4,
    relatedPoliticians: ["Emmanuel Macron"],
  },
  {
    id: "2",
    title: "Propagande détectée : appel à la peur sur l'immigration",
    summary: "Techniques identifiées : appel à la peur, simplification abusive. Score de confiance : 0.73. Analyse du tour de parole complet avec contexte.",
    content: "",
    type: "propaganda",
    theme: "Immigration",
    publishedAt: "2025-01-14T10:30:00Z",
    readTimeMinutes: 5,
    relatedPoliticians: ["Marine Le Pen", "Jordan Bardella"],
  },
  {
    id: "3",
    title: "Newsletter hebdomadaire — Semaine du 6 janvier 2025",
    summary: "Claims fact-checkés de la semaine, techniques de propagande détectées, et évolution des émotions dominantes par parti.",
    content: "",
    type: "newsletter",
    theme: "Général",
    publishedAt: "2025-01-13T06:00:00Z",
    readTimeMinutes: 10,
    relatedPoliticians: [],
  },
  {
    id: "4",
    title: "Éducation : matrice de distance idéologique entre partis",
    summary: "Synthèse des positions par parti sur l'éducation, basée sur la distance sémantique des embeddings des 6 derniers mois de discours.",
    content: "",
    type: "synthesis",
    theme: "Éducation",
    publishedAt: "2025-01-12T14:00:00Z",
    readTimeMinutes: 8,
    relatedPoliticians: ["Gabriel Attal", "Jean-Luc Mélenchon"],
  },
  {
    id: "5",
    title: "Alerte : pic de toxicité détecté sur les retraites",
    summary: "Détection automatique d'un pic de toxicité (score 0.87) dans les tours de parole sur les retraites cette semaine.",
    content: "",
    type: "alert",
    theme: "Réformes",
    publishedAt: "2025-01-11T16:45:00Z",
    readTimeMinutes: 3,
    relatedPoliticians: ["Emmanuel Macron"],
  },
  {
    id: "6",
    title: "Écologie : scoring des propositions par parti",
    summary: "Clustering automatique des propositions écologiques. Score d'importance et répartition par acteur politique via analyse des embeddings.",
    content: "",
    type: "article",
    theme: "Écologie",
    publishedAt: "2025-01-10T09:15:00Z",
    readTimeMinutes: 6,
    relatedPoliticians: ["Jean-Luc Mélenchon", "François Ruffin"],
  },
];

/* --------------------------------------------------------------------------
 * SUGGESTIONS DE RECHERCHE
 * Exemples affichés dans l'interface Prompt.
 * -------------------------------------------------------------------------- */
export const SEARCH_SUGGESTIONS = [
  "Qu'a dit Emmanuel Macron sur l'inflation en 2024 ?",
  "Quelles sont les positions de Marine Le Pen sur l'immigration ?",
  "Comparer les discours de Mélenchon et Macron sur l'écologie",
  "Que propose Jordan Bardella pour l'Europe ?",
  "Les contradictions de Gabriel Attal sur l'éducation",
  "Position du PS sur la réforme des retraites",
];

/* --------------------------------------------------------------------------
 * PARTIS POLITIQUES (pour les filtres)
 * -------------------------------------------------------------------------- */
export const POLITICAL_PARTIES = [
  { name: "Renaissance", abbreviation: "RE", color: "#FFD700" },
  { name: "Rassemblement National", abbreviation: "RN", color: "#0D2B55" },
  { name: "La France Insoumise", abbreviation: "LFI", color: "#CC0000" },
  { name: "Les Républicains", abbreviation: "LR", color: "#0066CC" },
  { name: "Parti Socialiste", abbreviation: "PS", color: "#FF69B4" },
  { name: "Europe Écologie Les Verts", abbreviation: "EELV", color: "#00A86B" },
  { name: "Parti Communiste Français", abbreviation: "PCF", color: "#DD0000" },
  { name: "MoDem", abbreviation: "MoDem", color: "#FF8C00" },
];

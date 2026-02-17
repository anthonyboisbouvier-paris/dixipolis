/* =============================================================================
 * types/index.ts
 *
 * Définitions TypeScript centralisées pour l'ensemble de l'application Dixipolis.
 * Chaque interface est documentée pour faciliter la compréhension et l'évolution.
 * Ces types seront utilisés côté front-end ET pour typer les réponses futures du back-end.
 * ============================================================================= */

/* --------------------------------------------------------------------------
 * POLITICIEN
 * Représente une personnalité politique indexée dans la base Dixipolis.
 * -------------------------------------------------------------------------- */
export interface Politician {
  id: string;
  slug: string;                 // URL-friendly identifier (ex: "emmanuel-macron")
  firstName: string;
  lastName: string;
  fullName: string;             // Prénom + Nom combinés
  party: string;                // Nom du parti politique
  partyAbbreviation: string;    // Abréviation du parti (ex: "LR", "RN", "PS")
  role: string;                 // Fonction actuelle (ex: "Président de la République")
  photoUrl: string;             // URL de la photo de profil
  bio: string;                  // Biographie courte
  topThemes: string[];          // Thèmes les plus abordés
  speechCount: number;          // Nombre de discours indexés
  lastActivity: string;         // Date de la dernière activité (ISO string)
}

/* --------------------------------------------------------------------------
 * DISCOURS / EXTRAIT
 * Représente un extrait de discours indexé avec ses métadonnées.
 * -------------------------------------------------------------------------- */
export interface SpeechExcerpt {
  id: string;
  politicianId: string;
  politicianName: string;
  party: string;
  text: string;                 // Verbatim exact
  date: string;                 // Date du discours (ISO string)
  videoUrl: string;             // Lien YouTube horodaté
  videoTitle: string;           // Titre de la vidéo source
  channelName: string;          // Nom de la chaîne source
  startTime: number;            // Timecode de début (en secondes)
  endTime: number;              // Timecode de fin (en secondes)
  theme: string;                // Thème détecté
  relevanceScore: number;       // Score de pertinence (0-1)
}

/* --------------------------------------------------------------------------
 * MESSAGE DE CONVERSATION (Prompt / Chat)
 * Utilisé dans l'interface de type ChatGPT.
 * -------------------------------------------------------------------------- */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;            // ISO string
  sources?: SpeechExcerpt[];    // Sources citées dans la réponse
  isLoading?: boolean;          // Indicateur de chargement
}

/* --------------------------------------------------------------------------
 * RÉSULTAT DE RECHERCHE
 * Encapsule un résultat retourné par le moteur de recherche hybride.
 * -------------------------------------------------------------------------- */
export interface SearchResult {
  query: string;
  totalResults: number;
  excerpts: SpeechExcerpt[];
  filters: SearchFilters;
  executionTimeMs: number;
}

/* --------------------------------------------------------------------------
 * FILTRES DE RECHERCHE
 * Paramètres de filtrage pour le moteur de recherche avancé.
 * -------------------------------------------------------------------------- */
export interface SearchFilters {
  dateFrom?: string;
  dateTo?: string;
  politician?: string;
  party?: string;
  theme?: string;
  sortBy: "relevance" | "date";
}

/* --------------------------------------------------------------------------
 * DONNÉES ANALYTIQUES
 * Structures pour les tableaux de bord et graphiques.
 * -------------------------------------------------------------------------- */
export interface ThemeData {
  theme: string;
  count: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AnalyticsDashboard {
  topThemes: ThemeData[];
  speechesOverTime: TimeSeriesPoint[];
  totalSpeeches: number;
  totalPoliticians: number;
  totalHoursIndexed: number;
  lastUpdate: string;
}

/* --------------------------------------------------------------------------
 * CONTENU GÉNÉRÉ
 * Articles, newsletters et synthèses produits par le module de génération.
 * -------------------------------------------------------------------------- */
export interface GeneratedContent {
  id: string;
  title: string;
  summary: string;
  content: string;              // Contenu HTML complet
  type: "article" | "newsletter" | "synthesis" | "alert";
  theme: string;
  publishedAt: string;
  readTimeMinutes: number;
  relatedPoliticians: string[];
  thumbnailUrl?: string;
}

/* --------------------------------------------------------------------------
 * PLAN TARIFAIRE
 * Structure pour les offres web et API.
 * -------------------------------------------------------------------------- */
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;                // Prix mensuel en euros (0 = gratuit)
  currency: "EUR";
  period: "month";
  features: string[];
  highlightedFeatures?: string[];
  isPopular?: boolean;
  ctaLabel: string;
  category: "web" | "api";
}

/* --------------------------------------------------------------------------
 * UTILISATEUR
 * Représente un utilisateur connecté (futur Supabase Auth).
 * -------------------------------------------------------------------------- */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;                 // ID du plan tarifaire actif
  createdAt: string;
  savedSearches: string[];
  followedPoliticians: string[];
  followedThemes: string[];
  alertsEnabled: boolean;
}

/* --------------------------------------------------------------------------
 * NAVIGATION
 * Types pour le menu de navigation du site.
 * -------------------------------------------------------------------------- */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  isExternal?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

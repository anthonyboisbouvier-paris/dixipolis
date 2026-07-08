/* =============================================================================
 * lib/utils.ts
 *
 * Fonctions utilitaires réutilisables dans toute l'application.
 * Chaque fonction est pure, testable et documentée.
 * ============================================================================= */

import { clsx, type ClassValue } from "clsx";

/* --------------------------------------------------------------------------
 * cn — Merge de classes CSS conditionnel (compatible Tailwind)
 * Utilise clsx pour combiner des classes de manière propre.
 * -------------------------------------------------------------------------- */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/* --------------------------------------------------------------------------
 * formatDate — Formate une date ISO en format français lisible.
 * @param dateStr - Date au format ISO string
 * @param options - Options Intl.DateTimeFormat personnalisées
 * @returns String formatée (ex: "15 janvier 2025")
 * -------------------------------------------------------------------------- */
export function formatDate(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateStr).toLocaleDateString("fr-FR", options ?? defaultOptions);
}

/* --------------------------------------------------------------------------
 * formatRelativeDate — Affiche une date relative ("il y a 2 heures").
 * @param dateStr - Date au format ISO string
 * @returns String relative
 * -------------------------------------------------------------------------- */
export function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return formatDate(dateStr);
}

/* --------------------------------------------------------------------------
 * formatTimecode — Convertit des secondes en format "MM:SS" ou "HH:MM:SS".
 * @param seconds - Nombre de secondes
 * @returns String formatée
 * -------------------------------------------------------------------------- */
export function formatTimecode(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* --------------------------------------------------------------------------
 * formatDuration — Convertit des secondes en durée lisible ("2h 05", "12 min").
 * Utilisé pour les temps de parole et durées de vidéo (données réelles).
 * @param sec - Durée en secondes (null/0 → "—")
 * @returns String formatée
 * -------------------------------------------------------------------------- */
export function formatDuration(sec: number | null): string {
  if (!sec || sec <= 0) return "—";
  let h = Math.floor(sec / 3600);
  let m = Math.round((sec % 3600) / 60);
  if (m === 60) {
    h += 1;
    m = 0;
  }
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}`;
  if (m > 0) return `${m} min`;
  return `${Math.round(sec)} s`;
}

/* --------------------------------------------------------------------------
 * truncateText — Coupe un texte à une longueur donnée avec "...".
 * @param text - Texte source
 * @param maxLength - Longueur maximale
 * @returns Texte tronqué
 * -------------------------------------------------------------------------- */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/* --------------------------------------------------------------------------
 * slugify — Transforme un texte en slug URL-friendly.
 * @param text - Texte à transformer
 * @returns Slug (ex: "emmanuel-macron")
 * -------------------------------------------------------------------------- */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/* --------------------------------------------------------------------------
 * generateId — Génère un identifiant unique simple.
 * Pour le front-end uniquement (pas de sécurité cryptographique).
 * @returns String ID unique
 * -------------------------------------------------------------------------- */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/* --------------------------------------------------------------------------
 * formatNumber — Formate un nombre avec séparateur de milliers français.
 * @param num - Nombre à formater
 * @returns String formatée (ex: "1 234 567")
 * -------------------------------------------------------------------------- */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("fr-FR").format(num);
}

/* --------------------------------------------------------------------------
 * getReadTimeLabel — Retourne un label de temps de lecture.
 * @param minutes - Durée en minutes
 * @returns String lisible (ex: "7 min de lecture")
 * -------------------------------------------------------------------------- */
export function getReadTimeLabel(minutes: number): string {
  return `${minutes} min de lecture`;
}

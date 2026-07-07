/* =============================================================================
 * app/sitemap.ts
 *
 * Génère automatiquement le sitemap.xml pour le SEO.
 * Next.js expose ce fichier à /sitemap.xml.
 * ============================================================================= */

import type { MetadataRoute } from "next";
import { MOCK_POLITICIANS } from "@/lib/constants";

const BASE_URL = "https://dixipolis.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  /* Pages statiques */
  const staticPages = [
    "",
    "/prompt",
    "/politiciens",
    "/videos",
    "/analytique",
    "/du-jour",
    "/contenu",
    "/api-pro",
    "/tarifs",
    "/connexion",
    "/inscription",
    "/a-propos",
    "/contact",
    "/mentions-legales",
    "/politique-confidentialite",
    "/cgu",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  /* Pages dynamiques — politiciens */
  const politicianPages = MOCK_POLITICIANS.map((p) => ({
    url: `${BASE_URL}/politicien/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...politicianPages];
}

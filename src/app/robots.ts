/* =============================================================================
 * app/robots.ts
 *
 * Génère automatiquement le robots.txt pour le SEO.
 * Next.js expose ce fichier à /robots.txt.
 * ============================================================================= */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/compte", "/api/"],
    },
    sitemap: "https://dixipolis.fr/sitemap.xml",
  };
}

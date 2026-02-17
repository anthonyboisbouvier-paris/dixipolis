/* =============================================================================
 * app/layout.tsx
 *
 * Layout racine de l'application Dixipolis.
 * Ce composant enveloppe TOUTES les pages et fournit :
 *   - Les métadonnées SEO globales
 *   - Les polices de caractères (Inter via Google Fonts)
 *   - Le Header et Footer partagés
 *   - Les styles globaux (via globals.css)
 *
 * Architecture :
 *   <html>
 *     <body>
 *       <Header />        ← Navigation fixe en haut
 *       <main>{page}</main>  ← Contenu de la page courante
 *       <Footer />         ← Pied de page
 *     </body>
 *   </html>
 * ============================================================================= */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* --------------------------------------------------------------------------
 * POLICE DE CARACTÈRES — Inter (Google Fonts)
 * Inter est une police sans-serif moderne, lisible et professionnelle,
 * parfaitement adaptée à un contexte institutionnel/politique.
 * -------------------------------------------------------------------------- */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* --------------------------------------------------------------------------
 * MÉTADONNÉES SEO GLOBALES
 * Ces métadonnées sont héritées par toutes les pages sauf si elles
 * définissent leurs propres métadonnées.
 * -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: {
    default: "Dixipolis — Analyse du discours politique par l'IA",
    template: "%s | Dixipolis",
  },
  description:
    "La plateforme d'IA puissante pour analyser le discours politique. Retrouvez facilement tout ce qui a été dit par les politiciens et partis grâce à l'intelligence artificielle.",
  keywords: [
    "politique",
    "discours politique",
    "analyse politique",
    "IA",
    "intelligence artificielle",
    "fact-checking",
    "transparence",
    "France",
    "politiciens",
    "recherche sémantique",
  ],
  authors: [{ name: "Dixipolis" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Dixipolis",
    title: "Dixipolis — Analyse du discours politique par l'IA",
    description:
      "Retrouvez facilement tout ce qui a été dit par les politiciens et partis grâce à l'intelligence artificielle.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dixipolis — Analyse du discours politique par l'IA",
    description:
      "Retrouvez facilement tout ce qui a été dit par les politiciens et partis grâce à l'intelligence artificielle.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* --------------------------------------------------------------------------
 * COMPOSANT LAYOUT RACINE
 * -------------------------------------------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        {/* ----- Header fixe en haut de toutes les pages ----- */}
        <Header />

        {/* ----- Contenu principal de la page ----- */}
        <main className="flex-1">{children}</main>

        {/* ----- Footer en bas de toutes les pages ----- */}
        <Footer />
      </body>
    </html>
  );
}

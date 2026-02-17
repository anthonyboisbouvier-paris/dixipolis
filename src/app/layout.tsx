/* =============================================================================
 * app/layout.tsx
 *
 * Layout racine de l'application Dixipolis.
 * Fournit : métadonnées SEO, polices, Header/Footer, skip-to-content WCAG.
 *
 * Le <main id="main-content"> reçoit le padding-top correspondant à la
 * hauteur du header fixe (72px). Cela garantit qu'aucune page ne sera
 * jamais cachée derrière le header.
 * ============================================================================= */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* --------------------------------------------------------------------------
 * POLICE — Inter (Google Fonts)
 * -------------------------------------------------------------------------- */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* --------------------------------------------------------------------------
 * MÉTADONNÉES SEO GLOBALES
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
    "Dixipolis",
  ],
  authors: [{ name: "Dixipolis" }],
  creator: "Dixipolis",
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
        {/* ----- Skip to content (accessibilité WCAG) ----- */}
        <a href="#main-content" className="skip-to-content">
          Aller au contenu principal
        </a>

        {/* ----- Header fixe ----- */}
        <Header />

        {/* ----- Contenu principal avec padding-top pour le header fixe ----- */}
        <main
          id="main-content"
          className="flex-1"
          style={{ paddingTop: "var(--header-height)" }}
        >
          {children}
        </main>

        {/* ----- Footer ----- */}
        <Footer />
      </body>
    </html>
  );
}

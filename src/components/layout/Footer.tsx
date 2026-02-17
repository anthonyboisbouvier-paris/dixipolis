/* =============================================================================
 * components/layout/Footer.tsx
 *
 * Pied de page de l'application Dixipolis.
 *
 * Composant serveur (pas de "use client") car il n'utilise aucun etat local
 * ni hook cote client. Cela permet un rendu statique optimal.
 *
 * Structure du footer :
 *   - Partie superieure : 4 colonnes sur desktop, empilees sur mobile
 *       > Colonne 1 : Logo + description du site + liens sociaux (Twitter/X, LinkedIn)
 *       > Colonne 2 : "Produit" — liens vers les fonctionnalites (Prompt, Analytique, etc.)
 *       > Colonne 3 : "Entreprise" — liens institutionnels (A Propos, Contact, Equipe)
 *       > Colonne 4 : "Legal" — liens juridiques (Mentions Legales, CGU, etc.)
 *   - Partie inferieure : barre de copyright avec l'annee courante
 *
 * Couleurs et styles :
 *   - Fond sombre : #0f172a (var(--color-bg-header) / slate-900)
 *   - Texte principal : blanc
 *   - Texte secondaire : gris clair (var(--color-text-on-dark))
 *   - Liens : hover en blanc pur avec transition
 *   - Separateur : bordure slate-800
 *
 * Donnees :
 *   - FOOTER_NAV : objet contenant les trois groupes de liens (product, company, legal)
 *   - SITE_NAME  : nom du site affiche dans le logo et le copyright
 *   - Importe depuis "@/lib/constants"
 *
 * Icones :
 *   - Twitter (X) et Linkedin depuis lucide-react pour les liens sociaux
 *
 * Accessibilite :
 *   - aria-label sur la balise footer et les sections de navigation
 *   - Liens externes (sociaux) avec target="_blank" et rel="noopener noreferrer"
 *   - Structure semantique avec balises nav, section, et listes
 * ============================================================================= */

import Link from "next/link";
import { Twitter, Linkedin, PenTool } from "lucide-react";
import { FOOTER_NAV, SITE_NAME } from "@/lib/constants";

/* --------------------------------------------------------------------------
 * DONNEES LOCALES
 * Liens vers les reseaux sociaux de Dixipolis.
 * Chaque entree contient le label accessible, le href et l'icone associee.
 * -------------------------------------------------------------------------- */
const SOCIAL_LINKS = [
  {
    label: "Twitter / X",
    href: "https://twitter.com/dixipolis",
    // On passe le composant d'icone comme reference pour le rendre dynamiquement
    Icon: Twitter,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/dixipolis",
    Icon: Linkedin,
  },
] as const;

/* --------------------------------------------------------------------------
 * COLONNES DE NAVIGATION
 * Mappage entre les cles de FOOTER_NAV et les titres affiches en francais.
 * Cela evite de coder en dur les titres dans le JSX et facilite l'evolution.
 * -------------------------------------------------------------------------- */
const FOOTER_COLUMNS: { key: keyof typeof FOOTER_NAV; title: string }[] = [
  { key: "product", title: "Produit" },
  { key: "company", title: "Entreprise" },
  { key: "legal", title: "Legal" },
];

/* --------------------------------------------------------------------------
 * Footer — Composant principal
 * -------------------------------------------------------------------------- */
export default function Footer() {
  /* On calcule l'annee courante pour le copyright.
     Comme c'est un composant serveur, la date est evaluee au moment du build
     ou du rendu serveur (ISR/SSR), ce qui est parfaitement adapte. */
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "var(--color-bg-dark)" }}
      role="contentinfo"
      aria-label="Pied de page Dixipolis"
    >
      {/* ================================================================
       * PARTIE SUPERIEURE — Colonnes de navigation
       * Grille responsive : 1 colonne mobile, 2 tablette, 4 desktop.
       * ================================================================ */}
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* ==============================================================
           * COLONNE 1 : LOGO + DESCRIPTION + RESEAUX SOCIAUX
           * Cette colonne occupe plus d'espace sur les grands ecrans
           * pour donner de la respiration au texte descriptif.
           * ============================================================== */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo du site avec icone plume */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white hover:text-[var(--color-primary-100)] transition-colors duration-200 mb-4"
              aria-label={`${SITE_NAME} — Retour a l'accueil`}
            >
              <PenTool className="h-5 w-5" />
              <span className="text-lg font-bold tracking-tight">
                {SITE_NAME}
              </span>
            </Link>

            {/* Description courte du site */}
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
              La plateforme d&apos;IA pour analyser le discours politique
              fran&ccedil;ais. D&eacute;cryptez, comparez et comprenez ce que
              disent vraiment les politiques.
            </p>

            {/* Liens vers les reseaux sociaux */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-slate-700 hover:text-white transition-colors duration-200"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "var(--color-text-muted)" }}
                  aria-label={`Suivre ${SITE_NAME} sur ${label}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ==============================================================
           * COLONNES 2, 3, 4 : LIENS DE NAVIGATION
           * Generees dynamiquement a partir de FOOTER_COLUMNS et FOOTER_NAV.
           * Chaque colonne affiche un titre et une liste de liens.
           * ============================================================== */}
          {FOOTER_COLUMNS.map(({ key, title }) => (
            <nav
              key={key}
              aria-label={`Navigation ${title}`}
            >
              {/* Titre de la colonne */}
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-on-dark)" }}>
                {title}
              </h3>

              {/* Liste des liens */}
              <ul className="space-y-3">
                {FOOTER_NAV[key].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ================================================================
       * PARTIE INFERIEURE — Barre de copyright
       * Separee visuellement par une bordure superieure fine.
       * Affiche le nom du site et l'annee courante.
       * ================================================================ */}
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="page-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            &copy; {currentYear} {SITE_NAME}. Tous droits r&eacute;serv&eacute;s.
          </p>

          {/* Lien complementaire vers les mentions legales (acces rapide) */}
          <div className="flex items-center gap-4">
            <Link
              href="/mentions-legales"
              className="text-xs hover:text-white transition-colors duration-200"
              style={{ color: "var(--color-text-muted)" }}
            >
              Mentions l&eacute;gales
            </Link>
            <span style={{ opacity: 0.2 }} aria-hidden="true">|</span>
            <Link
              href="/politique-confidentialite"
              className="text-xs hover:text-white transition-colors duration-200"
              style={{ color: "var(--color-text-muted)" }}
            >
              Confidentialit&eacute;
            </Link>
            <span style={{ opacity: 0.2 }} aria-hidden="true">|</span>
            <Link
              href="/cgu"
              className="text-xs hover:text-white transition-colors duration-200"
              style={{ color: "var(--color-text-muted)" }}
            >
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

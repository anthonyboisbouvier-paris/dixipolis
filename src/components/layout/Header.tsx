/* =============================================================================
 * components/layout/Header.tsx
 *
 * En-tete principal de l'application Dixipolis.
 *
 * Composant client ("use client") car il utilise :
 *   - useState  : gestion de l'etat du menu mobile et du dropdown secondaire
 *   - useEffect : detection du scroll pour appliquer l'ombre
 *   - usePathname : detection du lien actif dans la navigation
 *
 * Structure du header :
 *   - Logo "Dixipolis" avec icone plume (PenTool) a gauche, lien vers "/"
 *   - Navigation principale horizontale (desktop uniquement), incluant Tarifs
 *   - Bouton "Se Connecter" (desktop) : CTA primaire avec icone LogIn
 *   - Bouton hamburger a droite :
 *       > Desktop : ouvre un dropdown avec les liens secondaires (A Propos, Contact, Compte)
 *       > Mobile  : ouvre un menu plein ecran avec TOUS les liens + bouton Se Connecter
 *   - Fond blanc, position fixe, hauteur 72px, ombre au scroll
 *
 * Couleurs et styles :
 *   - Lien actif : texte bleu primaire (var(--color-primary)) avec bordure inferieure
 *   - Hover : texte bleu fonce (var(--color-primary-hover))
 *   - Ombre au scroll : shadow-sm via la classe Tailwind
 *
 * Accessibilite :
 *   - aria-label sur le bouton hamburger
 *   - aria-current="page" sur le lien actif
 *   - role="navigation" sur la balise nav
 *   - Fermeture du menu avec la touche Echap (Escape)
 * ============================================================================= */

"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, PenTool, ChevronDown, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS, SITE_NAME } from "@/lib/constants";

/* --------------------------------------------------------------------------
 * Header — Composant principal
 * -------------------------------------------------------------------------- */
export default function Header() {
  /* ---- Etat local ---- */

  // Controle l'ouverture/fermeture du menu mobile (tous les liens)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Controle l'ouverture/fermeture du dropdown secondaire (desktop)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Indique si l'utilisateur a scroll la page (pour afficher l'ombre)
  const [isScrolled, setIsScrolled] = useState(false);

  // Chemin actuel pour la detection du lien actif
  const pathname = usePathname();

  /* ---- Detection du scroll (throttle via requestAnimationFrame) ---- */
  // On ajoute une ombre sous le header des que l'utilisateur scroll
  // au-dela de 10px. Le listener est throttle avec un flag "ticking" :
  // au plus une mise a jour d'etat par frame, pour la fluidite mobile.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 10);
        ticking = false;
      });
    };

    // Verification initiale au cas ou la page est deja scrollee
    // (passe par le meme chemin rAF que le listener)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---- Fermeture au changement de route ---- */
  // Quand l'utilisateur navigue vers une nouvelle page, on ferme tous les menus
  // pour eviter qu'ils restent ouverts apres la navigation.
  // C'est un pattern legitime : on remet l'UI dans un etat coherent apres navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  /* ---- Fermeture avec la touche Echap ---- */
  // Ameliore l'accessibilite en permettant de fermer les menus au clavier.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  /* ---- Blocage du scroll du body quand le menu mobile est ouvert ---- */
  // Empeche le scroll de la page en arriere-plan lorsque le menu mobile
  // est visible, pour une meilleure experience utilisateur.
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Nettoyage : on restaure le scroll si le composant est demonte
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  /* ---- Fermeture du dropdown au clic exterieur ---- */
  // Quand le dropdown secondaire (desktop) est ouvert, un clic en dehors
  // de celui-ci doit le fermer automatiquement.
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    // On utilise un delai minime pour eviter que le clic d'ouverture
    // ne declenche immediatement la fermeture.
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  /* ---- Helper : verification du lien actif ---- */
  // Compare le href du lien avec le pathname actuel.
  // Pour la page d'accueil ("/"), on exige une correspondance exacte.
  // Pour les autres pages, on verifie si le pathname commence par le href
  // afin de gerer les sous-pages (ex: "/contenu/article-1").
  const isActive = useCallback(
    (href: string): boolean => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  /* ---- Toggle du menu mobile ---- */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    // On ferme le dropdown desktop si le menu mobile s'ouvre
    setIsDropdownOpen(false);
  }, []);

  /* ---- Toggle du dropdown secondaire ---- */
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  /* ===========================================================================
   * RENDU JSX
   * =========================================================================== */
  return (
    <>
      {/* -- Header fixe -- */}
      <header
        style={{ height: "var(--header-height)" }}
        className={cn(
          // Position fixe en haut de la page, pleine largeur, z-index eleve
          "fixed top-0 left-0 right-0 z-50",
          // Fond blanc
          "bg-white",
          // Transition fluide pour l'ombre
          "transition-shadow duration-200",
          // Ombre visible uniquement apres le scroll
          isScrolled && "shadow-sm"
        )}
      >
        {/* Container centre avec largeur maximale */}
        <div className="page-container h-full flex items-center justify-between">
          {/* ================================================================
           * LOGO — Lien vers la page d'accueil
           * L'icone PenTool represente la plume, symbole de l'ecriture
           * et du discours politique analyse par Dixipolis.
           * ================================================================ */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
            aria-label={`${SITE_NAME} — Retour a l'accueil`}
          >
            {/* Icone plume */}
            <PenTool className="h-6 w-6 text-[var(--color-primary)]" />
            {/* Nom du site */}
            <span className="text-xl font-bold tracking-tight">
              {SITE_NAME}
            </span>
          </Link>

          {/* ================================================================
           * NAVIGATION PRINCIPALE — Desktop uniquement
           * Affichee horizontalement, masquee sur mobile (hidden md:flex).
           * Chaque lien dispose d'un etat actif visuellement distinct
           * (texte bleu + bordure inferieure coloree).
           * ================================================================ */}
          <nav
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label="Navigation principale"
          >
            {MAIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  // Style de base du lien de navigation
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                  // Etat actif : fond bleu tres clair, texte bleu primaire
                  isActive(item.href)
                    ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                    // Etat inactif : texte gris fonce, hover vers bleu
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-gray-50"
                )}
                // Attribut ARIA pour indiquer la page courante
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ================================================================
           * BOUTON HAMBURGER
           * Visible sur tous les ecrans.
           * - Desktop : ouvre le dropdown des liens secondaires
           * - Mobile  : ouvre le menu plein ecran avec tous les liens
           * ================================================================ */}
          <div className="flex items-center gap-2">
            {/* -- Bouton "Se Connecter" (desktop uniquement) -- */}
            <Link
              href="/connexion"
              className={cn(
                "hidden md:inline-flex items-center gap-1.5",
                "px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                "text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]",
                "shadow-sm hover:shadow-md"
              )}
            >
              <LogIn className="h-4 w-4" />
              Se Connecter
            </Link>

            {/* -- Bouton hamburger desktop (liens secondaires) -- */}
            {/* Visible uniquement sur desktop (hidden md:flex) */}
            <div className="hidden md:block relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                  "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-gray-50",
                  // Etat ouvert : fond actif
                  isDropdownOpen && "bg-gray-50 text-[var(--color-primary)]"
                )}
                aria-label="Ouvrir le menu secondaire"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <Menu className="h-5 w-5" />
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    // Rotation de la fleche quand le dropdown est ouvert
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {/* -- Dropdown secondaire (desktop) -- */}
              {/* Menu deroulant positionne en absolu sous le bouton hamburger.
                  Contient uniquement les liens secondaires (A Propos, Contact, etc.) */}
              {isDropdownOpen && (
                <div
                  className={cn(
                    // Positionnement absolu, aligne a droite
                    "absolute right-0 top-full mt-2",
                    // Style de la carte dropdown
                    "w-56 bg-white rounded-lg shadow-lg",
                    "border border-[var(--color-border)]",
                    // Animation d'apparition
                    "animate-fade-in",
                    // Z-index pour passer au-dessus du contenu
                    "z-50"
                  )}
                  role="menu"
                  aria-label="Menu secondaire"
                >
                  <div className="py-1">
                    {SECONDARY_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          // Style de base des items du dropdown
                          "block px-4 py-2.5 text-sm transition-colors duration-150",
                          // Etat actif : fond bleu clair, texte bleu
                          isActive(item.href)
                            ? "text-[var(--color-primary)] bg-[var(--color-primary-light)]"
                            // Etat inactif : texte gris, hover fond gris tres clair
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-gray-50"
                        )}
                        role="menuitem"
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* -- Bouton hamburger mobile -- */}
            {/* Visible uniquement sur mobile (md:hidden) */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={cn(
                "md:hidden flex items-center justify-center",
                "h-10 w-10 rounded-md transition-colors duration-200",
                "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-gray-50"
              )}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {/* Icone X quand le menu est ouvert, Menu quand il est ferme */}
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================================
       * MENU MOBILE — Plein ecran
       * Affiche en dessous du header, couvre toute la hauteur restante.
       * Contient TOUS les liens : navigation principale + secondaire.
       * Visible uniquement sur mobile (md:hidden) quand isMobileMenuOpen est true.
       * ================================================================== */}
      {isMobileMenuOpen && (
        <div
          style={{ top: "var(--header-height)" }}
          className={cn(
            // Visible uniquement sur mobile
            "md:hidden",
            // Position fixe sous le header, couvre tout l'ecran
            "fixed inset-x-0 bottom-0 z-40",
            // Fond blanc opaque avec defilement possible
            "bg-white overflow-y-auto"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation mobile"
        >
          <nav className="page-container py-4" aria-label="Navigation mobile">
            {/* -- Section : Navigation principale -- */}
            <div className="mb-6">
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Navigation
              </p>
              <div className="space-y-1">
                {MAIN_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      // Style de base des liens mobiles
                      "block px-3 py-3 text-base font-medium rounded-lg transition-colors duration-150",
                      // Etat actif : fond bleu clair, texte bleu, bordure gauche
                      isActive(item.href)
                        ? "text-[var(--color-primary)] bg-[var(--color-primary-light)] border-l-4 border-[var(--color-primary)]"
                        // Etat inactif : texte standard, hover gris
                        : "text-[var(--color-text-primary)] hover:bg-gray-50 hover:text-[var(--color-primary)]"
                    )}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* -- Separateur visuel -- */}
            <hr className="border-[var(--color-border)] mb-6" />

            {/* -- Section : Navigation secondaire -- */}
            <div>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Plus
              </p>
              <div className="space-y-1">
                {SECONDARY_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-3 text-base font-medium rounded-lg transition-colors duration-150",
                      isActive(item.href)
                        ? "text-[var(--color-primary)] bg-[var(--color-primary-light)] border-l-4 border-[var(--color-primary)]"
                        : "text-[var(--color-text-primary)] hover:bg-gray-50 hover:text-[var(--color-primary)]"
                    )}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* -- Separateur visuel -- */}
            <hr className="border-[var(--color-border)] my-6" />

            {/* -- Bouton "Se Connecter" (mobile) -- */}
            <Link
              href="/connexion"
              className={cn(
                "flex items-center justify-center gap-2",
                "w-full px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200",
                "text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
              )}
            >
              <LogIn className="h-5 w-5" />
              Se Connecter
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

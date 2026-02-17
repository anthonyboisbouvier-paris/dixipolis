/* =============================================================================
 * components/home/HeroSection.tsx
 *
 * Section hero de la page d'accueil Dixipolis.
 * Affiche le titre principal, le sous-titre explicatif et un bouton CTA
 * qui dirige l'utilisateur vers l'interface de prompt IA.
 *
 * Composant serveur (Server Component) — pas de "use client".
 * Utilise la classe utilitaire hero-gradient definie dans globals.css
 * pour un arriere-plan en degradé bleu clair/blanc.
 * ============================================================================= */

import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

/* --------------------------------------------------------------------------
 * HeroSection — Composant principal de la section hero
 *
 * Structure :
 *   - Conteneur plein ecran avec gradient de fond (hero-gradient)
 *   - Titre h1 percutant decrivant la valeur de la plateforme
 *   - Sous-titre contextuel expliquant le fonctionnement
 *   - Bouton CTA central imitant une barre de recherche
 *
 * Accessibilite :
 *   - Hierarchie de titres respectee (h1 unique par page)
 *   - Contraste de couleur conforme WCAG AA
 *   - Navigation clavier via Link natif
 * -------------------------------------------------------------------------- */
export default function HeroSection() {
  return (
    <section
      className="hero-gradient relative overflow-hidden"
      aria-label="Presentation de la plateforme Dixipolis"
    >
      {/* Conteneur avec espacement genereux pour un rendu aere */}
      <div className="page-container py-20 sm:py-28 lg:py-36">
        {/* Bloc de contenu centre */}
        <div className="mx-auto max-w-4xl text-center">
          {/* ----------------------------------------------------------------
           * Badge de lancement / contexte
           * Petit indicateur au-dessus du titre pour capter l'attention
           * ---------------------------------------------------------------- */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] backdrop-blur-sm">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--color-success)]"
              aria-hidden="true"
            />
            Plateforme IA pour le discours politique
          </div>

          {/* ----------------------------------------------------------------
           * Titre principal (h1)
           * Phrase d'accroche qui communique la proposition de valeur.
           * Le mot "IA" est mis en couleur primaire pour attirer le regard.
           * ---------------------------------------------------------------- */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
            La plateforme{" "}
            <span className="text-[var(--color-primary)]">d&apos;IA puissante</span>{" "}
            pour analyser le discours politique
          </h1>

          {/* ----------------------------------------------------------------
           * Sous-titre explicatif
           * Contexte supplementaire sur le fonctionnement de la plateforme.
           * Texte secondaire pour ne pas concurrencer visuellement le titre.
           * ---------------------------------------------------------------- */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
            Retrouvez ce que les politiques ont vraiment dit. Notre intelligence
            artificielle analyse des milliers d&apos;heures de debats, interviews
            et discours pour vous fournir des reponses sourcees et verifiables.
          </p>

          {/* ----------------------------------------------------------------
           * Bouton CTA — Style barre de recherche
           * Lien vers /prompt qui imite visuellement un champ de recherche
           * pour encourager l'interaction. Au survol, l'ombre s'accentue
           * et le bouton se deplace legerement vers le haut.
           * ---------------------------------------------------------------- */}
          <Link
            href="/prompt"
            className="group mx-auto inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-6 py-4 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-[var(--transition-normal)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-lg sm:px-8 sm:text-lg"
          >
            {/* Icone de recherche a gauche */}
            <Search
              className="h-5 w-5 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-primary)]"
              aria-hidden="true"
            />
            <span>Posez votre question sur le discours politique...</span>
            {/* Fleche directionnelle qui se deplace au survol */}
            <ArrowRight
              className="h-5 w-5 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          {/* ----------------------------------------------------------------
           * Indicateurs de credibilite sous le CTA
           * Petites mentions rassurantes sur les capacites de la plateforme.
           * ---------------------------------------------------------------- */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
                aria-hidden="true"
              />
              Sources verifiees
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
                aria-hidden="true"
              />
              Extraits video horodates
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
                aria-hidden="true"
              />
              Mise a jour quotidienne
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------
       * Element decoratif de fond
       * Cercle flou en arriere-plan pour renforcer l'effet de profondeur
       * du degradé hero-gradient. Position absolue, pas d'impact layout.
       * ---------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--color-primary)] opacity-[0.04] blur-3xl"
        aria-hidden="true"
      />
    </section>
  );
}

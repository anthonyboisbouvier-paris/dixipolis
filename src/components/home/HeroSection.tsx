/* =============================================================================
 * components/home/HeroSection.tsx
 *
 * Hero section modernisee avec branding fort et design ludique.
 * Gradient colore en arriere-plan, titre avec accent gradient,
 * sous-titre percutant, CTA barre de recherche, indicateurs.
 *
 * Composant serveur (Server Component) — pas de "use client".
 * ============================================================================= */

import Link from "next/link";
import { ArrowRight, Search, CheckCircle, Video, Zap } from "lucide-react";

/* -------------------------------------------------------------------------- */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Pr\u00e9sentation de la plateforme Dixipolis"
    >
      {/* Background gradient colore */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.12), transparent)," +
            "radial-gradient(ellipse 50% 40% at 80% 60%, rgba(99,102,241,0.08), transparent)," +
            "radial-gradient(ellipse 40% 30% at 20% 80%, rgba(236,72,153,0.05), transparent)," +
            "linear-gradient(180deg, #ffffff 0%, var(--color-bg-page) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Cercles decoratifs flous */}
      <div
        className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-primary)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-10 h-56 w-56 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--color-accent)" }}
        aria-hidden="true"
      />

      <div className="page-container relative py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-xs)] backdrop-blur-sm">
            <span
              className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--color-success)]"
              aria-hidden="true"
            />
            IA &bull; Fact-checking &bull; Open Data
          </div>

          {/* Titre h1 avec gradient */}
          <h1 className="animate-fade-in-up mb-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
            D&eacute;cryptez le discours{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              politique fran&ccedil;ais
            </span>
            {" "}avec l&apos;IA
          </h1>

          {/* Sous-titre */}
          <p className="animate-fade-in-up mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl" style={{ animationDelay: "100ms" }}>
            Fact-checking automatis&eacute;, d&eacute;tection de propagande, analyse &eacute;motionnelle.
            Chaque r&eacute;ponse est sourc&eacute;e avec un extrait vid&eacute;o horodat&eacute;.
          </p>

          {/* CTA barre de recherche */}
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Link
              href="/prompt"
              className="group mx-auto inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-6 py-4 text-base font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-md)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-[var(--shadow-glow)] sm:px-8 sm:text-lg"
            >
              <Search
                className="h-5 w-5 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-primary)]"
                aria-hidden="true"
              />
              <span>Posez votre question sur le discours politique...</span>
              <ArrowRight
                className="h-5 w-5 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Indicateurs de credibilite */}
          <div className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[var(--color-text-muted)]" style={{ animationDelay: "300ms" }}>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[var(--color-success)]" aria-hidden="true" />
              Fact-checks automatis&eacute;s
            </span>
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
              Extraits vid&eacute;o horodat&eacute;s
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--color-warning)]" aria-hidden="true" />
              Mise &agrave; jour quotidienne
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

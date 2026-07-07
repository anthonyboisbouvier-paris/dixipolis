/* =============================================================================
 * components/home/CTASection.tsx
 *
 * CTA final — personnalité forte, branding Dixipolis.
 * Gradient audacieux, texte percutant, lien vers la recherche.
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
export default function CTASection({ nSegments }: { nSegments: number | null }) {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{
        background:
          "linear-gradient(135deg, #2563eb 0%, #4f46e5 40%, #7c3aed 100%)",
      }}
      aria-label="Essayer Dixipolis gratuitement"
    >
      {/* Éléments décoratifs — dégradés radiaux statiques (sans filter) */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-96 w-96 rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="page-container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Acc&egrave;s gratuit &mdash; sans carte bancaire
          </div>

          {/* Titre */}
          <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {nSegments
              ? `${formatNumber(nSegments)} segments de discours vous attendent.`
              : "Le corpus du discours politique vous attend."}
            <br />
            Qu&apos;allez-vous chercher ?
          </h2>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/70">
            Journalistes, chercheurs, citoyens engag&eacute;s &mdash; Dixipolis
            donne &agrave; chacun le pouvoir de v&eacute;rifier ce que les
            politiques ont vraiment dit.
          </p>

          {/* Boutons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/prompt"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
              style={{ color: "#4f46e5" }}
            >
              Interroger la base
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/api-pro"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
            >
              D&eacute;couvrir l&apos;API
            </Link>
          </div>

          {/* Reassurance */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" aria-hidden="true" />
              Open data &amp; transparent
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" aria-hidden="true" />
              Sources v&eacute;rifiables
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" aria-hidden="true" />
              Mis &agrave; jour quotidiennement
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

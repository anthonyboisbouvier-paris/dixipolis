/* =============================================================================
 * components/home/HeroSection.tsx
 *
 * Hero section Dixipolis — messaging centré sur la BASE DE DONNÉES.
 * "Chaque mot prononcé par un politique français, transcrit et cherchable."
 *
 * Les compteurs affichent les statistiques RÉELLES du corpus (app_global_stats)
 * passées en prop depuis app/page.tsx. Si les stats sont indisponibles → "—".
 * Composant serveur (Server Component).
 * ============================================================================= */

import Link from "next/link";
import {
  ArrowRight,
  Search,
  Mic,
  Users,
  CalendarClock,
  Database,
  Play,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { GlobalStats } from "@/lib/supabase-server";

/* --------------------------------------------------------------------------
 * Helpers d'affichage
 * -------------------------------------------------------------------------- */
function fmtDayFr(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
export default function HeroSection({ stats }: { stats: GlobalStats | null }) {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Pr&eacute;sentation de la plateforme Dixipolis"
    >
      {/* Background — gradient audacieux multi-couches */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -15%, rgba(37,99,235,0.18), transparent)," +
            "radial-gradient(ellipse 50% 50% at 85% 50%, rgba(99,102,241,0.10), transparent)," +
            "radial-gradient(ellipse 40% 35% at 15% 75%, rgba(236,72,153,0.06), transparent)," +
            "linear-gradient(180deg, #ffffff 0%, var(--color-bg-page) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Formes décoratives — dégradés radiaux statiques (sans filter, perf mobile) */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="page-container relative py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge — identité forte */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-primary-200)] bg-white/80 px-5 py-2.5 text-sm font-semibold shadow-[var(--shadow-sm)] backdrop-blur-sm">
            <Database
              className="h-4 w-4 text-[var(--color-primary)]"
              aria-hidden="true"
            />
            <span style={{ color: "var(--color-primary)" }}>
              La base de donn&eacute;es du discours politique fran&ccedil;ais
            </span>
          </div>

          {/* Titre h1 — le message clé */}
          <h1 className="animate-fade-in-up mb-6 text-4xl font-extrabold leading-[1.06] tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-[3.75rem]">
            Chaque mot prononc&eacute; par un{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              politique fran&ccedil;ais
            </span>
            ,<br className="hidden sm:block" /> transcrit et cherchable.
          </h1>

          {/* Sous-titre — la promesse */}
          <p
            className="animate-fade-in-up mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl"
            style={{
              animationDelay: "100ms",
              color: "var(--color-text-secondary)",
            }}
          >
            Dixipolis indexe en continu toutes les prises de parole politiques
            &mdash; assembl&eacute;es, interviews, meetings, commissions.
            Chaque discours est transcrit mot &agrave; mot, attribu&eacute;
            &agrave; son auteur, et analys&eacute; par l&apos;IA.
          </p>

          {/* ────────────────────────────────────────────────────────────────
           * MINI PIPELINE — Schéma visuel du fonctionnement
           * ──────────────────────────────────────────────────────────────── */}
          <div
            className="animate-fade-in-up mx-auto mb-12 max-w-3xl"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/70 px-6 py-5 shadow-[var(--shadow-sm)] backdrop-blur-sm sm:flex-row sm:justify-center sm:gap-0">
              {/* Étape 1 */}
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                  }}
                >
                  <Play className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Vid&eacute;o d&eacute;tect&eacute;e
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                    YouTube, m&eacute;dias, assembl&eacute;es
                  </p>
                </div>
              </div>

              {/* Flèche */}
              <ArrowRight
                className="mx-4 hidden h-4 w-4 shrink-0 sm:block"
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <span className="text-xs font-bold sm:hidden" style={{ color: "var(--color-text-muted)" }}>
                &darr;
              </span>

              {/* Étape 2 */}
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                >
                  <Mic className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Transcription IA
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                    Mot &agrave; mot + horodatage
                  </p>
                </div>
              </div>

              {/* Flèche */}
              <ArrowRight
                className="mx-4 hidden h-4 w-4 shrink-0 sm:block"
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <span className="text-xs font-bold sm:hidden" style={{ color: "var(--color-text-muted)" }}>
                &darr;
              </span>

              {/* Étape 3 */}
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
                >
                  <Users className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Attribution
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                    Qui dit quoi, quand
                  </p>
                </div>
              </div>

              {/* Flèche */}
              <ArrowRight
                className="mx-4 hidden h-4 w-4 shrink-0 sm:block"
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <span className="text-xs font-bold sm:hidden" style={{ color: "var(--color-text-muted)" }}>
                &darr;
              </span>

              {/* Étape 4 */}
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    color: "#fff",
                  }}
                >
                  <Search className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Cherchable
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                    S&eacute;mantique + textuel
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA barre de recherche */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "250ms" }}
          >
            <Link
              href="/prompt"
              className="group mx-auto inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-6 py-4 text-base font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-md)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-[var(--shadow-glow)] sm:px-8 sm:text-lg"
            >
              <Search
                className="h-5 w-5 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-primary)]"
                aria-hidden="true"
              />
              <span>
                &laquo; Qu&apos;a dit Macron sur la r&eacute;forme des
                retraites ? &raquo;
              </span>
              <ArrowRight
                className="h-5 w-5 text-[var(--color-primary)] transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Compteurs chiffrés — statistiques réelles du corpus */}
          <div
            className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
            style={{ animationDelay: "350ms" }}
          >
            <div className="text-center">
              <p className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                {stats ? formatNumber(stats.n_segments) : "—"}
              </p>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                segments transcrits
              </p>
            </div>
            <div
              className="hidden h-10 w-px sm:block"
              style={{ backgroundColor: "var(--color-border)" }}
              aria-hidden="true"
            />
            <div className="text-center">
              <p className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                {stats ? formatNumber(stats.n_persons) : "—"}
              </p>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                politiciens r&eacute;f&eacute;renc&eacute;s
              </p>
            </div>
            <div
              className="hidden h-10 w-px sm:block"
              style={{ backgroundColor: "var(--color-border)" }}
              aria-hidden="true"
            />
            <div className="text-center">
              <p className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                {stats ? (
                  <>
                    {formatNumber(stats.total_hours)}
                    <span className="text-[var(--color-primary)]">h</span>
                  </>
                ) : (
                  "—"
                )}
              </p>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                de vid&eacute;o analys&eacute;es
              </p>
            </div>
            <div
              className="hidden h-10 w-px sm:block"
              style={{ backgroundColor: "var(--color-border)" }}
              aria-hidden="true"
            />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <CalendarClock
                  className="h-4 w-4 text-[var(--color-success)]"
                  aria-hidden="true"
                />
                <p className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                  {stats ? fmtDayFr(stats.last_day) : "—"}
                </p>
              </div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                corpus mis &agrave; jour
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

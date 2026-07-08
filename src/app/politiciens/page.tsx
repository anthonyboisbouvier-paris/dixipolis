/* =============================================================================
 * app/politiciens/page.tsx
 *
 * Annuaire des personnalités politiques du corpus Dixipolis.
 *
 * Composant serveur (Server Component, force-dynamic). Les données viennent
 * de deux appels RPC Supabase côté serveur :
 *   - app_list_persons(p_query, p_limit) : liste triée par activité
 *   - app_global_stats() : compteur réel de personnalités référencées
 *
 * Recherche via un simple formulaire GET (?q=), sans JS client.
 * Chaque carte pointe vers la fiche /politicien/<slugify(name)>.
 * ============================================================================= */

import type { Metadata } from "next";
import Link from "next/link";
import { Film, Mic2, Search, SearchX, Users } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { rpc } from "@/lib/supabase-server";
import type { GlobalStats } from "@/lib/supabase-server";
import { formatDuration, formatNumber, slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Politiciens | Dixipolis",
  description:
    "Annuaire des personnalités politiques françaises référencées dans le corpus Dixipolis : temps de parole réel, vidéos et fiches détaillées.",
};

/* --------------------------------------------------------------------------
 * Types du contrat RPC app_list_persons
 * -------------------------------------------------------------------------- */
interface PersonListItem {
  person_id: number;
  name: string;
  party: string | null;
  position: string | null;
  avatar: string | null;
  speak_sec: number;
  n_videos: number;
}

/* -------------------------------------------------------------------------- */
export default async function PoliticiensPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().slice(0, 100);

  /* Données réelles — deux RPC en parallèle */
  const [persons, stats] = await Promise.all([
    rpc<PersonListItem[]>("app_list_persons", {
      p_query: query || null,
      p_limit: 24,
    }),
    rpc<GlobalStats>("app_global_stats"),
  ]);

  return (
    <PageWrapper className="py-8">
      {/* ── En-tête avec compteur réel ──────────────────────────────────── */}
      <section className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
          <Users className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
          {stats ? `${formatNumber(stats.n_persons)} personnalités référencées` : "Annuaire du corpus"}
        </div>
        <h1 className="mb-2 text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Politiciens
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          Les personnalités politiques identifiées dans le corpus, classées par
          temps de parole réel. Cliquez sur une carte pour ouvrir la fiche
          détaillée.
        </p>
      </section>

      {/* ── Barre de recherche (formulaire GET, sans JS) ────────────────── */}
      <form action="/politiciens" method="get" className="mb-8" role="search">
        <div className="flex max-w-xl items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5 shadow-sm transition-shadow focus-within:border-[var(--color-primary)] focus-within:shadow-md">
          <Search className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder="Rechercher une personnalité (nom, parti…)"
            className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
            aria-label="Rechercher une personnalité"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Rechercher
          </button>
        </div>
      </form>

      {/* ── Grille de cartes / états vides ──────────────────────────────── */}
      {!persons || persons.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center shadow-sm">
          <SearchX className="mx-auto mb-3 h-8 w-8 text-[var(--color-text-muted)]" aria-hidden="true" />
          <h2 className="mb-1 text-base font-semibold text-[var(--color-text-primary)]">
            {persons === null ? "Données indisponibles" : "Aucune personnalité trouvée"}
          </h2>
          <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
            {persons === null
              ? "Impossible de joindre la base. Réessayez dans un instant."
              : query
                ? `Aucun résultat pour « ${query} ». Essayez un autre nom ou un parti.`
                : "L'annuaire est vide pour le moment."}
          </p>
          {query && (
            <Link
              href="/politiciens"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Voir tout l&apos;annuaire
            </Link>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {persons.map((p) => (
            <li key={p.person_id}>
              <Link
                href={`/politicien/${slugify(p.name)}`}
                className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {p.avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.avatar}
                      alt=""
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-lg font-bold text-[var(--color-primary)]">
                      {p.name.slice(0, 1)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                      {p.name}
                    </p>
                    {p.party && (
                      <span className="mt-0.5 inline-flex max-w-full truncate rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-primary)]">
                        {p.party}
                      </span>
                    )}
                  </div>
                </div>
                {p.position && (
                  <p className="line-clamp-2 text-xs leading-snug text-[var(--color-text-secondary)]">
                    {p.position}
                  </p>
                )}
                <div className="mt-auto border-t border-[var(--color-border-light)] pt-2.5">
                  {p.speak_sec > 0 || p.n_videos > 0 ? (
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                      <span className="inline-flex items-center gap-1.5">
                        <Mic2 className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                        {formatDuration(p.speak_sec)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Film className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                        {p.n_videos} vid&eacute;o{p.n_videos > 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs italic text-[var(--color-text-muted)]">
                      Pas encore au corpus
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageWrapper>
  );
}

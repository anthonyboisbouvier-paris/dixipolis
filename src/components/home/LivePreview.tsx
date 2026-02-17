/* =============================================================================
 * components/home/LivePreview.tsx
 *
 * Section "Aperçu en direct" — montre un extrait réel de la base.
 * Simule un résultat de recherche pour rendre le produit tangible.
 * Composant serveur (Server Component).
 * ============================================================================= */

import { Play, Clock, User, Tag, ExternalLink, Search } from "lucide-react";

/* -------------------------------------------------------------------------- */
interface PreviewResult {
  query: string;
  politician: string;
  party: string;
  partyColor: string;
  date: string;
  context: string;
  quote: string;
  videoTitle: string;
  timecode: string;
  theme: string;
  relevanceScore: number;
}

const PREVIEW_RESULTS: PreviewResult[] = [
  {
    query: "Qu\u2019a dit Macron sur la r\u00e9industrialisation ?",
    politician: "Emmanuel Macron",
    party: "RE",
    partyColor: "#ca8a04",
    date: "15 janvier 2025",
    context: "Visite d\u2019usine, Douai (Nord)",
    quote: "Nous devons r\u00e9industrialiser la France. C\u2019est un combat de long terme qui n\u00e9cessite des investissements massifs dans la formation, l\u2019innovation et les infrastructures.",
    videoTitle: "D\u00e9placement pr\u00e9sidentiel \u2014 r\u00e9industrialisation du Nord",
    timecode: "14:23",
    theme: "\u00c9conomie",
    relevanceScore: 0.94,
  },
  {
    query: "Qu\u2019a dit Macron sur la r\u00e9industrialisation ?",
    politician: "Emmanuel Macron",
    party: "RE",
    partyColor: "#ca8a04",
    date: "9 janvier 2025",
    context: "Conseil europ\u00e9en, Bruxelles",
    quote: "L\u2019Europe doit \u00eatre un continent de production, pas seulement de consommation. La r\u00e9industrialisation est un enjeu de souverainet\u00e9.",
    videoTitle: "Conf\u00e9rence de presse \u2014 Conseil europ\u00e9en",
    timecode: "42:07",
    theme: "Europe",
    relevanceScore: 0.89,
  },
];

/* -------------------------------------------------------------------------- */
export default function LivePreview() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: "var(--color-bg-page)" }}
      aria-label="Apercu en direct de la base Dixipolis"
    >
      <div className="page-container">
        {/* En-tête */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--color-text-primary)" }}>
            Voyez par vous-m&ecirc;me
          </h2>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Voici ce que retourne Dixipolis quand vous posez une question.
            Chaque r&eacute;sultat est sourc&eacute; avec vid&eacute;o et timecode.
          </p>
        </div>

        {/* Simulation de résultat */}
        <div className="mx-auto max-w-3xl">
          {/* Barre de recherche simulée */}
          <div
            className="mb-6 flex items-center gap-3 rounded-2xl border-2 px-5 py-4"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-bg-card)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Search className="h-5 w-5 shrink-0" style={{ color: "var(--color-primary)" }} />
            <p className="text-base font-medium" style={{ color: "var(--color-text-primary)" }}>
              {PREVIEW_RESULTS[0].query}
            </p>
          </div>

          {/* Indicateur de résultats */}
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
              2 r&eacute;sultats trouv&eacute;s
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              &middot; 0.3s
            </span>
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            {PREVIEW_RESULTS.map((result, i) => (
              <div
                key={i}
                className="card overflow-hidden p-5 transition-all duration-300 hover:shadow-lg"
              >
                {/* Header du résultat */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} />
                    <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {result.politician}
                    </span>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ backgroundColor: result.partyColor + "20", color: result.partyColor }}
                  >
                    {result.party}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <Clock className="h-3 w-3" />
                    {result.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <Tag className="h-3 w-3" />
                    {result.theme}
                  </span>
                  {/* Score */}
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: result.relevanceScore > 0.9 ? "var(--color-success-light)" : "var(--color-info-light)",
                      color: result.relevanceScore > 0.9 ? "var(--color-success)" : "var(--color-info)",
                    }}
                  >
                    {(result.relevanceScore * 100).toFixed(0)}% pertinent
                  </span>
                </div>

                {/* Citation */}
                <div
                  className="mb-3 rounded-lg border-l-4 py-2 pl-4"
                  style={{
                    borderColor: "var(--color-primary)",
                    backgroundColor: "var(--color-primary-light)",
                  }}
                >
                  <p className="text-sm italic leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                    &laquo;&nbsp;{result.quote}&nbsp;&raquo;
                  </p>
                </div>

                {/* Source vidéo */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-md"
                    style={{ backgroundColor: "var(--color-error-light)", color: "var(--color-error)" }}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                      {result.videoTitle}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                      {result.context} &middot; {result.timecode}
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

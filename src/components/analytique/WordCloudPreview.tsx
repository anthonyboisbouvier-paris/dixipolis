/* =============================================================================
 * components/analytique/WordCloudPreview.tsx
 *
 * Apercu visuel des mots sur-representes par politicien (DIX-15).
 * Affiche un "word cloud" simplifie avec des badges de taille variable
 * proportionnelle au score de sur-representation.
 *
 * Composant serveur (Server Component) — mock data.
 * ============================================================================= */

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
interface WordItem {
  word: string;
  score: number;
  politician: string;
}

/* --------------------------------------------------------------------------
 * Mock data : mots les plus sur-representes pour les principaux politiciens.
 * -------------------------------------------------------------------------- */
const WORDS: WordItem[] = [
  { word: "souverainet\u00e9", score: 4.2, politician: "Marine Le Pen" },
  { word: "r\u00e9publique", score: 3.8, politician: "Emmanuel Macron" },
  { word: "immigration", score: 3.5, politician: "Jordan Bardella" },
  { word: "travailleurs", score: 3.3, politician: "Jean-Luc M\u00e9lenchon" },
  { word: "entreprise", score: 3.1, politician: "Gabriel Attal" },
  { word: "transition", score: 2.9, politician: "Marine Tondelier" },
  { word: "\u00e9cologie", score: 2.8, politician: "Marine Tondelier" },
  { word: "s\u00e9curit\u00e9", score: 2.7, politician: "Marine Le Pen" },
  { word: "pouvoir d\u2019achat", score: 2.6, politician: "Jean-Luc M\u00e9lenchon" },
  { word: "num\u00e9rique", score: 2.4, politician: "Gabriel Attal" },
  { word: "fronti\u00e8res", score: 2.3, politician: "Jordan Bardella" },
  { word: "justice", score: 2.2, politician: "Jean-Luc M\u00e9lenchon" },
  { word: "innovation", score: 2.1, politician: "Emmanuel Macron" },
  { word: "famille", score: 2.0, politician: "Marine Le Pen" },
  { word: "dette", score: 1.9, politician: "Gabriel Attal" },
  { word: "climat", score: 1.8, politician: "Marine Tondelier" },
];

/* Couleurs par politicien */
const POLITICIAN_COLORS: Record<string, { bg: string; text: string }> = {
  "Emmanuel Macron": { bg: "rgba(37,99,235,0.12)", text: "#2563eb" },
  "Marine Le Pen": { bg: "rgba(13,43,85,0.12)", text: "#1e40af" },
  "Jordan Bardella": { bg: "rgba(13,43,85,0.1)", text: "#1e3a5f" },
  "Jean-Luc M\u00e9lenchon": { bg: "rgba(204,0,0,0.1)", text: "#dc2626" },
  "Gabriel Attal": { bg: "rgba(255,215,0,0.12)", text: "#ca8a04" },
  "Marine Tondelier": { bg: "rgba(0,168,107,0.12)", text: "#059669" },
};

/* -------------------------------------------------------------------------- */
function getSize(score: number): string {
  if (score > 3.5) return "text-lg px-4 py-2";
  if (score > 2.5) return "text-sm px-3 py-1.5";
  return "text-xs px-2.5 py-1";
}

/* -------------------------------------------------------------------------- */
export default function WordCloudPreview() {
  return (
    <section className="card p-6" aria-label="Mots sur-repr\u00e9sent\u00e9s">
      <div className="mb-5">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Mots sur-repr&eacute;sent&eacute;s
        </h2>
        <p
          className="mt-0.5 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Termes les plus distinctifs de chaque politicien (score = fr&eacute;quence relative)
        </p>
      </div>

      {/* Nuage de mots */}
      <div className="flex flex-wrap items-center gap-2">
        {WORDS.map((item) => {
          const colors = POLITICIAN_COLORS[item.politician] ?? {
            bg: "rgba(100,100,100,0.1)",
            text: "#64748b",
          };

          return (
            <span
              key={item.word}
              className={cn(
                "inline-flex items-center gap-1 rounded-full font-semibold transition-transform duration-200 hover:scale-105",
                getSize(item.score)
              )}
              style={{ backgroundColor: colors.bg, color: colors.text }}
              title={`${item.politician} — score ${item.score.toFixed(1)}x`}
            >
              {item.word}
              <span className="opacity-50" style={{ fontSize: "0.7em" }}>
                {item.score.toFixed(1)}x
              </span>
            </span>
          );
        })}
      </div>

      {/* L&eacute;gende politiciens */}
      <div className="mt-5 flex flex-wrap gap-3 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
        {Object.entries(POLITICIAN_COLORS).map(([name, colors]) => (
          <span
            key={name}
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colors.text }}
            />
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

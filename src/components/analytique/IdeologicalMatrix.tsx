/* =============================================================================
 * components/analytique/IdeologicalMatrix.tsx
 *
 * Matrice visuelle de distance ideologique entre partis (DIX-31).
 * Affiche une grille coloree montrant la proximite/distance entre partis
 * basee sur la distance semantique des embeddings des discours.
 *
 * Composant serveur (Server Component) — mock data.
 * ============================================================================= */

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
const PARTIES = ["RE", "RN", "LFI", "LR", "PS", "EELV"];

const PARTY_LABELS: Record<string, string> = {
  RE: "Renaissance",
  RN: "Rass. National",
  LFI: "France Insoumise",
  LR: "R\u00e9publicains",
  PS: "Parti Socialiste",
  EELV: "\u00c9cologistes",
};

/* Matrice de distance mock (0 = identique, 1 = oppose) */
const DISTANCES: number[][] = [
  [0.0, 0.72, 0.68, 0.31, 0.42, 0.55],
  [0.72, 0.0, 0.89, 0.54, 0.78, 0.82],
  [0.68, 0.89, 0.0, 0.71, 0.34, 0.29],
  [0.31, 0.54, 0.71, 0.0, 0.48, 0.61],
  [0.42, 0.78, 0.34, 0.48, 0.0, 0.25],
  [0.55, 0.82, 0.29, 0.61, 0.25, 0.0],
];

/* -------------------------------------------------------------------------- */
function getColor(distance: number): string {
  if (distance === 0) return "var(--color-primary)";
  if (distance < 0.3) return "#10b981";
  if (distance < 0.5) return "#84cc16";
  if (distance < 0.7) return "#f59e0b";
  return "#ef4444";
}

function getOpacity(distance: number): number {
  if (distance === 0) return 0.3;
  return 0.15 + distance * 0.65;
}

/* -------------------------------------------------------------------------- */
export default function IdeologicalMatrix() {
  return (
    <section className="card p-6" aria-label="Matrice de distance id\u00e9ologique">
      <div className="mb-5">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Distance id&eacute;ologique
        </h2>
        <p
          className="mt-0.5 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Proximit&eacute; s&eacute;mantique entre partis (0 = proches, 1 = oppos&eacute;s)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2" />
              {PARTIES.map((party) => (
                <th
                  key={party}
                  className="p-2 text-center font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                  title={PARTY_LABELS[party]}
                >
                  {party}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PARTIES.map((rowParty, rowIndex) => (
              <tr key={rowParty}>
                <td
                  className="p-2 text-right font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                  title={PARTY_LABELS[rowParty]}
                >
                  {rowParty}
                </td>
                {PARTIES.map((colParty, colIndex) => {
                  const distance = DISTANCES[rowIndex][colIndex];
                  const isIdentity = rowIndex === colIndex;
                  return (
                    <td
                      key={colParty}
                      className={cn(
                        "p-1 text-center",
                        isIdentity && "font-bold"
                      )}
                    >
                      <div
                        className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold transition-transform duration-200 hover:scale-110"
                        style={{
                          backgroundColor: getColor(distance),
                          opacity: getOpacity(distance),
                          color: "#fff",
                        }}
                        title={`${PARTY_LABELS[rowParty]} \u2194 ${PARTY_LABELS[colParty]} : ${distance.toFixed(2)}`}
                      >
                        {isIdentity ? "\u2014" : distance.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legende */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: "#10b981" }} />
          Proches (&lt; 0.3)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: "#84cc16" }} />
          Mod&eacute;r&eacute; (0.3–0.5)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: "#f59e0b" }} />
          Distant (0.5–0.7)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: "#ef4444" }} />
          Oppos&eacute;s (&gt; 0.7)
        </span>
      </div>
    </section>
  );
}

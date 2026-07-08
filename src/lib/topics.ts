/* =============================================================================
 * lib/topics.ts
 *
 * Libellés français des thèmes (codes Manifesto/CAP) — module partagé.
 * Copie de la map utilisée par la page « Du jour », centralisée ici pour
 * être réutilisée par la page Analytique (et toute future page thématique).
 * ============================================================================= */

export const TOPIC_LABELS_FR: Record<string, string> = {
  "104": "Défense (pro)",
  "105": "Défense (critique)",
  "107": "International",
  "108": "Union européenne (pro)",
  "110": "Union européenne (critique)",
  "202": "Démocratie",
  "304": "Corruption politique",
  "305": "Autorité politique",
  "403": "Régulation des marchés",
  "411": "Technologies & infrastructures",
  "502": "Culture",
  "504": "Protection sociale",
  "605": "Ordre public & justice",
  "701": "Travail & syndicats",
  "703": "Agriculture",
};

export function topicLabel(raw: string): string {
  const code = raw.match(/^(\d{3})/)?.[1];
  if (code && TOPIC_LABELS_FR[code]) return TOPIC_LABELS_FR[code];
  return raw.replace(/^\d{3}\s*-\s*/, "");
}

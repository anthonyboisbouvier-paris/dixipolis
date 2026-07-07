/* =============================================================================
 * app/api/escapade/route.ts
 *
 * Route handler POST de l'application Escapade (compagnon de voyage).
 *
 * Trois actions dans le corps JSON :
 *   - "generate" : génère des cartes d'activités réelles autour d'une position
 *     (lat/lng) ou d'un lieu nommé (place), en respectant filtres et exclusions.
 *   - "plan"     : construit un planning jour par jour à partir des activités
 *     retenues (regroupement géographique, best_time, temps de trajet, rythme).
 *   - "detail"   : fiche pratique détaillée d'une activité (pourquoi y aller,
 *     adresse, horaires, prix, réservation, conseils, durée idéale).
 *
 * La clé OPENAI_API_KEY reste strictement côté serveur. Si elle est absente,
 * la route répond 200 { error: "no_key" } pour que le client affiche un écran
 * d'information (l'app reste testable sans clé). Timeouts 30 s, jamais de clé
 * exposée au client.
 * ============================================================================= */

import { NextResponse } from "next/server";
import { llmAvailable, openaiCall } from "@/lib/openai-server";

export const dynamic = "force-dynamic";
// Les appels LLM peuvent dépasser les 10 s par défaut de Vercel
export const maxDuration = 60;

/* --------------------------------------------------------------------------
 * Constantes
 * -------------------------------------------------------------------------- */
const MODEL = "gpt-4o-mini";
const TIMEOUT_MS = 30_000;

const CATEGORIES = [
  "culture",
  "nature",
  "gastronomie",
  "vie-nocturne",
  "sport",
  "shopping",
  "famille",
  "insolite",
  "detente",
  "panorama",
] as const;

/* --------------------------------------------------------------------------
 * Types des corps de requête
 * -------------------------------------------------------------------------- */
interface GenerateBody {
  action: "generate";
  lat?: unknown;
  lng?: unknown;
  place?: unknown;
  filters?: {
    categories?: unknown;
    budget_max_eur?: unknown;
    note?: unknown;
  };
  exclude?: unknown;
  count?: unknown;
}

interface PlanActivity {
  title: string;
  category: string;
  est_duration_min: number;
  est_cost_eur: number;
  distance_km: number;
  best_time: string;
  lat: number;
  lng: number;
  emoji: string;
}

interface PlanBody {
  action: "plan";
  place?: unknown;
  days?: unknown;
  pace?: unknown;
  activities?: unknown;
  custom_notes?: unknown;
}

interface DetailBody {
  action: "detail";
  title?: unknown;
  place?: unknown;
  category?: unknown;
}

/* --------------------------------------------------------------------------
 * Appel OpenAI générique — réponse JSON stricte, timeout 30 s.
 * Retourne l'objet JSON parsé ou null en cas d'échec.
 * -------------------------------------------------------------------------- */
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<Record<string, unknown> | null> {
  try {
    const res = await openaiCall(
      "chat",
      {
        model: MODEL,
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      },
      TIMEOUT_MS
    );
    if (!res.ok) {
      console.error(`[escapade] OpenAI → HTTP ${res.status}`);
      return null;
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content) as Record<string, unknown>;
  } catch (err) {
    console.error("[escapade] OpenAI → erreur", err);
    return null;
  }
}

/* --------------------------------------------------------------------------
 * Action "generate" — cartes d'activités autour d'une position
 * -------------------------------------------------------------------------- */
async function handleGenerate(body: GenerateBody) {
  const lat = typeof body.lat === "number" && Number.isFinite(body.lat) ? body.lat : 0;
  const lng = typeof body.lng === "number" && Number.isFinite(body.lng) ? body.lng : 0;
  const place =
    typeof body.place === "string" ? body.place.trim().slice(0, 120) : "";

  if (!place && lat === 0 && lng === 0) {
    return NextResponse.json(
      { error: "Position (lat/lng) ou lieu (place) requis." },
      { status: 400 }
    );
  }

  const rawCount = typeof body.count === "number" ? body.count : 8;
  const count = Math.min(Math.max(Math.floor(rawCount), 1), 12);

  /* Filtres optionnels */
  const filters = body.filters ?? {};
  const categories = Array.isArray(filters.categories)
    ? filters.categories
        .filter((c): c is string => typeof c === "string")
        .filter((c) => (CATEGORIES as readonly string[]).includes(c))
    : [];
  const budgetMax =
    typeof filters.budget_max_eur === "number" && filters.budget_max_eur >= 0
      ? filters.budget_max_eur
      : null;
  const note =
    typeof filters.note === "string" ? filters.note.trim().slice(0, 300) : "";

  const exclude = Array.isArray(body.exclude)
    ? body.exclude
        .filter((t): t is string => typeof t === "string")
        .slice(0, 100)
    : [];

  const systemPrompt =
    "Tu es un expert local. Génère des activités RÉELLES et vérifiables autour " +
    "de la position donnée (ville/quartier le plus proche). Réponds UNIQUEMENT " +
    'en JSON: {"place_name":"...","activities":[...]}. Chaque activité est un objet ' +
    "{title, category, description, est_cost_eur, est_duration_min, distance_km, " +
    "rating, popularity, best_time, lat, lng, wikipedia_title, emoji} où : " +
    `category est EXACTEMENT l'une de : ${CATEGORIES.map((c) => `"${c}"`).join(", ")} ; ` +
    "description fait 2-3 phrases concrètes en français ; " +
    "est_cost_eur est un nombre en euros (0 si gratuit) ; " +
    "est_duration_min est la durée estimée en minutes ; " +
    "distance_km est la distance estimée depuis la position donnée ; " +
    "rating est une note plausible entre 0 et 5 ; " +
    'popularity est "incontournable", "apprécié" ou "pépite locale" ; ' +
    'best_time est "matin", "après-midi" ou "soir" ; ' +
    "lat et lng sont les coordonnées approximatives du lieu ; " +
    "wikipedia_title est le titre probable de la page Wikipédia FRANÇAISE du lieu, ou null ; " +
    "emoji est 1 seul emoji représentatif.";

  const userLines: string[] = [];
  if (place) {
    userLines.push(`Lieu de référence : ${place}`);
    if (lat !== 0 || lng !== 0) userLines.push(`Coordonnées : lat=${lat}, lng=${lng}`);
  } else {
    userLines.push(`Position GPS : lat=${lat}, lng=${lng}`);
  }
  userLines.push(`Génère exactement ${count} activités variées.`);
  if (categories.length > 0) {
    userLines.push(`Catégories autorisées UNIQUEMENT : ${categories.join(", ")}.`);
  }
  if (budgetMax !== null) {
    userLines.push(`Budget maximum par activité : ${budgetMax} € (est_cost_eur ≤ ${budgetMax}).`);
  }
  if (note) userLines.push(`Précisions du voyageur : ${note}`);
  if (exclude.length > 0) {
    userLines.push(
      `N'inclus AUCUNE de ces activités déjà vues : ${exclude.join(" | ")}.`
    );
  }

  const result = await callOpenAI(systemPrompt, userLines.join("\n"));
  if (!result || !Array.isArray(result.activities)) {
    return NextResponse.json(
      { error: "Génération impossible pour le moment. Réessayez." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    place_name:
      typeof result.place_name === "string" ? result.place_name : place || "Votre position",
    activities: result.activities,
  });
}

/* --------------------------------------------------------------------------
 * Action "plan" — planning jour par jour à partir des activités retenues
 * -------------------------------------------------------------------------- */
async function handlePlan(body: PlanBody) {
  const place =
    typeof body.place === "string" ? body.place.trim().slice(0, 120) : "";
  const rawDays = typeof body.days === "number" ? body.days : 1;
  const days = Math.min(Math.max(Math.floor(rawDays), 1), 14);
  const pace =
    body.pace === "calme" || body.pace === "intense" ? body.pace : "equilibre";
  const customNotes =
    typeof body.custom_notes === "string"
      ? body.custom_notes.trim().slice(0, 300)
      : "";

  const activities: PlanActivity[] = Array.isArray(body.activities)
    ? (body.activities as PlanActivity[]).slice(0, 60)
    : [];
  if (activities.length === 0) {
    return NextResponse.json(
      { error: "Aucune activité fournie pour le planning." },
      { status: 400 }
    );
  }

  const paceLabel =
    pace === "calme"
      ? "calme (environ 2-3 activités par jour)"
      : pace === "intense"
        ? "intense (environ 5-6 activités par jour)"
        : "équilibré (environ 3-4 activités par jour)";

  const systemPrompt =
    "Tu es un organisateur de voyage expert. Construis un planning de séjour " +
    "jour par jour RÉALISTE à partir des activités fournies : regroupe les lieux " +
    "géographiquement proches sur une même journée, respecte le moment idéal " +
    "(best_time : matin/après-midi/soir), insère des temps de trajet estimés " +
    "entre les lieux (à pied si moins de 2 km, sinon transport en commun ou taxi), " +
    "prévois des pauses déjeuner (vers 12h30) et dîner (vers 19h30), et respecte " +
    "le rythme demandé. Si trop d'activités pour le nombre de jours, priorise les " +
    "mieux notées et signale-le dans tips. Réponds UNIQUEMENT en JSON : " +
    '{"days":[{"label":"Jour 1","items":[{"time":"09:30","title":"...","emoji":"...",' +
    '"duration_min":60,"note":"une phrase","travel_after_min":15,"travel_mode":"à pied"}]}],' +
    '"tips":["..."]}. Le dernier item de chaque journée a travel_after_min:0. ' +
    "Tout le texte est en français.";

  const userLines = [
    `Destination : ${place || "non précisée"}`,
    `Nombre de jours : ${days}`,
    `Rythme : ${paceLabel}`,
    customNotes ? `Précisions du voyageur : ${customNotes}` : "",
    "Activités retenues (JSON) :",
    JSON.stringify(activities),
  ].filter(Boolean);

  const result = await callOpenAI(systemPrompt, userLines.join("\n"));
  if (!result || !Array.isArray(result.days)) {
    return NextResponse.json(
      { error: "Planning impossible pour le moment. Réessayez." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    days: result.days,
    tips: Array.isArray(result.tips) ? result.tips : [],
  });
}

/* --------------------------------------------------------------------------
 * Action "detail" — fiche pratique détaillée d'une activité
 * -------------------------------------------------------------------------- */

/** Coupe proprement une chaîne renvoyée par le LLM (ou null si invalide). */
function cleanStr(v: unknown, max = 120): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

async function handleDetail(body: DetailBody) {
  const title = cleanStr(body.title, 120);
  const place = cleanStr(body.place, 120) ?? "";
  const category = cleanStr(body.category, 40) ?? "";

  if (!title) {
    return NextResponse.json(
      { error: "Titre d'activité requis." },
      { status: 400 }
    );
  }

  const systemPrompt =
    "Tu es un expert local qui connaît parfaitement les lieux touristiques et " +
    "leurs aspects pratiques. Donne une fiche pratique CONCRÈTE et RÉALISTE " +
    "pour l'activité demandée. Réponds UNIQUEMENT en JSON : " +
    '{"why_go":"2-3 phrases donnant envie et expliquant l\'intérêt réel du lieu",' +
    '"address_hint":"adresse ou repère de localisation court",' +
    '"hours_hint":"horaires habituels courts (ex: tlj 9h-18h, fermé lundi)",' +
    '"price_hint":"fourchette de prix courte (ex: 12 €, gratuit -18 ans)",' +
    '"booking_hint":"faut-il réserver, et comment, en une phrase courte",' +
    '"tips":["3 conseils pratiques courts d\'initié"],' +
    '"ideal_duration_min":90}. ' +
    "Chaque champ hormis why_go fait moins de 120 caractères. tips contient " +
    "exactement 3 chaînes. ideal_duration_min est un nombre de minutes " +
    "réaliste entre 15 et 480. Tout est en français. Si tu n'es pas sûr d'une " +
    "information, donne une indication prudente plutôt qu'une invention précise.";

  const userLines = [
    `Activité : ${title}`,
    place ? `Destination / ville : ${place}` : "",
    category ? `Catégorie : ${category}` : "",
  ].filter(Boolean);

  const result = await callOpenAI(systemPrompt, userLines.join("\n"));
  if (!result) {
    return NextResponse.json(
      { error: "Fiche indisponible pour le moment. Réessayez." },
      { status: 502 }
    );
  }

  const tips = Array.isArray(result.tips)
    ? result.tips
        .map((t) => cleanStr(t, 120))
        .filter((t): t is string => t !== null)
        .slice(0, 3)
    : [];
  const rawDur = result.ideal_duration_min;
  const idealDuration =
    typeof rawDur === "number" && Number.isFinite(rawDur)
      ? Math.min(Math.max(Math.round(rawDur), 15), 480)
      : null;

  return NextResponse.json({
    title,
    why_go: cleanStr(result.why_go, 360),
    address_hint: cleanStr(result.address_hint, 120),
    hours_hint: cleanStr(result.hours_hint, 120),
    price_hint: cleanStr(result.price_hint, 120),
    booking_hint: cleanStr(result.booking_hint, 120),
    tips,
    ideal_duration_min: idealDuration,
  });
}

/* --------------------------------------------------------------------------
 * POST /api/escapade
 * -------------------------------------------------------------------------- */
export async function POST(request: Request) {
  let body: GenerateBody | PlanBody | DetailBody;
  try {
    body = (await request.json()) as GenerateBody | PlanBody | DetailBody;
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  /* Clé absente → 200 { error: "no_key" } : le client affiche l'écran d'info */
  const hasLlm = llmAvailable();
  if (!hasLlm) {
    return NextResponse.json({ error: "no_key" });
  }

  try {
    if (body.action === "generate") {
      return await handleGenerate(body);
    }
    if (body.action === "plan") {
      return await handlePlan(body);
    }
    if (body.action === "detail") {
      return await handleDetail(body);
    }
    return NextResponse.json(
      { error: 'Action inconnue (attendu : "generate", "plan" ou "detail").' },
      { status: 400 }
    );
  } catch (err) {
    console.error("[escapade] erreur inattendue", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

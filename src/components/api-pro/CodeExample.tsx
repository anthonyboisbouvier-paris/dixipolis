/* =============================================================================
 * components/api-pro/CodeExample.tsx
 *
 * Composant interactif affichant un exemple de requete/reponse API.
 *
 * Fonctionnalites :
 *   - Selecteur d'onglets pour basculer entre les langages : cURL, Python, JavaScript
 *   - Bloc de code avec fond sombre (#1e293b), police monospace et coloration syntaxique
 *   - Bouton de copie dans le coin superieur droit avec feedback visuel
 *   - Exemple concret : GET /api/v1/search?q=macron+inflation&limit=5
 *   - Reponse JSON mock affichee sous le bloc de requete
 *
 * Composant client ("use client") car il gere :
 *   - L'etat de l'onglet actif (useState)
 *   - L'action de copie dans le presse-papiers (navigator.clipboard)
 *   - Le feedback visuel temporaire apres copie (setTimeout)
 *
 * Design :
 *   - Fond sombre pour le bloc de code (contraste eleve, lisibilite)
 *   - Coloration syntaxique realisee avec des <span> et styles inline
 *   - Coins arrondis, ombre legere, bordure subtile
 *   - Responsive : defilement horizontal sur les petits ecrans
 * ============================================================================= */

"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Types — Onglets de langage disponibles
 * Chaque onglet correspond a un exemple de code dans un langage different.
 * -------------------------------------------------------------------------- */
type CodeTab = "curl" | "python" | "javascript";

/* --------------------------------------------------------------------------
 * Donnees — Exemples de code par langage
 *
 * Chaque entree contient :
 *   - label : nom affiche dans l'onglet
 *   - code  : texte brut du code (pour la copie dans le presse-papiers)
 *   - jsx   : rendu JSX avec coloration syntaxique via des <span> inline
 *
 * La coloration utilise les conventions classiques :
 *   - Vert (#86efac)  : commentaires
 *   - Jaune (#fde68a) : chaines de caracteres / URLs
 *   - Bleu (#93c5fd)  : mots-cles du langage (curl, import, const, etc.)
 *   - Violet (#c4b5fd) : noms de fonctions / methodes
 *   - Orange (#fdba74) : parametres / options
 *   - Blanc (#e2e8f0)  : texte standard
 * -------------------------------------------------------------------------- */
const codeExamples: Record<CodeTab, { label: string; code: string; jsx: React.ReactNode }> = {
  curl: {
    label: "cURL",
    code: `curl -X GET "https://api.dixipolis.fr/v1/search?q=macron+inflation&limit=5" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    jsx: (
      <>
        {/* Commentaire descriptif */}
        <span style={{ color: "#86efac" }}>
          # Recherche semantique dans les discours politiques
        </span>
        {"\n"}
        {/* Commande curl */}
        <span style={{ color: "#93c5fd" }}>curl</span>
        {" "}
        <span style={{ color: "#fdba74" }}>-X GET</span>
        {" "}
        <span style={{ color: "#fde68a" }}>
          &quot;https://api.dixipolis.fr/v1/search?q=macron+inflation&amp;limit=5&quot;
        </span>
        {" \\\n  "}
        <span style={{ color: "#fdba74" }}>-H</span>
        {" "}
        <span style={{ color: "#fde68a" }}>
          &quot;Authorization: Bearer YOUR_API_KEY&quot;
        </span>
        {" \\\n  "}
        <span style={{ color: "#fdba74" }}>-H</span>
        {" "}
        <span style={{ color: "#fde68a" }}>
          &quot;Content-Type: application/json&quot;
        </span>
      </>
    ),
  },

  python: {
    label: "Python",
    code: `import requests

response = requests.get(
    "https://api.dixipolis.fr/v1/search",
    params={"q": "macron inflation", "limit": 5},
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
data = response.json()
print(data)`,
    jsx: (
      <>
        {/* Commentaire descriptif */}
        <span style={{ color: "#86efac" }}>
          # Recherche semantique avec le SDK Python
        </span>
        {"\n"}
        {/* Import */}
        <span style={{ color: "#93c5fd" }}>import</span>
        {" "}
        <span style={{ color: "#e2e8f0" }}>requests</span>
        {"\n\n"}
        {/* Appel API */}
        <span style={{ color: "#e2e8f0" }}>response</span>
        {" = "}
        <span style={{ color: "#e2e8f0" }}>requests</span>
        <span style={{ color: "#e2e8f0" }}>.</span>
        <span style={{ color: "#c4b5fd" }}>get</span>
        {"(\n    "}
        <span style={{ color: "#fde68a" }}>
          &quot;https://api.dixipolis.fr/v1/search&quot;
        </span>
        {",\n    "}
        <span style={{ color: "#fdba74" }}>params</span>
        {"="}
        {"{"}
        <span style={{ color: "#fde68a" }}>&quot;q&quot;</span>
        {": "}
        <span style={{ color: "#fde68a" }}>&quot;macron inflation&quot;</span>
        {", "}
        <span style={{ color: "#fde68a" }}>&quot;limit&quot;</span>
        {": "}
        <span style={{ color: "#c4b5fd" }}>5</span>
        {"},\n    "}
        <span style={{ color: "#fdba74" }}>headers</span>
        {"="}
        {"{"}
        <span style={{ color: "#fde68a" }}>&quot;Authorization&quot;</span>
        {": "}
        <span style={{ color: "#fde68a" }}>&quot;Bearer YOUR_API_KEY&quot;</span>
        {"}\n)"}
        {"\n"}
        <span style={{ color: "#e2e8f0" }}>data</span>
        {" = "}
        <span style={{ color: "#e2e8f0" }}>response</span>
        <span style={{ color: "#e2e8f0" }}>.</span>
        <span style={{ color: "#c4b5fd" }}>json</span>
        {"()"}
        {"\n"}
        <span style={{ color: "#c4b5fd" }}>print</span>
        {"("}
        <span style={{ color: "#e2e8f0" }}>data</span>
        {")"}
      </>
    ),
  },

  javascript: {
    label: "JavaScript",
    code: `const response = await fetch(
  "https://api.dixipolis.fr/v1/search?q=macron+inflation&limit=5",
  {
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    }
  }
);
const data = await response.json();
console.log(data);`,
    jsx: (
      <>
        {/* Commentaire descriptif */}
        <span style={{ color: "#86efac" }}>
          {"// Recherche semantique avec fetch (ES2022+)"}
        </span>
        {"\n"}
        {/* Declaration */}
        <span style={{ color: "#93c5fd" }}>const</span>
        {" "}
        <span style={{ color: "#e2e8f0" }}>response</span>
        {" = "}
        <span style={{ color: "#93c5fd" }}>await</span>
        {" "}
        <span style={{ color: "#c4b5fd" }}>fetch</span>
        {"(\n  "}
        <span style={{ color: "#fde68a" }}>
          &quot;https://api.dixipolis.fr/v1/search?q=macron+inflation&amp;limit=5&quot;
        </span>
        {",\n  {\n    "}
        <span style={{ color: "#fdba74" }}>headers</span>
        {": {\n      "}
        <span style={{ color: "#fde68a" }}>&quot;Authorization&quot;</span>
        {": "}
        <span style={{ color: "#fde68a" }}>&quot;Bearer YOUR_API_KEY&quot;</span>
        {",\n      "}
        <span style={{ color: "#fde68a" }}>&quot;Content-Type&quot;</span>
        {": "}
        <span style={{ color: "#fde68a" }}>&quot;application/json&quot;</span>
        {"\n    }\n  }\n);"}
        {"\n"}
        <span style={{ color: "#93c5fd" }}>const</span>
        {" "}
        <span style={{ color: "#e2e8f0" }}>data</span>
        {" = "}
        <span style={{ color: "#93c5fd" }}>await</span>
        {" "}
        <span style={{ color: "#e2e8f0" }}>response</span>
        <span style={{ color: "#e2e8f0" }}>.</span>
        <span style={{ color: "#c4b5fd" }}>json</span>
        {"();"}
        {"\n"}
        <span style={{ color: "#e2e8f0" }}>console</span>
        <span style={{ color: "#e2e8f0" }}>.</span>
        <span style={{ color: "#c4b5fd" }}>log</span>
        {"("}
        <span style={{ color: "#e2e8f0" }}>data</span>
        {");"}
      </>
    ),
  },
};

/* --------------------------------------------------------------------------
 * Donnees — Reponse JSON mock
 *
 * Simule la reponse de l'endpoint /v1/search avec un extrait de discours
 * pour donner aux developpeurs un apercu concret du format de donnees.
 * La coloration syntaxique JSON utilise les memes conventions que ci-dessus.
 * -------------------------------------------------------------------------- */
const jsonResponseJsx = (
  <>
    {"{\n  "}
    <span style={{ color: "#fde68a" }}>&quot;status&quot;</span>
    {": "}
    <span style={{ color: "#86efac" }}>&quot;success&quot;</span>
    {",\n  "}
    <span style={{ color: "#fde68a" }}>&quot;total_results&quot;</span>
    {": "}
    <span style={{ color: "#c4b5fd" }}>42</span>
    {",\n  "}
    <span style={{ color: "#fde68a" }}>&quot;results&quot;</span>
    {": [\n    {\n      "}
    <span style={{ color: "#fde68a" }}>&quot;id&quot;</span>
    {": "}
    <span style={{ color: "#86efac" }}>&quot;exc_a1b2c3&quot;</span>
    {",\n      "}
    <span style={{ color: "#fde68a" }}>&quot;politician&quot;</span>
    {": "}
    <span style={{ color: "#86efac" }}>&quot;Emmanuel Macron&quot;</span>
    {",\n      "}
    <span style={{ color: "#fde68a" }}>&quot;party&quot;</span>
    {": "}
    <span style={{ color: "#86efac" }}>&quot;Renaissance&quot;</span>
    {",\n      "}
    <span style={{ color: "#fde68a" }}>&quot;text&quot;</span>
    {": "}
    <span style={{ color: "#86efac" }}>&quot;L&apos;inflation est un d&eacute;fi majeur...&quot;</span>
    {",\n      "}
    <span style={{ color: "#fde68a" }}>&quot;date&quot;</span>
    {": "}
    <span style={{ color: "#86efac" }}>&quot;2024-11-15&quot;</span>
    {",\n      "}
    <span style={{ color: "#fde68a" }}>&quot;source_url&quot;</span>
    {": "}
    <span style={{ color: "#86efac" }}>&quot;https://youtube.com/watch?v=...&t=142&quot;</span>
    {",\n      "}
    <span style={{ color: "#fde68a" }}>&quot;relevance_score&quot;</span>
    {": "}
    <span style={{ color: "#c4b5fd" }}>0.94</span>
    {"\n    }\n  ]\n}"}
  </>
);

/* --------------------------------------------------------------------------
 * CodeExample — Composant principal
 *
 * Gere deux etats :
 *   - activeTab  : onglet de langage selectionne (curl par defaut)
 *   - copied     : indique si le code a ete copie (feedback temporaire)
 *
 * Layout :
 *   - En-tete de section avec titre et description
 *   - Bloc requete : onglets + code + bouton copie
 *   - Bloc reponse : JSON mock avec label "Reponse"
 * -------------------------------------------------------------------------- */
export default function CodeExample() {
  /* Etat de l'onglet actif */
  const [activeTab, setActiveTab] = useState<CodeTab>("curl");

  /* Etat du feedback de copie */
  const [copied, setCopied] = useState(false);

  /* ------------------------------------------------------------------
   * handleCopy — Copie le code brut dans le presse-papiers
   *
   * Utilise l'API navigator.clipboard pour une copie asynchrone.
   * Affiche un feedback visuel (icone Check) pendant 2 secondes.
   * ------------------------------------------------------------------ */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExamples[activeTab].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Fallback silencieux si la copie echoue (contexte non securise) */
    }
  };

  return (
    <section
      className="bg-[var(--color-bg-page)] py-16 sm:py-20 lg:py-24"
      aria-label="Exemple de code API Dixipolis"
    >
      <div className="page-container">
        {/* ----------------------------------------------------------------
         * En-tete de section
         * Titre et description pour contextualiser l'exemple de code.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            Exemple de code
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Int&eacute;gration en quelques lignes
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Interrogez notre API avec le langage de votre choix.
            Authentification par cl&eacute; API, r&eacute;ponses JSON structur&eacute;es.
          </p>
        </div>

        {/* ----------------------------------------------------------------
         * Conteneur principal du bloc de code
         * Largeur maximale pour une lisibilite optimale du code.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto max-w-4xl">

          {/* ==============================================================
           * BLOC REQUETE
           * Contient les onglets, le code colore et le bouton de copie.
           * Fond sombre (#1e293b) pour un contraste optimal.
           * ============================================================== */}
          <div className="overflow-hidden rounded-t-[var(--radius-lg)] border border-[var(--color-border)]">

            {/* ---- Barre d'onglets ---- */}
            <div className="flex items-center justify-between border-b border-slate-700 bg-[#0f172a] px-4">
              {/* Onglets de langage */}
              <div className="flex" role="tablist">
                {(Object.keys(codeExamples) as CodeTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      /* Base : padding, texte, transition */
                      "px-4 py-3 text-sm font-medium transition-colors duration-[var(--transition-fast)]",
                      /* Onglet actif : bordure bleue en bas, texte blanc */
                      activeTab === tab
                        ? "border-b-2 border-[var(--color-primary)] text-white"
                        /* Onglet inactif : texte gris, hover blanc */
                        : "text-slate-400 hover:text-slate-200"
                    )}
                    aria-selected={activeTab === tab}
                    role="tab"
                  >
                    {codeExamples[tab].label}
                  </button>
                ))}
              </div>

              {/* Bouton de copie */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors duration-[var(--transition-fast)] hover:bg-slate-700 hover:text-white"
                aria-label="Copier le code dans le presse-papiers"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[var(--color-success)]" aria-hidden="true" />
                    <span className="text-[var(--color-success)]">Copi&eacute;</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>

            {/* ---- Bloc de code avec coloration syntaxique ---- */}
            <div className="overflow-x-auto bg-[#1e293b] p-5" role="tabpanel">
              <pre className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
                <code>{codeExamples[activeTab].jsx}</code>
              </pre>
            </div>
          </div>

          {/* ==============================================================
           * BLOC REPONSE JSON
           * Affiche la reponse mock de l'API sous le bloc de requete.
           * Fond legerement different pour distinguer requete et reponse.
           * ============================================================== */}
          <div className="overflow-hidden rounded-b-[var(--radius-lg)] border border-t-0 border-[var(--color-border)]">
            {/* Label "Reponse" */}
            <div className="flex items-center gap-2 border-b border-slate-700 bg-[#0f172a] px-4 py-2.5">
              <span
                className="inline-block h-2 w-2 rounded-full bg-[var(--color-success)]"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-slate-400">
                R&eacute;ponse — 200 OK
              </span>
            </div>

            {/* JSON colore */}
            <div className="overflow-x-auto bg-[#1e293b] p-5">
              <pre className="font-mono text-sm leading-relaxed text-[#e2e8f0]">
                <code>{jsonResponseJsx}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

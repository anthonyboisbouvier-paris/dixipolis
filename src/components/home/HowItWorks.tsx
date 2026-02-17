/* =============================================================================
 * components/home/HowItWorks.tsx
 *
 * Section "Cas d'usage" — Montre 3 scénarios concrets.
 * Pas un pipeline technique, mais ce que l'UTILISATEUR fait.
 * Design : cartes avec numéros, emojis, exemples concrets.
 *
 * Composant serveur (Server Component).
 * ============================================================================= */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
interface UseCaseData {
  number: string;
  emoji: string;
  title: string;
  scenario: string;
  example: string;
  href: string;
}

const useCases: UseCaseData[] = [
  {
    number: "01",
    emoji: "\ud83d\udd0d",
    title: "Retrouver une d\u00e9claration pr\u00e9cise",
    scenario:
      "Vous avez entendu un politique dire quelque chose en interview mais vous ne retrouvez plus la source. Posez votre question \u00e0 l\u2019agent IA, il retrouve l\u2019extrait exact avec la vid\u00e9o.",
    example: "\u00ab Qu\u2019a dit Darmanin sur les violences polici\u00e8res en mars 2024 ? \u00bb",
    href: "/prompt",
  },
  {
    number: "02",
    emoji: "\ud83d\udcca",
    title: "Comparer les positions des partis",
    scenario:
      "Vous voulez comprendre les diff\u00e9rences r\u00e9elles entre les discours de gauche et de droite sur un sujet. Le dashboard analytique compare les th\u00e8mes, mots-cl\u00e9s et distance id\u00e9ologique.",
    example: "Matrice id\u00e9ologique RE vs RN vs LFI sur l\u2019\u00e9conomie",
    href: "/analytique",
  },
  {
    number: "03",
    emoji: "\ud83d\udee1\ufe0f",
    title: "V\u00e9rifier si c\u2019est vrai",
    scenario:
      "Un politique affirme un chiffre ou un fait. Le module de v\u00e9rification croise automatiquement les sources et affiche le verdict : confirm\u00e9, exag\u00e9r\u00e9, faux ou manipulatoire.",
    example: "Fact-check : \u00ab Le ch\u00f4mage n\u2019a jamais \u00e9t\u00e9 aussi bas \u00bb",
    href: "/contenu",
  },
];

/* -------------------------------------------------------------------------- */
export default function HowItWorks() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      style={{ backgroundColor: "var(--color-bg-page)" }}
      aria-label="Cas d'usage Dixipolis"
    >
      <div className="page-container">
        {/* En-tête */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            Concr&egrave;tement, &agrave; quoi &ccedil;a sert ?
          </h2>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Trois sc&eacute;narios r&eacute;els que nos utilisateurs vivent au quotidien.
          </p>
        </div>

        {/* Cas d'usage */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {useCases.map((uc) => (
            <Link
              key={uc.number}
              href={uc.href}
              className="card card-interactive group flex flex-col overflow-hidden p-6 sm:p-8"
            >
              {/* Numéro + Emoji */}
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    color: "#fff",
                  }}
                >
                  {uc.number}
                </span>
                <span className="text-2xl" role="img" aria-hidden="true">
                  {uc.emoji}
                </span>
              </div>

              {/* Titre */}
              <h3
                className="mb-3 text-lg font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {uc.title}
              </h3>

              {/* Scénario */}
              <p
                className="mb-5 flex-1 text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {uc.scenario}
              </p>

              {/* Exemple concret */}
              <div
                className="mb-5 rounded-lg border border-dashed p-3"
                style={{
                  borderColor: "var(--color-primary-200)",
                  backgroundColor: "var(--color-primary-light)",
                }}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>
                  Exemple
                </p>
                <p className="mt-1 text-sm font-medium italic" style={{ color: "var(--color-text-primary)" }}>
                  {uc.example}
                </p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                Essayer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

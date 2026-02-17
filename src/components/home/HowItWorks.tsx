/* =============================================================================
 * components/home/HowItWorks.tsx
 *
 * Section "Comment ca marche" — 3 etapes du pipeline Dixipolis.
 * Mise a jour pour refleter le vrai pipeline des tickets Linear :
 *   1. Ingestion — Decouverte et transcription video quotidienne
 *   2. Analyse IA — Classification thematique, emotions, fact-checking
 *   3. Requete — Agent IA qui repond avec preuves sourcees
 *
 * Composant serveur (Server Component) — pas de "use client".
 * ============================================================================= */

import { Video, Brain, MessageSquare } from "lucide-react";

/* -------------------------------------------------------------------------- */
interface StepData {
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

/* --------------------------------------------------------------------------
 * Les 3 etapes du pipeline, alignees avec les tickets Linear.
 * -------------------------------------------------------------------------- */
const steps: StepData[] = [
  {
    stepNumber: 1,
    title: "Ingestion quotidienne",
    description:
      "Chaque jour, notre syst\u00e8me d\u00e9couvre automatiquement les nouvelles vid\u00e9os politiques, les transcrit mot \u00e0 mot avec horodatage pr\u00e9cis, et identifie chaque orateur.",
    icon: Video,
  },
  {
    stepNumber: 2,
    title: "Analyse multi-couches",
    description:
      "L\u2019IA classifie chaque tour de parole par th\u00e9matique, d\u00e9tecte les \u00e9motions, la toxicit\u00e9, les techniques de propagande, et identifie les assertions fact-checkables.",
    icon: Brain,
  },
  {
    stepNumber: 3,
    title: "R\u00e9ponses sourc\u00e9es",
    description:
      "Posez votre question en langage naturel. L\u2019agent combine recherche s\u00e9mantique et textuelle pour vous fournir des extraits exacts avec lien vid\u00e9o horodat\u00e9.",
    icon: MessageSquare,
  },
];

/* -------------------------------------------------------------------------- */
export default function HowItWorks() {
  return (
    <section
      className="bg-[var(--color-bg-page)] py-16 sm:py-20 lg:py-24"
      aria-label="Comment fonctionne Dixipolis"
    >
      <div className="page-container">
        {/* En-tete */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Comment &ccedil;a marche ?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            De la vid&eacute;o brute &agrave; la r&eacute;ponse sourc&eacute;e, tout est automatis&eacute;.
            Aucune intervention humaine dans le pipeline d&apos;analyse.
          </p>
        </div>

        {/* Grille des 3 etapes */}
        <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <li key={step.stepNumber} className="relative flex flex-col items-center text-center">
                {/* Connecteur horizontal (desktop) */}
                {!isLast && (
                  <div
                    className="pointer-events-none absolute left-1/2 top-8 hidden h-0.5 w-full border-t-2 border-dashed border-[var(--color-border)] md:block"
                    aria-hidden="true"
                  />
                )}

                {/* Cercle icone */}
                <div className="relative z-10 mb-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] ring-4 ring-white">
                    <Icon className="h-7 w-7 text-[var(--color-primary)]" aria-hidden="true" />
                  </div>
                  <span
                    className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white"
                    aria-label={`\u00c9tape ${step.stepNumber}`}
                  >
                    {step.stepNumber}
                  </span>
                </div>

                {/* Titre */}
                <h3 className="mb-3 text-lg font-bold text-[var(--color-text-primary)]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

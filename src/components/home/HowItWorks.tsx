/* =============================================================================
 * components/home/HowItWorks.tsx
 *
 * Section "Comment ca marche" de la page d'accueil Dixipolis.
 * Presente le fonctionnement de la plateforme en 3 etapes simples
 * pour guider le visiteur vers l'utilisation du service.
 *
 * Composant serveur (Server Component) — pas de "use client".
 *
 * Les 3 etapes :
 *   1. Posez votre question — L'utilisateur ecrit sa requete en langage naturel
 *   2. L'IA analyse — Le moteur IA cherche dans la base de discours
 *   3. Consultez les resultats — Reponses sourcees avec extraits video
 * ============================================================================= */

import { Search, Brain, FileText } from "lucide-react";

/* --------------------------------------------------------------------------
 * Interface locale pour definir la structure d'une etape du processus.
 * -------------------------------------------------------------------------- */
interface StepData {
  /** Numero de l'etape (1, 2 ou 3) */
  stepNumber: number;
  /** Titre court de l'etape */
  title: string;
  /** Description detaillee de l'etape */
  description: string;
  /** Composant icone Lucide representant l'action */
  icon: React.ComponentType<{ className?: string }>;
}

/* --------------------------------------------------------------------------
 * Donnees statiques des 3 etapes du processus.
 *
 * Le parcours est volontairement simplifie en 3 etapes pour
 * communiquer la facilite d'utilisation de la plateforme.
 * Le visiteur doit comprendre qu'il n'a qu'a poser une question
 * pour obtenir des reponses sourcees automatiquement.
 * -------------------------------------------------------------------------- */
const steps: StepData[] = [
  {
    stepNumber: 1,
    title: "Posez votre question",
    description:
      "Ecrivez votre question en francais, comme vous la poseriez a un expert. Par exemple : \"Que pense Macron de la reforme des retraites ?\"",
    icon: Search,
  },
  {
    stepNumber: 2,
    title: "L'IA analyse",
    description:
      "Notre intelligence artificielle parcourt des milliers d'heures de debats, interviews et discours pour identifier les passages les plus pertinents.",
    icon: Brain,
  },
  {
    stepNumber: 3,
    title: "Consultez les resultats",
    description:
      "Recevez des reponses structurees avec les extraits exacts, les sources video horodatees et le contexte complet de chaque declaration.",
    icon: FileText,
  },
];

/* --------------------------------------------------------------------------
 * HowItWorks — Composant principal de la section "Comment ca marche"
 *
 * Layout :
 *   - Fond gris clair (var(--color-bg-page)) pour separer visuellement
 *   - Grille 1 colonne mobile, 3 colonnes desktop
 *   - Chaque etape possede un cercle numerote, une icone, un titre
 *     et une description
 *   - Des connecteurs visuels relient les etapes sur desktop
 *
 * Accessibilite :
 *   - Liste ordonnee semantique (<ol>) pour les etapes
 *   - Numeros d'etape dans le DOM pour les lecteurs d'ecran
 *   - Icones decoratives (aria-hidden)
 * -------------------------------------------------------------------------- */
export default function HowItWorks() {
  return (
    <section
      className="bg-[var(--color-bg-page)] py-16 sm:py-20 lg:py-24"
      aria-label="Comment fonctionne Dixipolis"
    >
      <div className="page-container">
        {/* ----------------------------------------------------------------
         * En-tete de section
         * Titre et sous-titre centres pour introduire le processus.
         * ---------------------------------------------------------------- */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Comment ca marche ?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Trois etapes simples pour acceder a l&apos;integralite du discours
            politique francais, analyse par l&apos;intelligence artificielle.
          </p>
        </div>

        {/* ----------------------------------------------------------------
         * Grille des 3 etapes
         *
         * Utilise un <ol> semantique pour representer l'ordre des etapes.
         * Sur desktop, les 3 elements sont en ligne avec un espace uniforme.
         * ---------------------------------------------------------------- */}
        <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <li key={step.stepNumber} className="relative flex flex-col items-center text-center">
                {/* --------------------------------------------------------
                 * Connecteur horizontal entre les etapes (desktop uniquement)
                 * Trait en pointilles reliant le cercle numerote de cette
                 * etape a celui de l'etape suivante.
                 * -------------------------------------------------------- */}
                {!isLast && (
                  <div
                    className="pointer-events-none absolute left-1/2 top-8 hidden h-0.5 w-full border-t-2 border-dashed border-[var(--color-border)] md:block"
                    aria-hidden="true"
                  />
                )}

                {/* --------------------------------------------------------
                 * Cercle numerote avec icone
                 * Fond blanc avec bordure bleue, positionne au-dessus du
                 * connecteur grace a z-10. Contient le numero de l'etape.
                 * -------------------------------------------------------- */}
                <div className="relative z-10 mb-5">
                  {/* Cercle exterieur — fond primaire clair */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] ring-4 ring-white">
                    <Icon className="h-7 w-7 text-[var(--color-primary)]" aria-hidden="true" />
                  </div>

                  {/* Badge numerote — petit cercle en haut a droite */}
                  <span
                    className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white"
                    aria-label={`Etape ${step.stepNumber}`}
                  >
                    {step.stepNumber}
                  </span>
                </div>

                {/* --------------------------------------------------------
                 * Titre de l'etape
                 * -------------------------------------------------------- */}
                <h3 className="mb-3 text-lg font-bold text-[var(--color-text-primary)]">
                  {step.title}
                </h3>

                {/* --------------------------------------------------------
                 * Description de l'etape
                 * Texte secondaire avec largeur max pour la lisibilite.
                 * -------------------------------------------------------- */}
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

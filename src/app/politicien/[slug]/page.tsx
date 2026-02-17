/* =============================================================================
 * app/politicien/[slug]/page.tsx
 *
 * Page dynamique de profil d'un politicien.
 * Composant serveur (Server Component) utilisant le routing dynamique de Next.js 15+.
 *
 * Fonctionnement :
 *   1. Le parametre [slug] est extrait de l'URL (ex: /politicien/emmanuel-macron)
 *   2. Le politicien correspondant est recherche dans MOCK_POLITICIANS par son slug
 *   3. Si le politicien est trouve : affichage de son profil complet via PoliticianProfile
 *   4. Si le politicien n'est pas trouve : affichage d'un message d'erreur avec lien retour
 *
 * Donnees :
 *   - Les politiciens sont importes depuis lib/constants.ts (MOCK_POLITICIANS)
 *   - La recherche par slug est une simple comparaison de chaines
 *   - Dans une version future, cette recherche sera remplacee par un appel API Supabase
 *
 * Design :
 *   - Le profil est enveloppe dans PageWrapper pour le centrage et le padding header
 *   - La page 404 (politicien non trouve) est minimaliste avec un lien de retour
 *   - Style coherent avec le reste de l'application (cartes blanches, accents bleus)
 * ============================================================================= */

import PageWrapper from "@/components/layout/PageWrapper";
import PoliticianProfile from "@/components/politician/PoliticianProfile";
import { MOCK_POLITICIANS } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* --------------------------------------------------------------------------
 * Types — Parametres de la route dynamique
 *
 * Next.js 15+ passe les params de maniere asynchrone.
 * Le parametre "slug" correspond au segment dynamique [slug] dans l'URL.
 * -------------------------------------------------------------------------- */
interface PoliticienPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* --------------------------------------------------------------------------
 * PoliticienPage — Composant principal de la page /politicien/[slug]
 *
 * Etapes :
 *   1. Extraction du slug depuis les parametres de route (await params)
 *   2. Recherche du politicien dans la liste mock par correspondance de slug
 *   3. Rendu conditionnel : profil complet ou message "non trouve"
 *
 * Ce composant est async car Next.js 15+ requiert l'attente des params
 * dans les composants serveur avec des routes dynamiques.
 * -------------------------------------------------------------------------- */
export default async function PoliticienPage({ params }: PoliticienPageProps) {
  /* --------------------------------------------------------
   * Extraction du slug depuis les parametres de route.
   * Next.js 15+ rend les params asynchrones pour les composants serveur.
   * -------------------------------------------------------- */
  const { slug } = await params;

  /* --------------------------------------------------------
   * Recherche du politicien par slug dans les donnees mock.
   * La methode .find() retourne undefined si aucun politicien
   * ne correspond au slug fourni dans l'URL.
   * -------------------------------------------------------- */
  const politician = MOCK_POLITICIANS.find(
    (p) => p.slug === slug
  );

  /* ==================================================================
   * CAS 1 — Politicien non trouve
   *
   * Si le slug ne correspond a aucun politicien dans la base mock,
   * on affiche un message d'erreur elegant avec :
   *   - Un titre clair "Politicien non trouve"
   *   - Un message explicatif
   *   - Un lien de retour vers la page d'accueil
   *
   * Note : dans une version future, on pourrait utiliser notFound()
   * de Next.js pour declencher la page 404 globale.
   * ================================================================== */
  if (!politician) {
    return (
      <PageWrapper className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-lg text-center">
          {/* Carte d'erreur avec style coherent */}
          <div className="card border border-[var(--color-border)] p-8 lg:p-12">
            {/* Code d'erreur stylise */}
            <div className="mb-6 text-6xl font-extrabold text-[var(--color-text-muted)]">
              404
            </div>

            {/* Titre de l'erreur */}
            <h1 className="mb-3 text-2xl font-bold text-[var(--color-text-primary)]">
              Politicien non trouve
            </h1>

            {/* Message explicatif */}
            <p className="mb-8 leading-relaxed text-[var(--color-text-secondary)]">
              Le politicien que vous recherchez n&apos;existe pas dans notre base de
              donnees ou le lien est incorrect. Verifiez l&apos;URL ou retournez a
              l&apos;accueil pour explorer nos profils disponibles.
            </p>

            {/* Lien de retour vers l'accueil */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-[var(--transition-fast)] hover:bg-[var(--color-primary-hover)]"
            >
              <span>Retour a l&apos;accueil</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ==================================================================
   * CAS 2 — Politicien trouve
   *
   * Le politicien existe dans la base mock : on affiche son profil
   * complet via le composant PoliticianProfile.
   * Le PageWrapper fournit le centrage, le padding header et la largeur max.
   * ================================================================== */
  return (
    <PageWrapper className="py-12 sm:py-16 lg:py-20">
      <PoliticianProfile politician={politician} />
    </PageWrapper>
  );
}

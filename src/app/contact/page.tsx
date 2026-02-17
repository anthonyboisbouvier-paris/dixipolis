/* =============================================================================
 * app/contact/page.tsx
 *
 * Page "Contact" de l'application Dixipolis.
 * Composant client ("use client") car elle utilise useState pour gerer
 * l'etat du formulaire et l'affichage du message de succes.
 *
 * Structure de la page :
 *   1. Titre principal et introduction
 *   2. Grille a deux colonnes (desktop) :
 *       > Colonne gauche  : formulaire de contact (nom, email, sujet, message)
 *       > Colonne droite  : informations de contact et liens sociaux
 *   3. Message de succes apres soumission (toast visuel)
 *
 * Formulaire :
 *   - Validation cote client des champs requis
 *   - Soumission simulee (pas de backend pour le moment)
 *   - Etat gere via useState (formData, isSubmitted, errors)
 *   - Sujets disponibles : Question, Partenariat, Support technique, Autre
 *
 * Conventions :
 *   - Variables CSS du theme Dixipolis
 *   - Classe utilitaire "card" pour les panneaux blancs
 *   - Icones lucide-react pour les informations de contact
 *   - Texte en francais
 *
 * Accessibilite :
 *   - Labels explicites lies aux champs via htmlFor/id
 *   - Messages d'erreur avec aria-describedby (optionnel, non implemente ici
 *     pour simplifier mais recommande en production)
 *   - Focus visible natif sur tous les elements interactifs
 * ============================================================================= */

"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  Twitter,
  ExternalLink,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * TYPES — Structure des donnees du formulaire et des erreurs
 * -------------------------------------------------------------------------- */

/** Donnees du formulaire de contact */
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Erreurs de validation (un message par champ, ou vide) */
interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/* --------------------------------------------------------------------------
 * CONSTANTES LOCALES — Sujets disponibles dans le select
 * -------------------------------------------------------------------------- */
const SUBJECT_OPTIONS = [
  { value: "", label: "Selectionnez un sujet" },
  { value: "question", label: "Question generale" },
  { value: "partenariat", label: "Partenariat" },
  { value: "support", label: "Support technique" },
  { value: "autre", label: "Autre" },
] as const;

/* --------------------------------------------------------------------------
 * CONSTANTES LOCALES — Informations de contact affichees dans le panneau
 * -------------------------------------------------------------------------- */
const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@dixipolis.fr",
    href: "mailto:contact@dixipolis.fr",
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: "Paris, France",
    href: null,
  },
] as const;

/* --------------------------------------------------------------------------
 * CONSTANTES LOCALES — Liens vers les reseaux sociaux
 * -------------------------------------------------------------------------- */
const SOCIAL_LINKS = [
  {
    icon: Twitter,
    label: "Twitter / X",
    href: "https://twitter.com/dixipolis",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/company/dixipolis",
  },
] as const;

/* --------------------------------------------------------------------------
 * ContactPage — Composant principal de la page Contact
 *
 * Gere l'etat du formulaire, la validation et l'affichage du succes.
 * -------------------------------------------------------------------------- */
export default function ContactPage() {
  /* -----------------------------------------------------------------------
   * ETAT LOCAL
   * - formData    : valeurs saisies dans les champs
   * - errors      : messages d'erreur par champ
   * - isSubmitted : indique si le formulaire a ete soumis avec succes
   * - isLoading   : empeche les soumissions multiples
   * ----------------------------------------------------------------------- */
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* -----------------------------------------------------------------------
   * validateForm — Validation des champs requis
   *
   * Verifie que :
   *   - Le nom n'est pas vide
   *   - L'email est present et a un format valide
   *   - Un sujet est selectionne
   *   - Le message n'est pas vide et fait au moins 10 caracteres
   *
   * @returns true si le formulaire est valide, false sinon
   * ----------------------------------------------------------------------- */
  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    /* Validation du nom */
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis.";
    }

    /* Validation de l'email */
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez saisir une adresse email valide.";
    }

    /* Validation du sujet */
    if (!formData.subject) {
      newErrors.subject = "Veuillez selectionner un sujet.";
    }

    /* Validation du message */
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* -----------------------------------------------------------------------
   * handleSubmit — Gestion de la soumission du formulaire
   *
   * 1. Empeche le comportement par defaut du formulaire
   * 2. Valide les champs
   * 3. Simule un envoi (delai de 1 seconde)
   * 4. Affiche le message de succes
   *
   * En production, cette fonction appellerait un endpoint API
   * (ex: /api/contact ou un service tiers comme Resend, SendGrid, etc.)
   * ----------------------------------------------------------------------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    /* Validation avant soumission */
    if (!validateForm()) return;

    /* Simulation d'envoi */
    setIsLoading(true);

    /* Delai simule pour imiter un appel reseau */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);

    /* Reinitialisation du formulaire */
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  }

  /* -----------------------------------------------------------------------
   * handleChange — Mise a jour d'un champ du formulaire
   *
   * Utilise le name de l'element HTML comme cle dans l'objet formData.
   * Efface l'erreur du champ modifie pour un retour visuel immediat.
   * ----------------------------------------------------------------------- */
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    /* Effacer l'erreur du champ modifie */
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  /* -----------------------------------------------------------------------
   * RENDU JSX
   * ----------------------------------------------------------------------- */
  return (
    <PageWrapper className="py-12 md:py-16 lg:py-20">
      {/* ================================================================
       * EN-TETE — Titre et introduction
       * ================================================================ */}
      <section className="text-center mb-12 md:mb-16" aria-label="Introduction">
        {/* Badge contextuel */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)]">
          <Mail className="h-4 w-4" aria-hidden="true" />
          Nous contacter
        </div>

        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Contact
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
          Une question, une proposition de partenariat ou un besoin
          d&apos;assistance ? N&apos;hesitez pas a nous ecrire. Nous vous
          repondrons dans les meilleurs delais.
        </p>
      </section>

      {/* ================================================================
       * CONTENU PRINCIPAL — Formulaire + Informations
       * Grille 2 colonnes sur desktop (2/3 + 1/3), empilee sur mobile.
       * ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* ==============================================================
         * COLONNE GAUCHE — Formulaire de contact (2/3 de la largeur)
         * ============================================================== */}
        <div className="lg:col-span-2">
          <div className="card p-6 sm:p-8 md:p-10">
            {/* Message de succes apres soumission */}
            {isSubmitted && (
              <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-[var(--color-success)]">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[var(--color-success)] flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p>
                  Votre message a bien ete envoye. Nous vous repondrons dans les
                  plus brefs delais.
                </p>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                {/* --------------------------------------------------------
                 * Champ : Nom complet
                 * -------------------------------------------------------- */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                  >
                    Nom complet <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom et prenom"
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
                      errors.name
                        ? "border-[var(--color-error)] bg-red-50"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-text-muted)]"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-[var(--color-error)]">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* --------------------------------------------------------
                 * Champ : Email
                 * -------------------------------------------------------- */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                  >
                    Adresse email <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.fr"
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
                      errors.email
                        ? "border-[var(--color-error)] bg-red-50"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-text-muted)]"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-[var(--color-error)]">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* --------------------------------------------------------
                 * Champ : Sujet (select)
                 * -------------------------------------------------------- */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                  >
                    Sujet <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-sm text-[var(--color-text-primary)] transition-colors duration-200 appearance-none",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
                      /* Style du placeholder quand aucune option n'est selectionnee */
                      !formData.subject && "text-[var(--color-text-muted)]",
                      errors.subject
                        ? "border-[var(--color-error)] bg-red-50"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-text-muted)]"
                    )}
                  >
                    {SUBJECT_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === ""}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-[var(--color-error)]">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* --------------------------------------------------------
                 * Champ : Message (textarea)
                 * -------------------------------------------------------- */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                  >
                    Message <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Decrivez votre demande en detail..."
                    rows={6}
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-200 resize-y",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
                      errors.message
                        ? "border-[var(--color-error)] bg-red-50"
                        : "border-[var(--color-border)] bg-white hover:border-[var(--color-text-muted)]"
                    )}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-[var(--color-error)]">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* --------------------------------------------------------
                 * Bouton de soumission
                 * Desactive pendant le chargement pour eviter les doubles
                 * soumissions.
                 * -------------------------------------------------------- */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg px-8 py-3 text-sm font-semibold text-white transition-all duration-200",
                    isLoading
                      ? "bg-[var(--color-primary)]/70 cursor-not-allowed"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-md active:scale-[0.98]"
                  )}
                >
                  {isLoading ? (
                    <>
                      {/* Spinner de chargement */}
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ==============================================================
         * COLONNE DROITE — Informations de contact (1/3 de la largeur)
         * ============================================================== */}
        <div className="lg:col-span-1 space-y-6">
          {/* Carte : Coordonnees */}
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5">
              Nos coordonnees
            </h2>

            <div className="space-y-5">
              {CONTACT_INFO.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  {/* Icone dans un cercle colore */}
                  <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-[var(--color-primary-light)]">
                    <info.icon
                      className="h-5 w-5 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-[var(--color-text-primary)]">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte : Reseaux sociaux */}
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-5">
              Suivez-nous
            </h2>

            <div className="space-y-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                  aria-label={`Suivre Dixipolis sur ${social.label}`}
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="flex-1">{social.label}</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 text-[var(--color-text-muted)]"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Carte : Delai de reponse */}
          <div className="card p-6 sm:p-8 bg-[var(--color-primary-light)] border-[var(--color-primary)]/20">
            <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">
              Delai de reponse
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Nous nous engageons a repondre a toutes les demandes dans un
              delai de 48 heures ouvrees. Pour les demandes urgentes de
              support technique, veuillez le preciser dans votre message.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

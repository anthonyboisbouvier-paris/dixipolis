/* =============================================================================
 * app/contact/page.tsx
 *
 * Page "Contact" de l'application Dixipolis.
 * Composant client ("use client") car elle utilise useState pour gerer
 * l'etat du formulaire et l'affichage du message de succes.
 *
 * Redesign premium avec layout a deux colonnes et design soigne.
 * Les metadonnees SEO sont exportees dans le layout.tsx frere.
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
 *   - Variables CSS du theme Dixipolis via style={{ }}
 *   - Pas de Tailwind brut pour les couleurs
 *   - Classe utilitaire "card" pour les panneaux blancs
 *   - Icones lucide-react pour les informations de contact
 *   - Texte en francais
 *
 * Accessibilite :
 *   - Labels explicites lies aux champs via htmlFor/id
 *   - Messages d'erreur accessibles
 *   - Focus visible natif sur tous les elements interactifs
 * ============================================================================= */

"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  Linkedin,
  Twitter,
  ExternalLink,
  CheckCircle2,
  Clock,
  MessageSquare,
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
  { value: "", label: "S\u00e9lectionnez un sujet" },
  { value: "question", label: "Question g\u00e9n\u00e9rale" },
  { value: "partenariat", label: "Partenariat" },
  { value: "support", label: "Support technique" },
  { value: "presse", label: "Presse & m\u00e9dias" },
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
      newErrors.subject = "Veuillez s\u00e9lectionner un sujet.";
    }

    /* Validation du message */
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caract\u00e8res.";
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
   * Styles communs pour les champs de formulaire
   * Definis ici pour eviter la repetition dans le JSX
   * ----------------------------------------------------------------------- */
  const inputBaseStyle: React.CSSProperties = {
    color: "var(--color-text-primary)",
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-bg-card)",
  };

  const inputErrorStyle: React.CSSProperties = {
    color: "var(--color-text-primary)",
    borderColor: "var(--color-error)",
    backgroundColor: "var(--color-error-light)",
  };

  /* -----------------------------------------------------------------------
   * RENDU JSX
   * ----------------------------------------------------------------------- */
  return (
    <PageWrapper>
      {/* ================================================================
       * EN-TETE — Titre et introduction
       * ================================================================ */}
      <section className="text-center mb-12 md:mb-16" aria-label="Introduction">
        {/* Badge contextuel */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Nous contacter
        </div>

        <h1
          className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Contactez-nous
        </h1>
        <p
          className="mx-auto max-w-2xl text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Une question, une proposition de partenariat ou un besoin
          d&apos;assistance ? N&apos;h&eacute;sitez pas &agrave; nous &eacute;crire. Nous vous
          r&eacute;pondrons dans les meilleurs d&eacute;lais.
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
              <div
                className="mb-6 flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
                style={{
                  backgroundColor: "var(--color-success-light)",
                  color: "var(--color-success)",
                  border: "1px solid var(--color-success)",
                }}
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <p>
                  Votre message a bien &eacute;t&eacute; envoy&eacute;. Nous vous r&eacute;pondrons dans les
                  plus brefs d&eacute;lais.
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Nom complet{" "}
                    <span style={{ color: "var(--color-error)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom et pr&eacute;nom"
                    className="w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-200 focus:outline-none focus:ring-2"
                    style={{
                      ...(errors.name ? inputErrorStyle : inputBaseStyle),
                      // @ts-expect-error -- CSS custom properties dans style
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                  />
                  {errors.name && (
                    <p
                      className="mt-1.5 text-xs"
                      style={{ color: "var(--color-error)" }}
                    >
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Adresse email{" "}
                    <span style={{ color: "var(--color-error)" }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.fr"
                    className="w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-200 focus:outline-none focus:ring-2"
                    style={{
                      ...(errors.email ? inputErrorStyle : inputBaseStyle),
                      // @ts-expect-error -- CSS custom properties dans style
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                  />
                  {errors.email && (
                    <p
                      className="mt-1.5 text-xs"
                      style={{ color: "var(--color-error)" }}
                    >
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Sujet{" "}
                    <span style={{ color: "var(--color-error)" }}>*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-200 appearance-none focus:outline-none focus:ring-2"
                    style={{
                      ...(errors.subject ? inputErrorStyle : inputBaseStyle),
                      /* Couleur du texte placeholder quand rien n'est selectionne */
                      color: formData.subject
                        ? "var(--color-text-primary)"
                        : "var(--color-text-muted)",
                      // @ts-expect-error -- CSS custom properties dans style
                      "--tw-ring-color": "var(--color-primary)",
                    }}
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
                    <p
                      className="mt-1.5 text-xs"
                      style={{ color: "var(--color-error)" }}
                    >
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
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Message{" "}
                    <span style={{ color: "var(--color-error)" }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="D&eacute;crivez votre demande en d&eacute;tail..."
                    rows={6}
                    className="w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-200 resize-y focus:outline-none focus:ring-2"
                    style={{
                      ...(errors.message ? inputErrorStyle : inputBaseStyle),
                      // @ts-expect-error -- CSS custom properties dans style
                      "--tw-ring-color": "var(--color-primary)",
                    }}
                  />
                  {errors.message && (
                    <p
                      className="mt-1.5 text-xs"
                      style={{ color: "var(--color-error)" }}
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* --------------------------------------------------------
                 * Bouton de soumission
                 * Utilise la classe utilitaire btn-primary du design system.
                 * Desactive pendant le chargement.
                 * -------------------------------------------------------- */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3",
                    isLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <>
                      {/* Spinner de chargement */}
                      <div
                        className="h-4 w-4 border-2 rounded-full animate-spin"
                        style={{
                          borderColor: "rgba(255,255,255,0.3)",
                          borderTopColor: "#ffffff",
                        }}
                      />
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
            <h2
              className="text-lg font-bold mb-5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Nos coordonn&eacute;es
            </h2>

            <div className="space-y-5">
              {CONTACT_INFO.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  {/* Icone dans un carre arrondi colore */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg"
                    style={{ backgroundColor: "var(--color-primary-light)" }}
                  >
                    <info.icon
                      className="h-5 w-5"
                      style={{ color: "var(--color-primary)" }}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-primary)" }}
                      >
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
            <h2
              className="text-lg font-bold mb-5"
              style={{ color: "var(--color-text-primary)" }}
            >
              Suivez-nous
            </h2>

            <div className="space-y-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors duration-200"
                  style={{
                    color: "var(--color-text-primary)",
                    border: "1px solid var(--color-border)",
                  }}
                  aria-label={`Suivre Dixipolis sur ${social.label}`}
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="flex-1">{social.label}</span>
                  <ExternalLink
                    className="h-3.5 w-3.5"
                    style={{ color: "var(--color-text-muted)" }}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Carte : Delai de reponse — avec fond accent */}
          <div
            className="card p-6 sm:p-8"
            style={{
              backgroundColor: "var(--color-primary-light)",
              borderColor: "var(--color-primary-200)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock
                className="h-4 w-4"
                style={{ color: "var(--color-primary)" }}
                aria-hidden="true"
              />
              <h3
                className="text-sm font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                D&eacute;lai de r&eacute;ponse
              </h3>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Nous nous engageons &agrave; r&eacute;pondre &agrave; toutes les demandes dans un
              d&eacute;lai de 48 heures ouvr&eacute;es. Pour les demandes urgentes de
              support technique, veuillez le pr&eacute;ciser dans votre message.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

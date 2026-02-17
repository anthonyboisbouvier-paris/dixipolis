# Dixipolis

**La plateforme d'IA puissante pour analyser le discours politique.**

Dixipolis est une application web qui permet de rechercher, analyser et explorer l'ensemble des discours politiques francais. Grace a un moteur de recherche semantique et des outils d'analyse avances, la plateforme offre un acces direct, factuel et sans biais aux declarations des responsables politiques.

## Stack technique

| Technologie | Utilisation |
|---|---|
| **Next.js 16** | Framework React (App Router, SSR, SSG) |
| **TypeScript** | Typage statique |
| **Tailwind CSS v4** | Styles utilitaires |
| **Lucide React** | Icones |
| **Supabase** (futur) | Base de donnees, auth, storage |

## Structure du projet

```
src/
|-- app/                          # Pages (Next.js App Router)
|   |-- page.tsx                  # Accueil
|   |-- prompt/page.tsx           # Interface chat IA
|   |-- analytique/page.tsx       # Tableaux de bord
|   |-- contenu/page.tsx          # Contenu genere par l'IA
|   |-- api-pro/page.tsx          # Documentation API
|   |-- tarifs/page.tsx           # Plans tarifaires
|   |-- connexion/page.tsx        # Connexion
|   |-- inscription/page.tsx      # Inscription
|   |-- compte/page.tsx           # Espace personnel
|   |-- politicien/[slug]/page.tsx # Fiche politicien
|   |-- a-propos/page.tsx         # A propos
|   |-- contact/page.tsx          # Contact
|   |-- mentions-legales/page.tsx # Mentions legales
|   |-- politique-confidentialite/ # Politique de confidentialite
|   |-- cgu/page.tsx              # CGU
|   |-- layout.tsx                # Layout racine
|   |-- globals.css               # Styles globaux
|   |-- loading.tsx               # Etat de chargement
|   |-- not-found.tsx             # Page 404
|
|-- components/                   # Composants React reutilisables
|   |-- layout/                   # Header, Footer, PageWrapper
|   |-- ui/                       # Button, Input, Badge, Card, etc.
|   |-- home/                     # Sections de la page d'accueil
|   |-- prompt/                   # Interface de chat
|   |-- analytique/               # Composants dashboard
|   |-- contenu/                  # Cartes de contenu
|   |-- api-pro/                  # Documentation API
|   |-- politician/               # Profil politicien
|   |-- auth/                     # (reserve pour les composants auth)
|
|-- lib/                          # Utilitaires et constantes
|   |-- constants.ts              # Navigation, donnees mock, config
|   |-- utils.ts                  # Fonctions utilitaires (formatage, etc.)
|
|-- types/                        # Types TypeScript centralises
|   |-- index.ts                  # Politician, SpeechExcerpt, ChatMessage, etc.
|
|-- hooks/                        # Hooks React personnalises
|   |-- useMediaQuery.ts          # Detection responsive
```

## Pages et fonctionnalites

| Page | Description |
|---|---|
| **Accueil** | Hero, cartes de fonctionnalites, stats, processus, CTA |
| **Prompt** | Interface chat type ChatGPT pour interroger la base politique |
| **Analytique** | Tableaux de bord, graphiques, top themes, top politiciens |
| **Contenu** | Feed d'articles, newsletters et syntheses generes par l'IA |
| **API Pro** | Documentation, exemples de code, endpoints, tarification API |
| **Tarifs** | Plans web (gratuit, essentiel, pro) et API (starter, pro, entreprise) |
| **Politicien** | Fiche profil d'un politicien avec bio, themes, discours recents |
| **Connexion / Inscription** | Formulaires d'authentification |
| **Compte** | Espace personnel (profil, abonnement, recherches, alertes) |
| **A Propos** | Mission, equipe, valeurs, feuille de route |
| **Contact** | Formulaire de contact |
| **Pages legales** | Mentions legales, politique de confidentialite, CGU |

## Demarrage rapide

```bash
# Installation des dependances
npm install

# Lancer le serveur de developpement
npm run dev

# Build de production
npm run build

# Lancer en production
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Architecture et conventions

### Organisation des fichiers
- **1 dossier par domaine fonctionnel** dans `components/`
- **Types centralises** dans `types/index.ts`
- **Constantes et donnees mock** dans `lib/constants.ts`
- **Utilitaires** dans `lib/utils.ts`

### Conventions de code
- Tout le code est **commente en francais**
- Noms de fichiers en **PascalCase** pour les composants
- Noms de routes en **kebab-case** (convention Next.js)
- **"use client"** uniquement quand necessaire (interactivite)
- Les composants serveur sont preferes par defaut

### Preparation pour le back-end
Le front-end est concu pour etre facilement connecte a un back-end Supabase :
- Les **types TypeScript** correspondent aux futures tables Supabase
- Les **donnees mock** dans `constants.ts` seront remplacees par des appels API
- Les **composants "use client"** avec `useState` sont prets pour `useEffect` + fetch
- L'**authentification** (connexion, inscription, compte) est prete pour Supabase Auth

## Deploiement

Le projet est optimise pour un deploiement sur **Vercel** :

```bash
npm run build  # Verifie que le build est propre
```

## Licence

Projet prive - Dixipolis. Tous droits reserves.

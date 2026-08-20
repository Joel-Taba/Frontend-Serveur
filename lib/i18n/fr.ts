import type { Dictionary } from "./types";

export const fr: Dictionary = {
  header: {
    navAbout: "À propos",
    navFeatures: "Fonctionnalités",
    navGenres: "Genres",
    navCatalogue: "Catalogue",
    login: "Se Connecter",
    signup: "S'Inscrire",
    logout: "Se déconnecter",
    profile: "Profil",
  },
  hero: {
    slides: [
      {
        heading: "Découvrez Flores Learning Centre :",
        subheading:
          "Un écosystème numérique d'apprentissage multifonctionnel, totalement autonome et taillé pour vous.",
      },
      {
        heading: "Un panel de ressources pédagogiques pour tous les niveaux :",
        subheading: "Manuels d'apprentissage, outils d'apprentissage de l'écriture et bien d'autres…",
      },
      {
        heading: "Une gamme variée de thématiques réunies à un seul endroit :",
        subheading:
          "Manuels au programme, science, développement personnel, astronomie, histoire, culture générale… Une collection faite pour vous et qui vous ressemble.",
      },
    ],
    slideLabel: "Diapositive",
    searchPlaceholder: "Rechercher un titre, un genre…",
    searchButton: "Rechercher",
    noResults: (query) => `Aucun document ne correspond à « ${query} ».`,
    demoCta: "Voir Démo",
    demoTitle: "Vidéo de démonstration",
    demoMessage: "La vidéo de démonstration arrive bientôt — revenez un peu plus tard !",
    demoClose: "Fermer",
  },
  catalogueSearch: {
    eyebrow: "Recherche",
    heading: "Que cherchez-vous aujourd'hui ?",
  },
  about: {
    eyebrow: "À propos",
    heading: "Une Bibliothèque Vivante, Enrichie Chaque Mois",
    paragraph:
      "Flores Gong Nota rassemble des documents de natures variées — PDF, EPUB, images et données JSON — choisis pour leur qualité. Chaque nouvelle acquisition rejoint automatiquement le catalogue et devient consultable instantanément.",
    documentsLabel: "Documents",
    formatsLabel: "Formats gérés",
    onlineReadingLabel: "Lecture en ligne",
  },
  features: {
    eyebrow: "Ce que nous offrons",
    heading: "Une bibliothèque complète",
    items: [
      {
        title: "Large choix de formats",
        description:
          "PDF, EPUB, images et JSON cohabitent dans une bibliothèque unique, organisée par niveau et facile à parcourir.",
      },
      {
        title: "Lecteur intégré",
        description:
          "Chaque type de document bénéficie d'une présentation de lecture adaptée, pensée pour le confort visuel.",
      },
      {
        title: "Aucun téléchargement",
        description:
          "Les fichiers ne sont jamais exposés directement : uniquement diffusés à travers le lecteur, pour éviter toute copie.",
      },
    ],
  },
  marquee: {
    eyebrow: "Nos univers",
    heading: "Nos thématiques",
  },
  catalogue: {
    eyebrow: "Contenus",
    heading: "Notre Écosystème",
    subtitle: "Parcourez les cours par niveau ou découvrez tous les outils de notre écosystème.",
    tabLibrary: "Bibliothèque",
    tabAlphabetisation: "Alphabétisation",
    tabTools: "Nos Outils",
    breadcrumbRoot: "Bibliothèque",
    breadcrumbAriaLabel: "Fil d'Ariane",
    emptyFolder: "Ce dossier est vide.",
    noTools: "Aucun outil à présenter pour le moment.",
    itemsCount: (n) => `${n} élément${n > 1 ? "s" : ""}`,
    toolsCount: (n) => `${n} outil${n > 1 ? "s" : ""} de notre écosystème`,
    folderEmpty: "Vide",
    folderCount: (folders, documents) => {
      const parts: string[] = [];
      if (folders) parts.push(`${folders} dossier${folders > 1 ? "s" : ""}`);
      if (documents) parts.push(`${documents} document${documents > 1 ? "s" : ""}`);
      return parts.join(" · ");
    },
    documentSubtitle: "Disponible en lecture intégrale",
    toolInDevelopment: "En développement",
    toolOpen: "Ouvrir",
  },
  stats: {
    eyebrow: "Nos chiffres",
    heading: "Une Collection Qui Parle D'Elle-Même",
    documentsLabel: "Livres dans notre bibliothèque",
    accountsLabel: "Comptes créés sur le site",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Questions Fréquentes",
    items: [
      {
        q: "Qu'est-ce que Flores Gong Nota ?",
        a: "Une bibliothèque numérique qui rassemble des cours et documents (PDF, EPUB, images, JSON), classés par niveau, consultables directement en ligne grâce à un lecteur intégré.",
      },
      {
        q: "Dois-je télécharger un document pour le lire ?",
        a: "Non. Chaque document s'ouvre dans notre lecteur intégré et reste en lecture seule : aucun téléchargement ni copie n'est proposé.",
      },
      {
        q: "Comment les documents sont-ils organisés ?",
        a: "Ils sont classés dans des dossiers par niveau (Primaire, Secondaire, Supérieur…). De nouveaux dossiers peuvent être ajoutés à tout moment et apparaissent automatiquement dans la Bibliothèque.",
      },
      {
        q: "Le catalogue est-il mis à jour régulièrement ?",
        a: "Oui : chaque nouveau document ajouté au serveur apparaît instantanément dans le catalogue, sans redémarrage ni intervention technique.",
      },
      {
        q: "Ai-je besoin d'un compte pour consulter la bibliothèque ?",
        a: "Le catalogue se parcourt librement sans compte, mais la lecture d'un document exige d'être connecté — la création de compte est gratuite et ne prend qu'une minute.",
      },
      {
        q: "Qu'est-ce que la section « Nos Outils » ?",
        a: "C'est l'espace où nous présentons les autres applications de notre écosystème, comme notre future appli d'apprentissage de l'alphabet, actuellement en développement.",
      },
      {
        q: "Puis-je utiliser le site depuis un téléphone ou une tablette ?",
        a: "Oui, l'interface s'adapte à toutes les tailles d'écran, y compris le lecteur de documents.",
      },
      {
        q: "L'accès à la bibliothèque est-il payant ?",
        a: "Non, l'accès est entièrement gratuit.",
      },
      {
        q: "Que faire si un document ne s'ouvre pas correctement ?",
        a: "Cela peut arriver avec de très gros fichiers le temps qu'ils se chargent. Si le problème persiste, écrivez-nous via l'espace de contact ci-contre.",
      },
      {
        q: "Comment vous signaler un problème ou une suggestion ?",
        a: "Grâce à l'espace de contact ci-contre : plaintes, encouragements, critiques ou suggestions, tous les messages sont lus.",
      },
    ],
  },
  contact: {
    heading: "Une remarque à nous partager ?",
    subtitle: "Plainte, encouragement, critique ou appréciation — tous les messages sont lus.",
    typeAriaLabel: "Type de message",
    types: [
      { key: "appreciation", label: "Appréciation" },
      { key: "suggestion", label: "Suggestion" },
      { key: "critique", label: "Critique" },
      { key: "plainte", label: "Plainte" },
      { key: "autre", label: "Autre" },
    ],
    namePlaceholder: "Votre nom (optionnel)",
    messagePlaceholder: "Votre message…",
    send: "Envoyer",
    sending: "Envoi…",
    success: "Message envoyé, merci !",
    error: "Impossible d'envoyer le message pour le moment.",
  },
  footer: {
    description:
      "Bibliothèque numérique en lecture seule. Les documents proposés restent la propriété de leurs auteurs et ne peuvent être ni téléchargés, ni reproduits.",
    libraryHeading: "Bibliothèque",
    linkContents: "Contenus",
    linkGenres: "Genres",
    linkFeatures: "Fonctionnalités",
    linkAbout: "À propos",
    linkStats: "Nos chiffres",
    linkFaq: "FAQ",
    formatsHeading: "Formats pris en charge",
    trustHeading: "Confiance",
    trustProtected: "Lecture protégée",
    trustNoDownload: "Aucun téléchargement",
    trustAutoUpdate: "Contenus mis à jour automatiquement",
    copyright: "© 2026 Flores Gong Nota. Tous droits réservés.",
  },
  auth: {
    backToSite: "Retour au site",
    loginTitle: "Bon",
    loginAccent: "retour !",
    loginSubtitle: "Connectez-vous pour accéder à votre bibliothèque, vos favoris et votre progression.",
    signupTitle: "Rejoignez-",
    signupAccent: "nous !",
    signupSubtitle: "Créez votre compte pour sauvegarder vos favoris et suivre votre progression de lecture.",
    emailLabel: "Email",
    emailPlaceholder: "Entrez votre email",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    newPasswordPlaceholder: "Créez un mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    loginButton: "Se connecter",
    loginButtonLoading: "Connexion…",
    or: "Ou",
    continueWithGoogle: "Continuer avec Google",
    googleComingSoonLogin: "La connexion avec Google arrive bientôt.",
    googleComingSoonSignup: "L'inscription avec Google arrive bientôt.",
    noAccount: "Pas encore de compte ?",
    signupLink: "S'inscrire",
    haveAccount: "Déjà un compte ?",
    loginLink: "Se connecter",
    fullNameLabel: "Nom complet",
    fullNamePlaceholder: "Entrez votre nom",
    ageLabel: "Âge",
    agePlaceholder: "Entrez votre âge",
    countryLabel: "Pays",
    countryPlaceholder: "Choisissez votre pays",
    countryHelp: "Ce choix définira les manuels auxquels vous aurez accès.",
    signupButton: "Créer mon compte",
    signupButtonLoading: "Création…",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    genericError: "Impossible de contacter le serveur pour le moment.",
  },
  languageSwitcher: {
    label: "Langue",
  },
  countries: {
    cameroon: "Cameroun",
    chad: "Tchad",
    drc: "RDC",
    senegal: "Sénégal",
    burkina_faso: "Burkina Faso",
    niger: "Niger",
    all: "Tous les pays",
  },
  profile: {
    heading: "Mon profil",
    subtitle: "Vos informations d'inscription. Vous pouvez modifier votre pays à tout moment.",
    saveButton: "Enregistrer",
    saveButtonLoading: "Enregistrement…",
    saveSuccess: "Pays mis à jour : votre bibliothèque reflète désormais ce choix.",
    saveError: "Impossible de mettre à jour votre pays pour le moment.",
    backToSite: "Retour à l'accueil",
    viewLibraryButton: "Voir ma bibliothèque",
  },
  chat: {
    title: "Assistant Flores",
    subtitle: "Questions sur les cours, formules et vocabulaire",
    greeting: "Bonjour ! Pose-moi une question sur un cours, une formule ou un mot de vocabulaire.",
    placeholder: "Écris ta question…",
    send: "Envoyer",
    openLabel: "Ouvrir l'assistant",
    closeLabel: "Fermer l'assistant",
    unavailable: "L'assistant n'est pas encore disponible — reviens un peu plus tard.",
    error: "Impossible de contacter l'assistant pour le moment.",
    thinking: "L'assistant réfléchit…",
    loginRequired: "Connecte-toi pour discuter avec l'assistant.",
    loginCta: "Se connecter",
  },
};

export interface Dictionary {
  header: {
    navAbout: string;
    navFeatures: string;
    navGenres: string;
    navCatalogue: string;
    login: string;
    signup: string;
    logout: string;
    profile: string;
  };
  hero: {
    slides: { heading: string; subheading: string }[];
    slideLabel: string;
    searchPlaceholder: string;
    searchButton: string;
    noResults: (query: string) => string;
    demoCta: string;
    demoTitle: string;
    demoMessage: string;
    demoClose: string;
  };
  catalogueSearch: {
    eyebrow: string;
    heading: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraph: string;
    documentsLabel: string;
    formatsLabel: string;
    onlineReadingLabel: string;
  };
  features: {
    eyebrow: string;
    heading: string;
    items: { title: string; description: string }[];
  };
  marquee: {
    eyebrow: string;
    heading: string;
  };
  catalogue: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    tabLibrary: string;
    tabAlphabetisation: string;
    tabTools: string;
    breadcrumbRoot: string;
    breadcrumbAriaLabel: string;
    emptyFolder: string;
    noTools: string;
    itemsCount: (n: number) => string;
    toolsCount: (n: number) => string;
    folderEmpty: string;
    folderCount: (folders: number, documents: number) => string;
    documentSubtitle: string;
    toolInDevelopment: string;
    toolOpen: string;
  };
  stats: {
    eyebrow: string;
    heading: string;
    documentsLabel: string;
    accountsLabel: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: { q: string; a: string }[];
  };
  contact: {
    heading: string;
    subtitle: string;
    typeAriaLabel: string;
    types: { key: string; label: string }[];
    namePlaceholder: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    success: string;
    error: string;
  };
  footer: {
    description: string;
    libraryHeading: string;
    linkContents: string;
    linkGenres: string;
    linkFeatures: string;
    linkAbout: string;
    linkStats: string;
    linkFaq: string;
    formatsHeading: string;
    trustHeading: string;
    trustProtected: string;
    trustNoDownload: string;
    trustAutoUpdate: string;
    copyright: string;
  };
  auth: {
    backToSite: string;
    loginTitle: string;
    loginAccent: string;
    loginSubtitle: string;
    signupTitle: string;
    signupAccent: string;
    signupSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    newPasswordPlaceholder: string;
    forgotPassword: string;
    loginButton: string;
    loginButtonLoading: string;
    or: string;
    continueWithGoogle: string;
    googleComingSoonLogin: string;
    googleComingSoonSignup: string;
    noAccount: string;
    signupLink: string;
    haveAccount: string;
    loginLink: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    ageLabel: string;
    agePlaceholder: string;
    countryLabel: string;
    countryPlaceholder: string;
    countryHelp: string;
    signupButton: string;
    signupButtonLoading: string;
    showPassword: string;
    hidePassword: string;
    genericError: string;
  };
  languageSwitcher: {
    label: string;
  };
  countries: {
    cameroon: string;
    chad: string;
    drc: string;
    senegal: string;
    burkina_faso: string;
    niger: string;
    all: string;
  };
  profile: {
    heading: string;
    subtitle: string;
    saveButton: string;
    saveButtonLoading: string;
    saveSuccess: string;
    saveError: string;
    backToSite: string;
    viewLibraryButton: string;
  };
  chat: {
    title: string;
    subtitle: string;
    greeting: string;
    placeholder: string;
    send: string;
    openLabel: string;
    closeLabel: string;
    unavailable: string;
    error: string;
    thinking: string;
    loginRequired: string;
    loginCta: string;
  };
}

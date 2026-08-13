"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Dictionary } from "./types";
import { fr } from "./fr";
import { en } from "./en";
import { ar } from "./ar";

export type Language = "fr" | "en" | "ar";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

const DICTIONARIES: Record<Language, Dictionary> = { fr, en, ar };
const RTL_LANGUAGES: Language[] = ["ar"];
const STORAGE_KEY = "fgn_language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  // Restaure la langue choisie au premier chargement — le rendu serveur est
  // toujours en français (aucun moyen de connaître la préférence avant
  // hydratation), d'où le <html suppressHydrationWarning> du layout racine,
  // même mécanisme que pour le thème clair/sombre (next-themes).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    // Lecture ponctuelle d'un système externe (localStorage, indisponible côté serveur) au
    // montage, même stratégie que le thème clair/sombre : rendu serveur figé en français,
    // ajusté une fois côté client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && DICTIONARIES[stored]) setLanguageState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = RTL_LANGUAGES.includes(language) ? "rtl" : "ltr";
  }, [language]);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: DICTIONARIES[language],
    dir: RTL_LANGUAGES.includes(language) ? "rtl" : "ltr",
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage() doit être appelé à l'intérieur de <LanguageProvider>.");
  return context;
}

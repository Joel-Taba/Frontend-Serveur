"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage, LANGUAGES } from "@/lib/i18n/LanguageContext";

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9z" />
  </svg>
);

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lang-switcher" ref={wrapRef}>
      <button
        type="button"
        className="lang-switcher-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.languageSwitcher.label}
      >
        <GlobeIcon />
        <span>{language.toUpperCase()}</span>
      </button>
      {open && (
        <ul className="lang-switcher-menu" role="listbox">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                className={`lang-switcher-option${lang.code === language ? " is-active" : ""}`}
                role="option"
                aria-selected={lang.code === language}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

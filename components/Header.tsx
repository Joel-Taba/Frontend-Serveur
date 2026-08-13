"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          <span className="brand-name">Flores Gong Nota</span>
        </Link>
        <nav className="main-nav">
          <a href="#a-propos">{t.header.navAbout}</a>
          <a href="#fonctionnalites">{t.header.navFeatures}</a>
          <a href="#genres">{t.header.navGenres}</a>
          <a href="#catalogue">{t.header.navCatalogue}</a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <LanguageSwitcher />
          {!isLoading &&
            (user ? (
              <>
                <Link className="btn btn-ghost" href="/profil">
                  {t.header.profile}
                </Link>
                <button type="button" className="btn btn-ghost" onClick={() => logout()}>
                  {t.header.logout}
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-ghost" href="/connexion">
                  {t.header.login}
                </Link>
                <Link className="btn btn-primary" href="/inscription">
                  {t.header.signup}
                </Link>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}

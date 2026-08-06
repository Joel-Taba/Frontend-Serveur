"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/AuthContext";

export default function Header() {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          <span className="brand-name">Flores Gong Nota</span>
        </Link>
        <nav className="main-nav">
          <a href="#a-propos">À propos</a>
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#genres">Genres</a>
          <a href="#catalogue">Catalogue</a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          {!isLoading &&
            (user ? (
              <button type="button" className="btn btn-ghost" onClick={() => logout()}>
                Se déconnecter
              </button>
            ) : (
              <>
                <Link className="btn btn-ghost" href="/connexion">
                  Se Connecter
                </Link>
                <Link className="btn btn-primary" href="/inscription">
                  S&apos;Inscrire
                </Link>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}

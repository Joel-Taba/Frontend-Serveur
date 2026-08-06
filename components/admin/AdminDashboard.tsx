"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CatalogNode } from "@/lib/catalog";
import { useAuth } from "@/lib/AuthContext";
import { getInitials } from "@/lib/initials";
import ThemeToggle from "../ThemeToggle";
import LibraryManager from "./LibraryManager";
import RegistrationsPanel from "./RegistrationsPanel";
import LoginEventsPanel from "./LoginEventsPanel";
import DashboardOverview from "./DashboardOverview";
import ProfilePanel from "./ProfilePanel";
import { DashboardIcon, LibraryIcon, UserPlusIcon, LogInIcon, LogOutIcon, UserIcon } from "./adminIcons";

type Section = "dashboard" | "bibliotheque" | "inscriptions" | "connexions" | "profil";

const SECTIONS: Section[] = ["dashboard", "bibliotheque", "inscriptions", "connexions", "profil"];

const NAV: { id: Section; label: string; icon: ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "bibliotheque", label: "Bibliothèque", icon: <LibraryIcon /> },
  { id: "inscriptions", label: "Inscriptions", icon: <UserPlusIcon /> },
  { id: "connexions", label: "Connexions", icon: <LogInIcon /> },
  { id: "profil", label: "Profil", icon: <UserIcon /> },
];

const TITLES: Record<Section, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Vue d'ensemble de la plateforme" },
  bibliotheque: { title: "Bibliothèque", subtitle: "Dossiers et documents de la bibliothèque" },
  inscriptions: { title: "Inscriptions", subtitle: "Historique des créations de compte" },
  connexions: { title: "Connexions", subtitle: "Historique des connexions à la plateforme" },
  profil: { title: "Profil", subtitle: "Vos informations et paramètres de compte" },
};

export default function AdminDashboard({ tree }: { tree: CatalogNode[] }) {
  const searchParams = useSearchParams();
  // Permet au bouton "Bibliothèque" du lecteur de revenir sur la bonne
  // section (voir ReaderShell.tsx : /admin?section=bibliotheque&folder=...)
  // plutôt que de toujours réinitialiser la vue sur le Dashboard.
  const initialSection = useMemo<Section>(() => {
    const requested = searchParams.get("section");
    return (SECTIONS as string[]).includes(requested ?? "") ? (requested as Section) : "dashboard";
  }, [searchParams]);

  const [section, setSection] = useState<Section>(initialSection);
  const { title, subtitle } = TITLES[section];
  const { user } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-mark">FG</span>
          <span>Flores Gong Nota</span>
        </div>

        <nav className="admin-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item${section === item.id ? " active" : ""}`}
              onClick={() => setSection(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-exit-link">
            <LogOutIcon />
            <span>Retour au site</span>
          </Link>
        </div>
      </aside>

      <div className="admin-content-wrap">
        <header className="admin-topbar">
          <div className="admin-topbar-heading">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="admin-topbar-actions">
            <ThemeToggle />
            <button type="button" className="admin-avatar-chip" onClick={() => setSection("profil")}>
              <span className="admin-avatar-circle">
                {user?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt="" />
                ) : (
                  getInitials(user?.full_name ?? "", user?.email ?? "G")
                )}
              </span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          {section === "dashboard" && <DashboardOverview />}
          {section === "bibliotheque" && <LibraryManager initialTree={tree} />}
          {section === "inscriptions" && <RegistrationsPanel />}
          {section === "connexions" && <LoginEventsPanel />}
          {section === "profil" && <ProfilePanel />}
        </main>
      </div>
    </div>
  );
}

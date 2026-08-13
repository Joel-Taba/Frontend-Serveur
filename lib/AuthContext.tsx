"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch, clearTokens, getAccessToken, getRefreshToken, setTokens } from "./api";

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  age: number | null;
  country: string;
  role: "user" | "manager";
  is_active: boolean;
  date_joined: string;
  avatar_url: string | null;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isManager: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (
    fullName: string,
    email: string,
    password: string,
    age: number,
    country: string,
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session au premier chargement si un jeton est déjà stocké.
  // Les jetons vivent en sessionStorage (voir lib/api.ts) : ils survivent
  // à un rechargement de page mais disparaissent à la fermeture de l'onglet
  // ou de la fenêtre — l'utilisateur doit alors se reconnecter.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!getAccessToken()) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      try {
        const me = await apiFetch<AuthUser>("/accounts/me/");
        if (!cancelled) setUser(me);
      } catch {
        clearTokens();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    const data = await apiFetch<{ user: AuthUser } & AuthTokens>("/accounts/login/", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
    setTokens(data.access, data.refresh);
    setUser(data.user);
    return data.user;
  }

  async function register(
    fullName: string,
    email: string,
    password: string,
    age: number,
    country: string,
  ) {
    const data = await apiFetch<{ user: AuthUser } & AuthTokens>("/accounts/register/", {
      method: "POST",
      auth: false,
      body: { full_name: fullName, email, password, age, country },
    });
    setTokens(data.access, data.refresh);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    const refresh = getRefreshToken();
    if (refresh) {
      // Doit s'exécuter avant clearTokens() : cet appel a besoin du jeton
      // d'accès encore présent pour s'authentifier (IsAuthenticated côté
      // Backend) et fermer l'événement de connexion (date de déconnexion).
      // Best-effort : la session est déjà terminée côté client même si cet
      // appel échoue (réseau coupé, backend indisponible…).
      await apiFetch("/accounts/logout/", { method: "POST", body: { refresh } }).catch(() => {});
    }
    clearTokens();
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    isManager: user?.role === "manager",
    login,
    register,
    logout,
    updateUser: setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth() doit être appelé à l'intérieur de <AuthProvider>.");
  return context;
}

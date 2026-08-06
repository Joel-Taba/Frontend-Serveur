"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";

/**
 * Protège la lecture d'un document : la consultation exige un compte
 * connecté (n'importe quel rôle), contrairement à la découverte du
 * catalogue qui reste publique. Vérification côté client uniquement (le
 * jeton JWT vit en localStorage) — la vraie garantie vient du Backend, qui
 * refuse déjà /download/ sans jeton valide (voir DocumentDownloadView) ;
 * ce garde n'est là que pour l'expérience (rediriger vers la connexion au
 * lieu d'un lecteur qui échoue silencieusement).
 */
export default function ViewerGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/connexion?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return <div className="viewer-guard-status">Vérification de l&apos;accès…</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

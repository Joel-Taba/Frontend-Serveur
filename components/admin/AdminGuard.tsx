"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";

/**
 * Protège l'espace gestionnaire : seul un compte avec le rôle "manager"
 * (voir Backend/apps/accounts) peut voir le contenu. Vérification
 * côté client uniquement (le jeton JWT vit en localStorage, pas dans un
 * cookie lisible côté serveur) — un vrai progrès par rapport à l'absence
 * totale de protection précédente, mais pas une garantie serveur : ne pas
 * y placer de donnée que le HTML ne doit jamais transiter vers un visiteur
 * non autorisé tant que la bibliothèque n'est pas, elle aussi, servie par
 * l'API protégée.
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isLoading, isManager } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isManager)) {
      router.replace("/connexion");
    }
  }, [isLoading, user, isManager, router]);

  if (isLoading) {
    return <div className="admin-guard-status">Vérification de l&apos;accès…</div>;
  }

  if (!user || !isManager) {
    return null;
  }

  return <>{children}</>;
}

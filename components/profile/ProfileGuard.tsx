"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";

/** Protège la page profil : réservée aux comptes connectés. Vérification
 * côté client uniquement (jeton JWT en sessionStorage, illisible côté
 * serveur) — même principe que AdminGuard.tsx. */
export default function ProfileGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/connexion?next=/profil");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
  }

  return <>{children}</>;
}

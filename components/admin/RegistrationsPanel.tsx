"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { UserPlusIcon } from "./adminIcons";

interface RegisteredUser {
  id: number;
  email: string;
  full_name: string;
  role: "user" | "manager";
  is_active: boolean;
  date_joined: string;
}

interface Paginated<T> {
  count: number;
  results: T[];
}

export default function RegistrationsPanel() {
  const [users, setUsers] = useState<RegisteredUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Paginated<RegisteredUser>>("/accounts/registrations/")
      .then((data) => {
        if (!cancelled) setUsers(data.results);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Impossible de charger l'historique.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Historique des inscriptions</h2>
        <p>Chaque création de compte sur la plateforme.</p>
      </div>

      {error && <p className="admin-message admin-message-error">{error}</p>}
      {!error && !users && <div className="admin-guard-status">Chargement…</div>}

      {users &&
        (users.length > 0 ? (
          <div className="admin-table">
            <div className="admin-table-head admin-table-head-3">
              <span>Utilisateur</span>
              <span>Rôle</span>
              <span>Inscrit le</span>
            </div>
            {users.map((user) => (
              <div key={user.id} className="admin-table-row admin-table-row-3 admin-table-row-static">
                <span className="admin-table-name">
                  <span className="admin-table-icon">
                    <UserPlusIcon />
                  </span>
                  {user.full_name || user.email}
                </span>
                <span>
                  <span className="admin-badge admin-badge-folder">
                    {user.role === "manager" ? "Gestionnaire" : "Utilisateur"}
                  </span>
                </span>
                <span className="admin-table-muted">
                  {new Date(user.date_joined).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Aucune inscription pour l&apos;instant.</p>
        ))}
    </div>
  );
}

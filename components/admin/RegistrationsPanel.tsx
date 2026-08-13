"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { EyeIcon } from "../auth/authIcons";
import { UserPlusIcon, TrashIcon } from "./adminIcons";
import ConfirmDialog from "./ConfirmDialog";
import UserDetailDialog from "./UserDetailDialog";

interface RegisteredUser {
  id: number;
  email: string;
  full_name: string;
  age: number | null;
  role: "user" | "manager";
  is_active: boolean;
  date_joined: string;
  avatar_url: string | null;
}

interface Paginated<T> {
  count: number;
  results: T[];
}

export default function RegistrationsPanel() {
  const [users, setUsers] = useState<RegisteredUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [viewing, setViewing] = useState<RegisteredUser | null>(null);
  const [pendingDelete, setPendingDelete] = useState<RegisteredUser | null>(null);

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

  async function confirmDeleteUser() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setMessage(null);
    try {
      await apiFetch(`/accounts/registrations/${target.id}/`, { method: "DELETE" });
      setUsers((prev) => (prev ? prev.filter((u) => u.id !== target.id) : prev));
      setMessage({ type: "success", text: `Compte « ${target.full_name || target.email} » supprimé.` });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Erreur inconnue." });
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Historique des inscriptions</h2>
        <p>Chaque création de compte sur la plateforme.</p>
      </div>

      {error && <p className="admin-message admin-message-error">{error}</p>}
      {message && <p className={`admin-message admin-message-${message.type}`}>{message.text}</p>}
      {!error && !users && <div className="admin-guard-status">Chargement…</div>}

      {users &&
        (users.length > 0 ? (
          <div className="admin-table">
            <div className="admin-table-head admin-table-head-3-actions">
              <span>Utilisateur</span>
              <span>Rôle</span>
              <span>Inscrit le</span>
              <span>Action</span>
            </div>
            {users.map((user) => (
              <div key={user.id} className="admin-table-row admin-table-row-3-actions admin-table-row-static">
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
                <span className="admin-table-actions-cell">
                  <button
                    type="button"
                    className="admin-table-icon-btn"
                    onClick={() => setViewing(user)}
                    title="Voir les informations"
                    aria-label={`Voir les informations de ${user.full_name || user.email}`}
                  >
                    <EyeIcon />
                  </button>
                  <button
                    type="button"
                    className="admin-table-icon-btn is-danger"
                    onClick={() => setPendingDelete(user)}
                    disabled={user.role !== "user"}
                    title={
                      user.role === "user"
                        ? "Supprimer ce compte"
                        : "Les comptes gestionnaires ne peuvent pas être supprimés ici"
                    }
                    aria-label={`Supprimer le compte de ${user.full_name || user.email}`}
                  >
                    <TrashIcon />
                  </button>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Aucune inscription pour l&apos;instant.</p>
        ))}

      {viewing && <UserDetailDialog user={viewing} onClose={() => setViewing(null)} />}

      {pendingDelete && (
        <ConfirmDialog
          title="Supprimer ce compte ?"
          message={`« ${pendingDelete.full_name || pendingDelete.email} » sera définitivement supprimé, ainsi que son historique de connexions. Cette action est irréversible.`}
          onConfirm={confirmDeleteUser}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

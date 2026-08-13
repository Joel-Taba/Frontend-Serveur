"use client";

import { useEffect } from "react";
import { UserIcon } from "./adminIcons";

interface UserDetail {
  full_name: string;
  email: string;
  age: number | null;
  role: "user" | "manager";
  is_active: boolean;
  date_joined: string;
  avatar_url: string | null;
}

export default function UserDetailDialog({ user, onClose }: { user: UserDetail; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="confirm-dialog detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="confirm-dialog-icon">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt="" />
          ) : (
            <UserIcon />
          )}
        </span>
        <h3 id="detail-dialog-title">{user.full_name || "Sans nom"}</h3>

        <dl className="detail-dialog-list">
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Âge</dt>
            <dd>{user.age ?? "Non renseigné"}</dd>
          </div>
          <div>
            <dt>Rôle</dt>
            <dd>{user.role === "manager" ? "Gestionnaire" : "Utilisateur"}</dd>
          </div>
          <div>
            <dt>Statut</dt>
            <dd>{user.is_active ? "Actif" : "Désactivé"}</dd>
          </div>
          <div>
            <dt>Inscrit le</dt>
            <dd>
              {new Date(user.date_joined).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
            </dd>
          </div>
        </dl>

        <div className="confirm-dialog-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

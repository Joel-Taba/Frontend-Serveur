"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth, type AuthUser } from "@/lib/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import { getInitials } from "@/lib/initials";
import { EyeIcon, EyeOffIcon } from "../auth/authIcons";
import { CameraIcon, KeyIcon, TrashIcon, UserIcon } from "./adminIcons";

type StatusMessage = { kind: "success" | "error"; text: string };

/** Affiche un statut transitoire : disparaît de lui-même après quelques
 * secondes plutôt que de rester affiché indéfiniment. */
function useTransientStatus(): [StatusMessage | null, (status: StatusMessage | null) => void] {
  const [status, setStatus] = useState<StatusMessage | null>(null);

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  return [status, setStatus];
}

export default function ProfilePanel() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoStatus, setInfoStatus] = useTransientStatus();

  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useTransientStatus();

  if (!user) return null;

  async function handleInfoSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setSavingInfo(true);
    setInfoStatus(null);
    try {
      const updated = await apiFetch<AuthUser>("/accounts/me/", {
        method: "PATCH",
        body: { full_name: fullName.trim(), email: email.trim() },
      });
      updateUser(updated);
      setInfoStatus({ kind: "success", text: "Informations mises à jour." });
    } catch (err) {
      setInfoStatus({
        kind: "error",
        text: err instanceof ApiError ? err.message : "Impossible de mettre à jour le profil.",
      });
    } finally {
      setSavingInfo(false);
    }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setAvatarBusy(true);
    setAvatarError(null);
    try {
      const form = new FormData();
      form.append("avatar", file);
      const updated = await apiFetch<AuthUser>("/accounts/me/avatar/", { method: "POST", body: form });
      updateUser(updated);
    } catch (err) {
      setAvatarError(err instanceof ApiError ? err.message : "Impossible d'envoyer la photo.");
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleAvatarRemove() {
    setAvatarBusy(true);
    setAvatarError(null);
    try {
      const updated = await apiFetch<AuthUser>("/accounts/me/avatar/", { method: "DELETE" });
      updateUser(updated);
    } catch (err) {
      setAvatarError(err instanceof ApiError ? err.message : "Impossible de retirer la photo.");
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handlePasswordSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ kind: "error", text: "La confirmation ne correspond pas au nouveau mot de passe." });
      return;
    }
    setSavingPassword(true);
    setPasswordStatus(null);
    try {
      await apiFetch("/accounts/me/password/", {
        method: "POST",
        body: { current_password: currentPassword, new_password: newPassword },
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus({ kind: "success", text: "Mot de passe mis à jour." });
    } catch (err) {
      setPasswordStatus({
        kind: "error",
        text: err instanceof ApiError ? err.message : "Impossible de changer le mot de passe.",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="admin-panel admin-profile">
      <div className="admin-panel-header">
        <h2>Mon profil</h2>
        <p>Vos informations personnelles et les paramètres de votre compte gestionnaire.</p>
      </div>

      <div className="profile-avatar-section">
        <div className="profile-avatar-preview">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.full_name || user.email} />
          ) : (
            <span>{getInitials(user.full_name, user.email)}</span>
          )}
        </div>
        <div className="profile-avatar-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarBusy}
          >
            <CameraIcon />
            {avatarBusy ? "Envoi…" : "Changer la photo"}
          </button>
          {user.avatar_url && (
            <button
              type="button"
              className="profile-avatar-remove"
              onClick={handleAvatarRemove}
              disabled={avatarBusy}
            >
              <TrashIcon />
              Retirer
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleAvatarChange}
          />
          <p className="profile-avatar-hint">JPG, PNG ou WEBP, 5 Mo maximum.</p>
          {avatarError && <p className="admin-message admin-message-error">{avatarError}</p>}
        </div>
      </div>

      <form className="profile-form" onSubmit={handleInfoSubmit}>
        <h3>
          <UserIcon /> Informations personnelles
        </h3>
        <div className="profile-form-grid">
          <label>
            Nom complet
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          </label>
          <label>
            Email
            <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={savingInfo}>
          {savingInfo ? "Enregistrement…" : "Enregistrer"}
        </button>
        {infoStatus && <p className={`contact-status contact-status-${infoStatus.kind}`}>{infoStatus.text}</p>}
      </form>

      <form className="profile-form" onSubmit={handlePasswordSubmit}>
        <h3>
          <KeyIcon /> Mot de passe
        </h3>
        <div className="profile-form-grid">
          <label>
            Mot de passe actuel
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Nouveau mot de passe
            <div className="profile-password-field">
              <input
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="profile-password-toggle"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>
          <label>
            Confirmer le mot de passe
            <div className="profile-password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="profile-password-toggle"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={savingPassword}>
          {savingPassword ? "Mise à jour…" : "Changer le mot de passe"}
        </button>
        {passwordStatus && (
          <p className={`contact-status contact-status-${passwordStatus.kind}`}>{passwordStatus.text}</p>
        )}
      </form>
    </div>
  );
}

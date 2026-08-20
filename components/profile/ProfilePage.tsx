"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, type AuthUser } from "@/lib/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SELECTABLE_COUNTRY_CODES } from "@/lib/countries";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { BackArrowIcon } from "@/components/auth/authIcons";

type StatusMessage = { kind: "success" | "error"; text: string };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  if (!user) return null;

  const hasChanges = fullName.trim() !== user.full_name || country !== user.country;

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const updated = await apiFetch<AuthUser>("/accounts/me/", {
        method: "PATCH",
        body: { full_name: fullName.trim(), country },
      });
      updateUser(updated);
      setStatus({ kind: "success", text: t.profile.saveSuccess });
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof ApiError ? err.message : t.profile.saveError });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <Link className="profile-back-link" href="/">
          <BackArrowIcon />
          <span>{t.profile.backToSite}</span>
        </Link>
        <div className="profile-topbar-actions">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      <div className="profile-card">
        <h1>{t.profile.heading}</h1>
        <p className="profile-subtitle">{t.profile.subtitle}</p>

        <div className="profile-field profile-field-static">
          <label>{t.auth.emailLabel}</label>
          <p>{user.email}</p>
        </div>
        <div className="profile-field profile-field-static">
          <label>{t.auth.ageLabel}</label>
          <p>{user.age ?? "—"}</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-field">
            <label htmlFor="profile-full-name">{t.auth.fullNameLabel}</label>
            <input
              id="profile-full-name"
              type="text"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="profile-country">{t.auth.countryLabel}</label>
            <select id="profile-country" value={country} onChange={(event) => setCountry(event.target.value)}>
              {SELECTABLE_COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>
                  {t.countries[code]}
                </option>
              ))}
            </select>
            <p className="profile-field-help">{t.auth.countryHelp}</p>
          </div>

          <div className="profile-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving || !hasChanges}>
              {saving ? t.profile.saveButtonLoading : t.profile.saveButton}
            </button>
            <Link className="btn btn-ghost" href="/#catalogue">
              {t.profile.viewLibraryButton}
            </Link>
          </div>

          {status && <p className={`contact-status contact-status-${status.kind}`}>{status.text}</p>}
        </form>
      </div>
    </div>
  );
}

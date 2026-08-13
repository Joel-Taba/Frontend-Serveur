"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { ApiError } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SELECTABLE_COUNTRY_CODES } from "@/lib/countries";
import { EyeIcon, EyeOffIcon, GoogleIcon } from "./authIcons";

/** N'accepte qu'un chemin interne (`/viewer/...`) : jamais une URL absolue
 * ni `//hote-externe`, pour éviter une redirection ouverte via `?next=`. */
function safeNextPath(value: string | null): string | null {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return null;
}

export default function SignupForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const next = safeNextPath(searchParams.get("next"));

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(fullName, email, password, Number(age), country);
      router.push(next ?? "/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="name">{t.auth.fullNameLabel}</label>
          <input
            id="name"
            type="text"
            placeholder={t.auth.fullNamePlaceholder}
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">{t.auth.emailLabel}</label>
          <input
            id="email"
            type="text"
            placeholder={t.auth.emailPlaceholder}
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="age">{t.auth.ageLabel}</label>
          <input
            id="age"
            type="number"
            placeholder={t.auth.agePlaceholder}
            min={1}
            max={120}
            required
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="country">{t.auth.countryLabel}</label>
          <select
            id="country"
            required
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          >
            <option value="" disabled>
              {t.auth.countryPlaceholder}
            </option>
            {SELECTABLE_COUNTRY_CODES.map((code) => (
              <option key={code} value={code}>
                {t.countries[code]}
              </option>
            ))}
          </select>
          <p className="auth-field-help">{t.auth.countryHelp}</p>
        </div>

        <div className="auth-field">
          <label htmlFor="password">{t.auth.passwordLabel}</label>
          <div className="auth-field-input-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t.auth.newPasswordPlaceholder}
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="auth-field-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? t.auth.signupButtonLoading : t.auth.signupButton}
        </button>

        <div className="auth-divider">{t.auth.or}</div>

        <button
          type="button"
          className="auth-google"
          onClick={() => setError(t.auth.googleComingSoonSignup)}
        >
          <GoogleIcon />
          {t.auth.continueWithGoogle}
        </button>
      </form>

      {error && <p className="auth-note auth-note-error">{error}</p>}

      <p className="auth-switch">
        {t.auth.haveAccount}{" "}
        <Link href={next ? `/connexion?next=${encodeURIComponent(next)}` : "/connexion"}>
          {t.auth.loginLink}
        </Link>
      </p>
    </>
  );
}

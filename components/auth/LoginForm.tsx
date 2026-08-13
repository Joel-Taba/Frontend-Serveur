"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { ApiError } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { EyeIcon, EyeOffIcon, GoogleIcon } from "./authIcons";

/** N'accepte qu'un chemin interne (`/viewer/...`) : jamais une URL absolue
 * ni `//hote-externe`, pour éviter une redirection ouverte via `?next=`. */
function safeNextPath(value: string | null): string | null {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return null;
}

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const next = safeNextPath(searchParams.get("next"));

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login(email, password);
      router.push(next ?? (user.role === "manager" ? "/admin" : "/"));
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
          <label htmlFor="password">{t.auth.passwordLabel}</label>
          <div className="auth-field-input-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t.auth.passwordPlaceholder}
              autoComplete="current-password"
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

        <div className="auth-row">
          <a className="auth-forgot" href="#">
            {t.auth.forgotPassword}
          </a>
        </div>

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? t.auth.loginButtonLoading : t.auth.loginButton}
        </button>

        <div className="auth-divider">{t.auth.or}</div>

        <button
          type="button"
          className="auth-google"
          onClick={() => setError(t.auth.googleComingSoonLogin)}
        >
          <GoogleIcon />
          {t.auth.continueWithGoogle}
        </button>
      </form>

      {error && <p className="auth-note auth-note-error">{error}</p>}

      <p className="auth-switch">
        {t.auth.noAccount}{" "}
        <Link href={next ? `/inscription?next=${encodeURIComponent(next)}` : "/inscription"}>
          {t.auth.signupLink}
        </Link>
      </p>
    </>
  );
}

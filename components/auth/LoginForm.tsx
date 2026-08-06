"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { ApiError } from "@/lib/api";
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
      setError(err instanceof ApiError ? err.message : "Impossible de contacter le serveur pour le moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Entrez votre email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Mot de passe</label>
          <div className="auth-field-input-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="auth-field-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="auth-row">
          <a className="auth-forgot" href="#">
            Mot de passe oublié ?
          </a>
        </div>

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? "Connexion…" : "Se connecter"}
        </button>

        <div className="auth-divider">Ou</div>

        <button
          type="button"
          className="auth-google"
          onClick={() => setError("La connexion avec Google arrive bientôt.")}
        >
          <GoogleIcon />
          Continuer avec Google
        </button>
      </form>

      {error && <p className="auth-note auth-note-error">{error}</p>}

      <p className="auth-switch">
        Pas encore de compte ?{" "}
        <Link href={next ? `/inscription?next=${encodeURIComponent(next)}` : "/inscription"}>S&apos;inscrire</Link>
      </p>
    </>
  );
}

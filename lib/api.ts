/**
 * Client HTTP vers le Backend Django (Backend/). Ce module ne gère que
 * l'authentification pour l'instant — le reste (bibliothèque, analytics,
 * contact, outils) tourne encore sur le système de fichiers local et sera
 * branché dans une prochaine passe.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8001/api").replace(/\/$/, "");

const ACCESS_TOKEN_KEY = "fgn_access_token";
const REFRESH_TOKEN_KEY = "fgn_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

/** En-tête Authorization à joindre aux requêtes vers /api/file et
 * /api/thumbnail (proxys internes) — la consultation d'un document exige un
 * compte connecté depuis le Backend (voir DocumentDownloadView). */
export function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
  window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Envoie l'en-tête Authorization avec le jeton d'accès. Par défaut true —
   * mettre à false pour les appels publics (connexion, inscription). */
  auth?: boolean;
}

function buildHeaders(options: ApiFetchOptions, isJsonBody: boolean): Headers {
  const headers = new Headers(options.headers);
  if (isJsonBody && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  if (options.auth ?? true) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

async function rawFetch(path: string, options: ApiFetchOptions): Promise<Response> {
  const isJsonBody = options.body !== undefined && !(options.body instanceof FormData);
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options, isJsonBody),
    body: options.body instanceof FormData ? options.body : options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

/** Échange le refresh token contre un nouveau access token. Renvoie false
 * (sans lever d'erreur) si le refresh token est absent, invalide ou expiré —
 * l'appelant doit alors traiter la session comme terminée. */
async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const response = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) return false;

  const data = await response.json();
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  if (data.refresh) window.sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
  return true;
}

async function parseErrorDetail(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") return data.detail;
    const firstValue = Object.values(data).flat()[0];
    if (typeof firstValue === "string") return firstValue;
  } catch {
    // pas de corps JSON exploitable
  }
  return `Erreur ${response.status}`;
}

/** Appelle l'API Backend. Rejoue automatiquement la requête une fois si le
 * jeton d'accès a expiré (401) et qu'un refresh token est disponible. */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  let response = await rawFetch(path, options);

  if (response.status === 401 && (options.auth ?? true) && getRefreshToken()) {
    if (await refreshAccessToken()) {
      response = await rawFetch(path, options);
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetail(response));
  }

  if (response.status === 204 || response.status === 205) return undefined as T;
  return (await response.json()) as T;
}

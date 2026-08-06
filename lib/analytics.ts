/**
 * Traçait autrefois les visites dans .cache/analytics.json ; enregistre
 * maintenant chaque visite auprès du Backend (apps.analytics). Réservé aux
 * composants serveur (utilise BACKEND_INTERNAL_URL, jamais exposée au
 * navigateur).
 */
const BACKEND_INTERNAL_URL = (process.env.BACKEND_INTERNAL_URL ?? "http://127.0.0.1:8001/api").replace(/\/$/, "");

/** Enregistre une visite. Volontairement non bloquant : un Backend
 * indisponible ne doit jamais empêcher la page de s'afficher. */
export function recordVisit(path = "/"): void {
  fetch(`${BACKEND_INTERNAL_URL}/analytics/track-visit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
    cache: "no-store",
  }).catch(() => {
    // Le suivi de visites ne doit jamais faire échouer le rendu de la page.
  });
}

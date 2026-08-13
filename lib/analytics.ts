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

/** Nombre de comptes utilisateurs (hors gestionnaires) — statistique
 * publique « Comptes créés sur le site » (Stats.tsx). Retombe sur 0 si le
 * Backend est indisponible, plutôt que de faire échouer la page. */
export async function getRegisteredAccountCount(): Promise<number> {
  try {
    const res = await fetch(`${BACKEND_INTERNAL_URL}/accounts/count/`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return typeof data.count === "number" ? data.count : 0;
  } catch {
    return 0;
  }
}

/**
 * Vitrine « Nos Outils » — servait autrefois une liste statique, vient
 * maintenant du Backend (apps.tools), administrable depuis l'espace
 * gestionnaire. Réservé aux composants serveur (BACKEND_INTERNAL_URL).
 */
const BACKEND_INTERNAL_URL = (process.env.BACKEND_INTERNAL_URL ?? "http://127.0.0.1:8001/api").replace(/\/$/, "");

export interface EcosystemTool {
  id: number;
  name: string;
  description: string;
  status: "disponible" | "en-developpement";
  href?: string;
}

interface BackendTool {
  id: number;
  name: string;
  description: string;
  status: "disponible" | "en-developpement";
  url: string;
}

export async function getEcosystemTools(): Promise<EcosystemTool[]> {
  const res = await fetch(`${BACKEND_INTERNAL_URL}/tools/`, { cache: "no-store" });
  if (!res.ok) return [];
  const data: { results: BackendTool[] } = await res.json();
  return data.results.map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    status: tool.status,
    href: tool.url || undefined,
  }));
}

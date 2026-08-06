/**
 * Ce module parlait autrefois directement au système de fichiers
 * (documents/). Il parle maintenant au Backend Django (Backend/apps/library)
 * — mais garde exactement les mêmes noms et formes exportés, pour que tous
 * les composants qui l'utilisent n'aient rien à changer.
 *
 * Réservé aux composants serveur et routes API (utilise `fetch` vers
 * BACKEND_INTERNAL_URL, une variable non préfixée NEXT_PUBLIC_ — jamais
 * exposée au navigateur). Pour un appel depuis un composant client, voir
 * lib/api.ts.
 */

const BACKEND_INTERNAL_URL = (process.env.BACKEND_INTERNAL_URL ?? "http://127.0.0.1:8001/api").replace(/\/$/, "");

export type DocumentType = "pdf" | "epub" | "json" | "image" | "video";

export interface CatalogDocument {
  kind: "document";
  id: string[];
  /** Clé primaire côté Backend — nécessaire pour les opérations d'écriture
   * (créer un sous-dossier, envoyer un document) depuis l'espace gestionnaire. */
  backendId: number;
  title: string;
  type: DocumentType;
  size: number;
  downloadUrl: string;
  thumbnailUrl: string;
}

export interface CatalogFolder {
  kind: "folder";
  id: string[];
  backendId: number;
  name: string;
  children: CatalogNode[];
}

export type CatalogNode = CatalogFolder | CatalogDocument;

export interface SearchableDocument extends CatalogDocument {
  folderNames: string[];
}

interface BackendDocumentNode {
  kind: "document";
  id: number;
  title: string;
  doc_type: DocumentType;
  size: number;
  path: string[];
  download_url: string;
  thumbnail_url: string;
}

interface BackendFolderNode {
  kind: "folder";
  id: number;
  name: string;
  path: string[];
  children: BackendNode[];
}

type BackendNode = BackendFolderNode | BackendDocumentNode;

function mapDocument(node: BackendDocumentNode): CatalogDocument {
  return {
    kind: "document",
    id: node.path,
    backendId: node.id,
    title: node.title,
    type: node.doc_type,
    size: node.size,
    downloadUrl: node.download_url,
    thumbnailUrl: node.thumbnail_url,
  };
}

function mapNode(node: BackendNode): CatalogNode {
  if (node.kind === "document") return mapDocument(node);
  return {
    kind: "folder",
    id: node.path,
    backendId: node.id,
    name: node.name,
    children: node.children.map(mapNode),
  };
}

function isFolder(node: CatalogNode): node is CatalogFolder {
  return node.kind === "folder";
}

/** Reconstruit l'arbre complet (dossiers + documents) depuis le Backend —
 * même contrat qu'avant : un appel réseau par requête, pas de cache, pour
 * qu'un document ajouté depuis l'espace gestionnaire apparaisse aussitôt. */
export async function getCatalogTree(): Promise<CatalogNode[]> {
  const res = await fetch(`${BACKEND_INTERNAL_URL}/library/tree/`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Impossible de charger la bibliothèque (HTTP ${res.status}).`);
  const data: { tree: BackendNode[] } = await res.json();
  return data.tree.map(mapNode);
}

function flatten(nodes: CatalogNode[], ancestors: string[]): SearchableDocument[] {
  const result: SearchableDocument[] = [];
  for (const node of nodes) {
    if (isFolder(node)) result.push(...flatten(node.children, [...ancestors, node.name]));
    else result.push({ ...node, folderNames: ancestors });
  }
  return result;
}

/** Parcourt tout l'arbre : sert au comptage sur la page d'accueil et à
 * l'index de recherche (titre ou dossier ancêtre) de la barre de recherche. */
export async function listAllDocuments(): Promise<SearchableDocument[]> {
  const tree = await getCatalogTree();
  return flatten(tree, []);
}

export async function countFolders(): Promise<number> {
  const tree = await getCatalogTree();
  const count = (nodes: CatalogNode[]): number =>
    nodes.reduce((sum, node) => (isFolder(node) ? sum + 1 + count(node.children) : sum), 0);
  return count(tree);
}

export function countDocumentsInNode(node: CatalogNode): number {
  if (node.kind === "document") return 1;
  return node.children.reduce((sum, child) => sum + countDocumentsInNode(child), 0);
}

/** Résout un document à partir de son chemin de segments — un seul appel
 * réseau ciblé plutôt que de télécharger tout l'arbre pour un document. */
export async function getDocumentWithPath(idSegments: string[]): Promise<CatalogDocument | undefined> {
  const path = idSegments.map(encodeURIComponent).join("/");
  const res = await fetch(`${BACKEND_INTERNAL_URL}/library/resolve/${path}/`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`Impossible de résoudre le document (HTTP ${res.status}).`);
  const doc: BackendDocumentNode = await res.json();
  return mapDocument(doc);
}

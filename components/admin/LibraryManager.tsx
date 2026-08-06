"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CatalogNode, CatalogFolder, CatalogDocument, DocumentType } from "@/lib/catalog";
import { formatBytes } from "@/lib/format";
import { apiFetch, ApiError } from "@/lib/api";
import { BreadcrumbHomeIcon, ChevronIcon, FolderIcon } from "../catalogueIcons";
import { FolderPlusIcon, UploadIcon, FileIcon, GearIcon, TrashIcon } from "./adminIcons";
import ConfirmDialog from "./ConfirmDialog";

const ACCEPTED_EXTENSIONS = ".pdf,.epub,.json,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.ogg,.mov";

const TYPE_LABELS: Record<DocumentType, string> = {
  pdf: "PDF",
  image: "Image",
  epub: "EPUB",
  json: "JSON",
  video: "Vidéo",
};

/** Même règle que humanize_title() côté Backend (management command
 * d'import) : dérive un titre lisible du nom de fichier envoyé — le champ
 * `title` est obligatoire côté API (DocumentSerializer). */
function humanizeTitle(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, "");
  const spaced = stem.replace(/[_-]+/g, " ").trim();
  return spaced
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word === word.toLowerCase() ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function isFolder(node: CatalogNode): node is CatalogFolder {
  return node.kind === "folder";
}

function isDocument(node: CatalogNode): node is CatalogDocument {
  return node.kind === "document";
}

interface Crumb {
  id: string[];
  name: string;
}

function findFolder(nodes: CatalogNode[], path: string[]): CatalogFolder | null {
  let list = nodes;
  let folder: CatalogFolder | null = null;
  for (const segment of path) {
    const match = list.filter(isFolder).find((f) => f.id[f.id.length - 1] === segment);
    if (!match) return null;
    folder = match;
    list = match.children;
  }
  return folder;
}

function buildBreadcrumb(nodes: CatalogNode[], path: string[]): Crumb[] {
  const crumbs: Crumb[] = [];
  let list = nodes;
  for (const segment of path) {
    const match = list.filter(isFolder).find((f) => f.id[f.id.length - 1] === segment);
    if (!match) break;
    crumbs.push({ id: match.id, name: match.name });
    list = match.children;
  }
  return crumbs;
}

export default function LibraryManager({ initialTree }: { initialTree: CatalogNode[] }) {
  const searchParams = useSearchParams();
  // Permet au bouton "Bibliothèque" du lecteur de revenir dans le même
  // dossier (voir ReaderShell.tsx) plutôt que de toujours réinitialiser la
  // navigation à la racine.
  const initialPath = useMemo(
    () => (searchParams.get("folder") ?? "").split("/").filter(Boolean),
    [searchParams]
  );

  const [tree, setTree] = useState(initialTree);
  const [currentPath, setCurrentPath] = useState<string[]>(initialPath);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<
    { kind: "folder"; folder: CatalogFolder } | { kind: "document"; doc: CatalogDocument } | null
  >(null);

  const breadcrumb = buildBreadcrumb(tree, currentPath);
  const currentFolder = findFolder(tree, currentPath);
  const currentNodes = currentFolder ? currentFolder.children : tree;
  const folders = currentNodes.filter(isFolder);
  const documents = currentNodes.filter(isDocument);

  async function refreshTree() {
    const res = await fetch("/api/documents", { cache: "no-store" });
    const data = await res.json();
    setTree(data.tree);
  }

  async function handleCreateFolder(event: React.SubmitEvent) {
    event.preventDefault();
    const name = folderName.trim();
    if (!name) return;

    setCreatingFolder(true);
    setMessage(null);
    try {
      await apiFetch("/library/categories/", {
        method: "POST",
        body: { name, parent: currentFolder?.backendId ?? null },
      });
      setFolderName("");
      setMessage({ type: "success", text: `Dossier « ${name} » créé.` });
      await refreshTree();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Erreur inconnue." });
    } finally {
      setCreatingFolder(false);
    }
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setMessage(null);

    // Le Backend n'accepte qu'un fichier par requête (DocumentSerializer) :
    // les envois se font donc en série, avec un suivi de progression, pour
    // garder un message d'erreur clair par fichier en cas d'échec partiel.
    const succeeded: string[] = [];
    const failed: { name: string; reason: string }[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      setUploadProgress({ current: index + 1, total: files.length });
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("title", humanizeTitle(file.name));
        if (currentFolder) form.append("category", String(currentFolder.backendId));
        await apiFetch("/library/documents/", { method: "POST", body: form });
        succeeded.push(file.name);
      } catch (err) {
        failed.push({ name: file.name, reason: err instanceof ApiError ? err.message : "Erreur inconnue." });
      }
    }

    if (succeeded.length > 0) await refreshTree();
    setUploadProgress(null);
    setUploading(false);

    if (failed.length === 0) {
      setMessage({
        type: "success",
        text:
          succeeded.length === 1
            ? `Document « ${succeeded[0]} » ajouté.`
            : `${succeeded.length} documents ajoutés.`,
      });
    } else {
      const failureList = failed.map((f) => `${f.name} (${f.reason})`).join(" · ");
      setMessage({
        type: "error",
        text:
          succeeded.length > 0
            ? `${succeeded.length} document${succeeded.length > 1 ? "s" : ""} ajouté${succeeded.length > 1 ? "s" : ""}, ${failed.length} échec${failed.length > 1 ? "s" : ""} : ${failureList}`
            : `Échec de l'ajout : ${failureList}`,
      });
    }
  }

  async function confirmPendingDelete() {
    if (!pendingDelete) return;

    setMessage(null);
    try {
      if (pendingDelete.kind === "folder") {
        await apiFetch(`/library/categories/${pendingDelete.folder.backendId}/`, { method: "DELETE" });
        setMessage({ type: "success", text: `Dossier « ${pendingDelete.folder.name} » supprimé.` });
      } else {
        await apiFetch(`/library/documents/${pendingDelete.doc.backendId}/`, { method: "DELETE" });
        setMessage({ type: "success", text: `Document « ${pendingDelete.doc.title} » supprimé.` });
      }
      await refreshTree();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof ApiError ? err.message : "Erreur inconnue." });
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Bibliothèque &amp; dossiers</h2>
        <p>Ajoutez des documents ou créez des catégories directement dans le dossier affiché ci-dessous.</p>
      </div>

      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <button type="button" className="breadcrumb-item" onClick={() => setCurrentPath([])}>
          <BreadcrumbHomeIcon />
          <span>Bibliothèque</span>
        </button>
        {breadcrumb.map((crumb) => (
          <span className="breadcrumb-crumb" key={crumb.id.join("/")}>
            <ChevronIcon />
            <button type="button" className="breadcrumb-item" onClick={() => setCurrentPath(crumb.id)}>
              {crumb.name}
            </button>
          </span>
        ))}
      </nav>

      <div className="admin-actions">
        <form className="admin-inline-form" onSubmit={handleCreateFolder}>
          <input
            type="text"
            placeholder="Nom du nouveau dossier"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
          />
          <button type="submit" className="btn btn-ghost" disabled={creatingFolder || !folderName.trim()}>
            <FolderPlusIcon />
            {creatingFolder ? "Création…" : "Créer le dossier"}
          </button>
        </form>

        <label className={`btn btn-primary admin-upload-btn${uploading ? " is-disabled" : ""}`}>
          <UploadIcon />
          {uploading
            ? uploadProgress
              ? `Envoi ${uploadProgress.current}/${uploadProgress.total}…`
              : "Envoi…"
            : "Ajouter des documents"}
          <input
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleUpload}
            disabled={uploading}
            multiple
            hidden
          />
        </label>
      </div>

      {message && <p className={`admin-message admin-message-${message.type}`}>{message.text}</p>}

      {folders.length + documents.length > 0 ? (
        <div className="admin-table">
          <div className="admin-table-head">
            <span>Nom</span>
            <span>Type</span>
            <span>Taille</span>
            <span>Action</span>
          </div>

          {folders.map((folder) => {
            const itemCount = folder.children.length;
            return (
              <div className="admin-row-shell" key={folder.id.join("/")}>
                <button type="button" className="admin-table-row" onClick={() => setCurrentPath(folder.id)}>
                  <span className="admin-table-name">
                    <span className="admin-table-icon admin-table-icon-folder">
                      <FolderIcon />
                    </span>
                    {folder.name}
                  </span>
                  <span>
                    <span className="admin-badge admin-badge-folder">Dossier</span>
                  </span>
                  <span className="admin-table-muted">
                    {itemCount} élément{itemCount > 1 ? "s" : ""}
                  </span>
                  <span className="admin-table-action">
                    <span className="admin-table-gear">
                      <GearIcon />
                    </span>
                    <ChevronIcon />
                  </span>
                </button>
                <button
                  type="button"
                  className="admin-table-delete"
                  onClick={() => setPendingDelete({ kind: "folder", folder })}
                  title="Supprimer le dossier"
                  aria-label={`Supprimer le dossier ${folder.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            );
          })}

          {documents.map((doc) => (
            <div className="admin-row-shell" key={doc.id.join("/")}>
              <Link href={`/viewer/${doc.id.join("/")}?from=admin`} className="admin-table-row">
                <span className="admin-table-name">
                  <span className="admin-table-icon">
                    <FileIcon />
                  </span>
                  {doc.title}
                </span>
                <span>
                  <span className="admin-badge" data-type={doc.type}>
                    {TYPE_LABELS[doc.type]}
                  </span>
                </span>
                <span className="admin-table-muted">{formatBytes(doc.size)}</span>
                <span className="admin-table-action">
                  <span className="admin-table-gear">
                    <GearIcon />
                  </span>
                  <ChevronIcon />
                </span>
              </Link>
              <button
                type="button"
                className="admin-table-delete"
                onClick={() => setPendingDelete({ kind: "document", doc })}
                title="Supprimer le document"
                aria-label={`Supprimer ${doc.title}`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">Ce dossier est vide — ajoutez-y un document ou une catégorie.</p>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={pendingDelete.kind === "folder" ? "Supprimer ce dossier ?" : "Supprimer ce document ?"}
          message={
            pendingDelete.kind === "folder"
              ? pendingDelete.folder.children.length > 0
                ? `« ${pendingDelete.folder.name} » et tout son contenu (${pendingDelete.folder.children.length} élément${pendingDelete.folder.children.length > 1 ? "s" : ""}) seront définitivement supprimés. Cette action est irréversible.`
                : `« ${pendingDelete.folder.name} » sera définitivement supprimé. Cette action est irréversible.`
              : `« ${pendingDelete.doc.title} » sera définitivement supprimé. Cette action est irréversible.`
          }
          onConfirm={confirmPendingDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

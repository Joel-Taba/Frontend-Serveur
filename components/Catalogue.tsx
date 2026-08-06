"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CatalogNode, CatalogFolder, CatalogDocument } from "@/lib/catalog";
import type { EcosystemTool } from "@/lib/tools";
import FolderRow from "./FolderRow";
import DocumentRow from "./DocumentRow";
import ToolCard from "./ToolCard";
import { BreadcrumbHomeIcon, ChevronIcon } from "./catalogueIcons";

type Tab = "bibliotheque" | "outils";

const TABS: { id: Tab; label: string }[] = [
  { id: "bibliotheque", label: "Bibliothèque" },
  { id: "outils", label: "Nos Outils" },
];

interface Crumb {
  id: string[];
  name: string;
}

function isFolder(node: CatalogNode): node is CatalogFolder {
  return node.kind === "folder";
}

function isDocument(node: CatalogNode): node is CatalogDocument {
  return node.kind === "document";
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

export default function Catalogue({ tree, tools }: { tree: CatalogNode[]; tools: EcosystemTool[] }) {
  const searchParams = useSearchParams();
  // Permet au bouton "Catalogue" du lecteur de revenir au dossier d'origine
  // du document (voir ReaderShell.tsx : /?folder=primaire/sil#catalogue)
  // plutôt que de toujours réinitialiser la navigation à la racine.
  const initialPath = useMemo(
    () => (searchParams.get("folder") ?? "").split("/").filter(Boolean),
    [searchParams]
  );

  const [activeTab, setActiveTab] = useState<Tab>("bibliotheque");
  const [currentPath, setCurrentPath] = useState<string[]>(initialPath);

  const breadcrumb = useMemo(() => buildBreadcrumb(tree, currentPath), [tree, currentPath]);
  const currentFolder = useMemo(() => findFolder(tree, currentPath), [tree, currentPath]);
  const currentNodes = currentFolder ? currentFolder.children : tree;

  const folders = currentNodes.filter(isFolder);
  const documents = currentNodes.filter(isDocument);
  const totalCount = folders.length + documents.length;
  const showLibrary = activeTab === "bibliotheque";

  return (
    <section id="catalogue" className="section">
      <div className="catalogue-panel">
        <p className="eyebrow">Contenus</p>
        <h2> Notre Écosystème</h2>
        <p>Parcourez les cours par niveau ou découvrez tous les outils de notre écosystème.</p>

        <div className="section-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`section-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {showLibrary ? (
          <>
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

            <div className="doc-count">{totalCount > 0 && `${totalCount} élément${totalCount > 1 ? "s" : ""}`}</div>

            {totalCount > 0 ? (
              <div className="list">
                {folders.map((folder) => (
                  <FolderRow key={folder.id.join("/")} folder={folder} onOpen={() => setCurrentPath(folder.id)} />
                ))}
                {documents.map((doc) => (
                  <DocumentRow key={doc.id.join("/")} doc={doc} />
                ))}
              </div>
            ) : (
              <p className="empty-state">Ce dossier est vide.</p>
            )}
          </>
        ) : (
          <>
            <p className="doc-count">
              {tools.length} outil{tools.length > 1 ? "s" : ""} de notre écosystème
            </p>
            {tools.length > 0 ? (
              <div className="tools-grid">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="empty-state">Aucun outil à présenter pour le moment.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

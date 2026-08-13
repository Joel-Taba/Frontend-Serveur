"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CatalogNode, CatalogFolder, CatalogDocument } from "@/lib/catalog";
import type { EcosystemTool } from "@/lib/tools";
import FolderRow from "./FolderRow";
import DocumentRow from "./DocumentRow";
import ToolCard from "./ToolCard";
import { BreadcrumbHomeIcon, ChevronIcon } from "./catalogueIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { getCountryLabel, getCountryRootPath } from "@/lib/countries";

type Tab = "bibliotheque" | "outils";

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
  const { t } = useLanguage();
  const { user } = useAuth();
  const TABS: { id: Tab; label: string }[] = [
    { id: "bibliotheque", label: t.catalogue.tabLibrary },
    { id: "outils", label: t.catalogue.tabTools },
  ];

  // Un compte utilisateur (pas gestionnaire) avec un pays précis (pas "Tous
  // les pays") ne voit que le dossier de son pays — voir lib/countries.ts.
  // La navigation continue de chercher dans `tree` (l'arbre complet, jamais
  // réécrit) : seul le point de départ ("racine affichée") est ancré sur ce
  // dossier, pour que les identifiants réels des sous-dossiers/documents
  // (["senegal", "primaire"], utilisés pour la résolution côté Backend)
  // restent valides tout du long.
  const countryFilter = user && user.role !== "manager" ? user.country : null;
  const countryRootPath = useMemo(() => getCountryRootPath(countryFilter), [countryFilter]);
  // Remplace le libellé générique "Bibliothèque" par le nom du pays quand la
  // bibliothèque est filtrée, pour qu'on sache directement de quel pays
  // vient le contenu affiché.
  const rootLabel = getCountryLabel(t, countryFilter) ?? t.catalogue.breadcrumbRoot;

  const searchParams = useSearchParams();
  const initialPath = useMemo(
    () => (searchParams.get("folder") ?? "").split("/").filter(Boolean),
    [searchParams]
  );

  const [activeTab, setActiveTab] = useState<Tab>("bibliotheque");
  const [currentPath, setCurrentPath] = useState<string[]>(initialPath);

  // La session (et donc le pays) se résout de façon asynchrone après le
  // premier rendu (jeton en sessionStorage, illisible côté serveur) : ce
  // n'est qu'à ce moment que `countryRootPath` prend sa vraie valeur. On
  // recale alors la navigation dessus — sauf si l'utilisateur est arrivé
  // via un lien direct (?folder=, retour du lecteur), dans quel cas on ne
  // touche à rien à ce premier passage. Un changement ultérieur (pays
  // modifié depuis la page profil) recale à nouveau, cette fois toujours.
  const hasAppliedInitialCountryRoot = useRef(false);
  useEffect(() => {
    if (!hasAppliedInitialCountryRoot.current) {
      hasAppliedInitialCountryRoot.current = true;
      if (initialPath.length === 0 && countryRootPath.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPath(countryRootPath);
      }
      return;
    }
    setCurrentPath(countryRootPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryRootPath]);

  const breadcrumbFull = useMemo(() => buildBreadcrumb(tree, currentPath), [tree, currentPath]);
  const breadcrumb = useMemo(
    () => breadcrumbFull.slice(countryRootPath.length),
    [breadcrumbFull, countryRootPath]
  );
  const currentFolder = useMemo(() => findFolder(tree, currentPath), [tree, currentPath]);
  const currentNodes = currentFolder ? currentFolder.children : tree;

  const folders = currentNodes.filter(isFolder);
  const documents = currentNodes.filter(isDocument);
  const totalCount = folders.length + documents.length;
  const showLibrary = activeTab === "bibliotheque";

  return (
    <section id="catalogue" className="section">
      <div className="catalogue-panel">
        <p className="eyebrow">{t.catalogue.eyebrow}</p>
        <h2>{t.catalogue.heading}</h2>
        <p>{t.catalogue.subtitle}</p>

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
            <nav className="breadcrumb" aria-label={t.catalogue.breadcrumbAriaLabel}>
              <button type="button" className="breadcrumb-item" onClick={() => setCurrentPath(countryRootPath)}>
                <BreadcrumbHomeIcon />
                <span>{rootLabel}</span>
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

            <div className="doc-count">{totalCount > 0 && t.catalogue.itemsCount(totalCount)}</div>

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
              <p className="empty-state">{t.catalogue.emptyFolder}</p>
            )}
          </>
        ) : (
          <>
            <p className="doc-count">{t.catalogue.toolsCount(tools.length)}</p>
            {tools.length > 0 ? (
              <div className="tools-grid">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="empty-state">{t.catalogue.noTools}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

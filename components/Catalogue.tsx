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

type Tab = "bibliotheque" | "alphabetisation" | "outils";

// Dossier racine réservé à son propre onglet : retiré de l'arbre affiché
// dans "Bibliothèque" (voir libraryTree ci-dessous), il n'apparaît donc
// nulle part ailleurs que dans l'onglet "Alphabétisation".
const ALPHABETISATION_SLUG = "alphabetisation";
const ALPHABETISATION_ROOT_PATH = [ALPHABETISATION_SLUG];

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
    { id: "alphabetisation", label: t.catalogue.tabAlphabetisation },
    { id: "outils", label: t.catalogue.tabTools },
  ];

  // Dossier "Alphabétisation" : retiré de l'arbre de la Bibliothèque et
  // navigable uniquement dans son propre onglet — voir ALPHABETISATION_SLUG.
  const libraryTree = useMemo(
    () => tree.filter((node) => !(isFolder(node) && node.id.length === 1 && node.id[0] === ALPHABETISATION_SLUG)),
    [tree]
  );

  // Un compte utilisateur (pas gestionnaire) avec un pays précis (pas "Tous
  // les pays") ne voit que le dossier de son pays — voir lib/countries.ts.
  // La navigation continue de chercher dans `libraryTree` (jamais réécrit) :
  // seul le point de départ ("racine affichée") est ancré sur ce dossier,
  // pour que les identifiants réels des sous-dossiers/documents
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
  const startsInAlphabetisation = initialPath[0] === ALPHABETISATION_SLUG;

  const [activeTab, setActiveTab] = useState<Tab>(startsInAlphabetisation ? "alphabetisation" : "bibliotheque");
  const [currentPath, setCurrentPath] = useState<string[]>(startsInAlphabetisation ? [] : initialPath);
  // Comme countryRootPath : la navigation cherche dans `tree` (l'arbre
  // complet, jamais réécrit), ancrée sur ["alphabetisation"] — sinon un
  // sous-dossier comme ["alphabetisation", "test"] ne se retrouve plus une
  // fois la racine "affichée" limitée au seul contenu de ce dossier.
  const [alphaCurrentPath, setAlphaCurrentPath] = useState<string[]>(
    startsInAlphabetisation ? initialPath : ALPHABETISATION_ROOT_PATH
  );

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

  const breadcrumbFull = useMemo(() => buildBreadcrumb(libraryTree, currentPath), [libraryTree, currentPath]);
  const breadcrumb = useMemo(
    () => breadcrumbFull.slice(countryRootPath.length),
    [breadcrumbFull, countryRootPath]
  );
  const currentFolder = useMemo(() => findFolder(libraryTree, currentPath), [libraryTree, currentPath]);
  const currentNodes = currentFolder ? currentFolder.children : libraryTree;

  const folders = currentNodes.filter(isFolder);
  const documents = currentNodes.filter(isDocument);
  const totalCount = folders.length + documents.length;

  // Onglet Alphabétisation : navigation indépendante, non filtrée par pays.
  const alphaBreadcrumbFull = useMemo(() => buildBreadcrumb(tree, alphaCurrentPath), [tree, alphaCurrentPath]);
  const alphaBreadcrumb = useMemo(() => alphaBreadcrumbFull.slice(1), [alphaBreadcrumbFull]);
  const alphaCurrentFolder = useMemo(() => findFolder(tree, alphaCurrentPath), [tree, alphaCurrentPath]);
  const alphaCurrentNodes = alphaCurrentFolder ? alphaCurrentFolder.children : [];
  const alphaFolders = alphaCurrentNodes.filter(isFolder);
  const alphaDocuments = alphaCurrentNodes.filter(isDocument);
  const alphaTotalCount = alphaFolders.length + alphaDocuments.length;

  const showLibrary = activeTab === "bibliotheque";
  const showAlphabetisation = activeTab === "alphabetisation";

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
        ) : showAlphabetisation ? (
          <>
            <nav className="breadcrumb" aria-label={t.catalogue.breadcrumbAriaLabel}>
              <button
                type="button"
                className="breadcrumb-item"
                onClick={() => setAlphaCurrentPath(ALPHABETISATION_ROOT_PATH)}
              >
                <BreadcrumbHomeIcon />
                <span>{t.catalogue.tabAlphabetisation}</span>
              </button>
              {alphaBreadcrumb.map((crumb) => (
                <span className="breadcrumb-crumb" key={crumb.id.join("/")}>
                  <ChevronIcon />
                  <button type="button" className="breadcrumb-item" onClick={() => setAlphaCurrentPath(crumb.id)}>
                    {crumb.name}
                  </button>
                </span>
              ))}
            </nav>

            <div className="doc-count">{alphaTotalCount > 0 && t.catalogue.itemsCount(alphaTotalCount)}</div>

            {alphaTotalCount > 0 ? (
              <div className="list">
                {alphaFolders.map((folder) => (
                  <FolderRow key={folder.id.join("/")} folder={folder} onOpen={() => setAlphaCurrentPath(folder.id)} />
                ))}
                {alphaDocuments.map((doc) => (
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

"use client";

import type { CatalogFolder } from "@/lib/catalog";
import { FolderIcon, ChevronIcon } from "./catalogueIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FolderRow({ folder, onOpen }: { folder: CatalogFolder; onOpen: () => void }) {
  const { t } = useLanguage();
  const folders = folder.children.filter((c) => c.kind === "folder").length;
  const documents = folder.children.filter((c) => c.kind === "document").length;
  const summary = t.catalogue.folderCount(folders, documents);

  return (
    <button type="button" className="list-row list-row-folder" onClick={onOpen}>
      <span className="list-row-icon list-row-icon-folder">
        <FolderIcon />
      </span>
      <span className="list-row-body">
        <span className="list-row-title">{folder.name}</span>
        <span className="list-row-subtitle">{summary || t.catalogue.folderEmpty}</span>
      </span>
      <span className="list-row-chevron" aria-hidden="true">
        <ChevronIcon />
      </span>
    </button>
  );
}

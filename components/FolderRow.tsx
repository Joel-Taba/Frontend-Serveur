import type { CatalogFolder } from "@/lib/catalog";
import { FolderIcon, ChevronIcon } from "./catalogueIcons";

export default function FolderRow({ folder, onOpen }: { folder: CatalogFolder; onOpen: () => void }) {
  const folders = folder.children.filter((c) => c.kind === "folder").length;
  const documents = folder.children.filter((c) => c.kind === "document").length;
  const parts: string[] = [];
  if (folders) parts.push(`${folders} dossier${folders > 1 ? "s" : ""}`);
  if (documents) parts.push(`${documents} document${documents > 1 ? "s" : ""}`);

  return (
    <button type="button" className="list-row list-row-folder" onClick={onOpen}>
      <span className="list-row-icon list-row-icon-folder">
        <FolderIcon />
      </span>
      <span className="list-row-body">
        <span className="list-row-title">{folder.name}</span>
        <span className="list-row-subtitle">{parts.length ? parts.join(" · ") : "Vide"}</span>
      </span>
      <span className="list-row-chevron" aria-hidden="true">
        <ChevronIcon />
      </span>
    </button>
  );
}

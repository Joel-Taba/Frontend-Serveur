import type { ReactNode, RefObject } from "react";
import type { CatalogDocument } from "@/lib/catalog";

export interface ReaderProps {
  doc: CatalogDocument;
  fileUrl: string;
  onToolbar: (node: ReactNode) => void;
  onProgress: (ratio: number) => void;
  onSidebar: (node: ReactNode) => void;
  stageRef: RefObject<HTMLElement | null>;
}

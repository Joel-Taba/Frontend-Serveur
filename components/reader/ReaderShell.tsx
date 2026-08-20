"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CatalogDocument, DocumentType } from "@/lib/catalog";
import { useAuth } from "@/lib/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import ChatWidget from "@/components/chat/ChatWidget";
import { BackIcon } from "./icons";
import RatingDialog from "./RatingDialog";

const PdfReader = dynamic(() => import("./PdfReader"), { ssr: false });
const ImageReader = dynamic(() => import("./ImageReader"), { ssr: false });
const EpubReader = dynamic(() => import("./EpubReader"), { ssr: false });
const JsonReader = dynamic(() => import("./JsonReader"), { ssr: false });
const VideoReader = dynamic(() => import("./VideoReader"), { ssr: false });

const TYPE_LABELS: Record<DocumentType, string> = {
  pdf: "PDF",
  image: "Image",
  epub: "EPUB",
  json: "JSON",
  video: "Vidéo",
};

export default function ReaderShell({ doc }: { doc: CatalogDocument }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [toolbar, setToolbar] = useState<ReactNode>(null);
  const [progress, setProgress] = useState(0);
  const [sidebar, setSidebar] = useState<ReactNode>(null);
  const [showRating, setShowRating] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const fileUrl = `/api/file/${doc.id.join("/")}`;

  // Ramène au dossier qui contient ce document plutôt qu'à la racine —
  // c'est là que l'utilisateur se trouvait avant d'ouvrir le lecteur, qu'il
  // soit arrivé en parcourant les dossiers ou via la recherche. Un document
  // ouvert depuis l'espace gestionnaire (LibraryManager.tsx, ?from=admin)
  // doit revenir dans CET espace plutôt que sur le site vitrine.
  const fromAdmin = searchParams.get("from") === "admin";
  const parentFolderPath = doc.id.slice(0, -1);
  const backLabel = fromAdmin ? "Bibliothèque" : "Catalogue";
  const backHref = fromAdmin
    ? parentFolderPath.length > 0
      ? `/admin?section=bibliotheque&folder=${parentFolderPath.join("/")}`
      : "/admin?section=bibliotheque"
    : parentFolderPath.length > 0
      ? `/?folder=${parentFolderPath.join("/")}#catalogue`
      : "/#catalogue";

  // La pop-up de notation n'est proposée qu'aux simples utilisateurs (pas
  // aux gestionnaires) en quittant le lecteur — voir DocumentRateView côté
  // Backend, qui refuse de toute façon la notation à un compte gestionnaire.
  const canRate = user?.role === "user";

  function handleBackClick(event: React.MouseEvent) {
    if (canRate) {
      event.preventDefault();
      setShowRating(true);
    }
  }

  function handleRatingDone() {
    setShowRating(false);
    router.push(backHref);
  }

  useEffect(() => {
    document.title = `${doc.title} — Flores Gong Nota`;
  }, [doc.title]);

  // Protections anti-copie de base.
  useEffect(() => {
    const preventContext = (event: MouseEvent) => event.preventDefault();
    const preventDrag = (event: DragEvent) => event.preventDefault();
    const preventShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blocked = (event.ctrlKey || event.metaKey) && ["s", "p", "u"].includes(key);
      if (blocked) event.preventDefault();
    };
    document.addEventListener("contextmenu", preventContext);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("keydown", preventShortcuts);
    return () => {
      document.removeEventListener("contextmenu", preventContext);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("keydown", preventShortcuts);
    };
  }, []);

  const readerProps = {
    doc,
    fileUrl,
    onToolbar: setToolbar,
    onProgress: setProgress,
    onSidebar: setSidebar,
    stageRef,
  };

  return (
    <div className="viewer-body" data-type={doc.type}>
      <header className="viewer-header">
        <Link className="viewer-back" href={backHref} onClick={handleBackClick}>
          <BackIcon />
          <span>{backLabel}</span>
        </Link>
        <div className="viewer-title-wrap">
          <span className="viewer-type-tag">{TYPE_LABELS[doc.type]}</span>
          <h1 className="viewer-title">{doc.title}</h1>
        </div>
        <div className="viewer-tools">{toolbar}</div>
        <ThemeToggle />
      </header>

      <div className="viewer-progress">
        <div className="viewer-progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="viewer-body-main">
        {sidebar && <aside className="viewer-sidebar">{sidebar}</aside>}
        <main className="viewer-stage" ref={stageRef}>
          {doc.type === "pdf" && <PdfReader {...readerProps} />}
          {doc.type === "image" && <ImageReader {...readerProps} />}
          {doc.type === "epub" && <EpubReader {...readerProps} />}
          {doc.type === "json" && <JsonReader {...readerProps} />}
          {doc.type === "video" && <VideoReader {...readerProps} />}
        </main>
      </div>

      <div className="viewer-watermark" aria-hidden="true">
        FLORES GONG NOTA — LECTURE SEULE
      </div>

      {showRating && <RatingDialog doc={doc} onDone={handleRatingDone} />}

      <ChatWidget />
    </div>
  );
}

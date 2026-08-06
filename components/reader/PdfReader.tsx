"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { authHeaders } from "@/lib/api";
import { ZoomOutIcon, ZoomInIcon, PrevIcon, NextIcon, SidebarIcon, SpreadIcon } from "./icons";
import FullscreenButton from "./FullscreenButton";
import type { ReaderProps } from "./types";

// pdfjs-dist 5.x s'appuie sur Map.prototype.getOrInsertComputed, une méthode
// standardisée trop récente pour être disponible dans tous les navigateurs :
// sans ce correctif, le chargement du PDF échoue silencieusement. Le worker
// PDF tourne dans sa propre réalité JS (un Worker séparé) : on lui injecte
// le même correctif en le préfixant au code du worker via un Blob, plutôt
// que de pointer directement vers le fichier de pdfjs-dist.
type MapWithUpsert = typeof Map.prototype & {
  getOrInsertComputed?: (key: unknown, callback: (key: unknown) => unknown) => unknown;
};

if (!(Map.prototype as MapWithUpsert).getOrInsertComputed) {
  (Map.prototype as MapWithUpsert).getOrInsertComputed = function (
    this: Map<unknown, unknown>,
    key: unknown,
    callback: (key: unknown) => unknown
  ) {
    if (!this.has(key)) this.set(key, callback(key));
    return this.get(key);
  };
}

const MAP_POLYFILL_SRC =
  "if(!Map.prototype.getOrInsertComputed){Map.prototype.getOrInsertComputed=function(k,c){if(!this.has(k))this.set(k,c(k));return this.get(k);};}";
const RAW_WORKER_URL = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
let patchedWorkerSrcPromise: Promise<string> | null = null;

function getPatchedWorkerSrc(): Promise<string> {
  patchedWorkerSrcPromise ??= fetch(RAW_WORKER_URL)
    .then((res) => res.text())
    .then((source) => URL.createObjectURL(new Blob([MAP_POLYFILL_SRC, source], { type: "text/javascript" })));
  return patchedWorkerSrcPromise;
}

type Status = "loading" | "ready" | "error";
type PageSize = { width: number; height: number };

export default function PdfReader({ doc, fileUrl, onToolbar, onProgress, onSidebar, stageRef }: ReaderProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(2.1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [doublePage, setDoublePage] = useState(false);
  const [baseSize, setBaseSize] = useState<PageSize | null>(null);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const gotoInputRef = useRef<HTMLInputElement>(null);
  const isFirstScaleRun = useRef(true);
  const docIdPath = doc.id.join("/");

  function goToPage(page: number) {
    if (!numPages) return;
    const target = Math.min(Math.max(1, page), numPages);
    pageRefs.current.get(target)?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  // Charge le document et récupère le format de la première page : cette
  // taille sert de gabarit pour dimensionner les placeholders des pages pas
  // encore rendues, afin d'éviter tout saut de mise en page au défilement.
  useEffect(() => {
    let cancelled = false;

    getPatchedWorkerSrc()
      .then((workerSrc) => {
        if (cancelled) return null;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        return pdfjsLib.getDocument({ url: fileUrl, httpHeaders: authHeaders() }).promise;
      })
      .then(async (pdf) => {
        if (cancelled || !pdf) return;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        const firstPage = await pdf.getPage(1);
        if (cancelled) return;
        const viewport = firstPage.getViewport({ scale: 1 });
        setBaseSize({ width: viewport.width, height: viewport.height });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  // Observe les pages montées : déclenche leur rendu quand elles approchent
  // du viewport et détermine la page "courante" (celle la plus visible) sans
  // jamais faire défiler la zone de lecture depuis l'extérieur.
  useEffect(() => {
    if (status !== "ready" || !numPages || !stageRef.current) return;
    const root = stageRef.current;
    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        const newlyVisible: number[] = [];
        for (const entry of entries) {
          const pageNumber = Number((entry.target as HTMLElement).dataset.page);
          ratios.set(pageNumber, entry.isIntersecting ? entry.intersectionRatio : 0);
          if (entry.isIntersecting) newlyVisible.push(pageNumber);
        }
        if (newlyVisible.length) {
          setRenderedPages((prev) => {
            const merged = new Set(prev);
            let changed = false;
            for (const p of newlyVisible) {
              if (!merged.has(p)) {
                merged.add(p);
                changed = true;
              }
            }
            return changed ? merged : prev;
          });
        }
        let best = 0;
        let bestRatio = 0;
        for (const [page, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = page;
          }
        }
        if (best) setCurrentPage(best);
      },
      { root, rootMargin: "600px 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    pageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [status, numPages, doublePage, stageRef]);

  // Recadre sur la page en cours après un changement de zoom ou de mode
  // d'affichage, puisque le redimensionnement des pages précédentes décale
  // sinon la position de lecture.
  useEffect(() => {
    if (isFirstScaleRun.current) {
      isFirstScaleRun.current = false;
      return;
    }
    pageRefs.current.get(currentPage)?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  useEffect(() => {
    pageRefs.current.get(currentPage)?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doublePage]);

  useEffect(() => {
    onProgress(numPages ? currentPage / numPages : 0);
  }, [currentPage, numPages, onProgress]);

  useEffect(() => {
    onToolbar(
      <>
        <button type="button" title="Zoom arrière" onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}>
          <ZoomOutIcon />
        </button>
        <span className="tool-indicator">{Math.round(scale * 100)}%</span>
        <button type="button" title="Zoom avant" onClick={() => setScale((s) => Math.min(s + 0.2, 3))}>
          <ZoomInIcon />
        </button>
        <span className="tool-sep" />
        <button
          type="button"
          title="Page précédente"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - (doublePage ? 2 : 1))}
        >
          <PrevIcon />
        </button>
        <span className="tool-indicator">
          {currentPage} / {numPages}
        </span>
        <button
          type="button"
          title="Page suivante"
          disabled={currentPage >= numPages}
          onClick={() => goToPage(currentPage + (doublePage ? 2 : 1))}
        >
          <NextIcon />
        </button>
        <span className="tool-sep" />
        <button
          type="button"
          title={doublePage ? "Page simple" : "Double page"}
          className={doublePage ? "tool-active" : undefined}
          onClick={() => setDoublePage((v) => !v)}
        >
          <SpreadIcon />
        </button>
        <span className="tool-sep" />
        <button
          type="button"
          title={sidebarOpen ? "Masquer les pages" : "Afficher les pages"}
          className={sidebarOpen ? "tool-active" : undefined}
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <SidebarIcon />
        </button>
        <FullscreenButton />
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, currentPage, numPages, sidebarOpen, doublePage, onToolbar]);

  useEffect(() => {
    if (!sidebarOpen || status !== "ready" || !numPages) {
      onSidebar(null);
      return;
    }
    const pages = Array.from({ length: numPages }, (_, i) => i + 1);
    onSidebar(
      <>
        <form
          className="sidebar-goto"
          onSubmit={(event) => {
            event.preventDefault();
            const value = parseInt(gotoInputRef.current?.value ?? "", 10);
            if (!Number.isNaN(value)) goToPage(value);
          }}
        >
          <span>Page</span>
          <input
            ref={gotoInputRef}
            type="number"
            min={1}
            max={numPages}
            defaultValue={currentPage}
            aria-label="Aller à la page"
          />
          <span className="sidebar-goto-total">/ {numPages}</span>
        </form>
        <div className="sidebar-pages">
          {pages.map((p) => (
            <button key={p} type="button" className="sidebar-page" data-page={p} onClick={() => goToPage(p)}>
              <span className="sidebar-page-thumb">
                <img src={`/api/thumbnail/${docIdPath}?page=${p}`} alt="" loading="lazy" />
              </span>
              <span className="sidebar-page-number">{p}</span>
            </button>
          ))}
        </div>
      </>
    );
    // La liste de miniatures ne dépend volontairement pas de currentPage :
    // en défilement continu, currentPage change à chaque page croisée par le
    // scroll, et régénérer les centaines de vignettes à ce rythme les rendait
    // hachées voire invisibles. Le surlignage de la page active est géré à
    // part, directement sur le DOM (effet suivant).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarOpen, status, numPages, docIdPath, onSidebar]);

  useEffect(() => {
    if (!sidebarOpen) return;
    document.querySelector(".sidebar-page.active")?.classList.remove("active");
    const active = document.querySelector(`.sidebar-page[data-page="${currentPage}"]`);
    active?.classList.add("active");
    active?.scrollIntoView({ block: "nearest" });
    if (gotoInputRef.current && document.activeElement !== gotoInputRef.current) {
      gotoInputRef.current.value = String(currentPage);
    }
  }, [currentPage, sidebarOpen]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (status !== "ready") return;
      const step = doublePage ? 2 : 1;
      if (event.key === "ArrowRight") goToPage(currentPage + step);
      if (event.key === "ArrowLeft") goToPage(currentPage - step);
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, numPages, currentPage, doublePage]);

  useEffect(() => {
    return () => onSidebar(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") return <p className="viewer-status">Chargement du document…</p>;
  if (status === "error") return <p className="viewer-status">Impossible de charger ce PDF.</p>;
  if (!pdfDoc || !baseSize) return null;

  const pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1);
  const rows = doublePage
    ? pageNumbers.reduce<number[][]>((acc, p, i) => {
        if (i % 2 === 0) acc.push([p]);
        else acc[acc.length - 1].push(p);
        return acc;
      }, [])
    : pageNumbers.map((p) => [p]);

  return (
    <div className="pdf-pages">
      {rows.map((row) => (
        <div className="pdf-page-row" key={row[0]}>
          {row.map((pageNumber) => (
            <PdfPage
              key={pageNumber}
              pdfDoc={pdfDoc}
              pageNumber={pageNumber}
              scale={scale}
              baseSize={baseSize}
              visible={renderedPages.has(pageNumber)}
              registerRef={(node) => {
                if (node) pageRefs.current.set(pageNumber, node);
                else pageRefs.current.delete(pageNumber);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PdfPage({
  pdfDoc,
  pageNumber,
  scale,
  baseSize,
  visible,
  registerRef,
}: {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  baseSize: PageSize;
  visible: boolean;
  registerRef: (node: HTMLDivElement | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let renderTask: RenderTask | null = null;

    pdfDoc.getPage(pageNumber).then((page) => {
      if (cancelled) return;
      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      renderTask = page.render({ canvas, canvasContext: ctx, viewport });
      renderTask.promise.catch(() => {});
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [visible, pdfDoc, pageNumber, scale]);

  const width = baseSize.width * scale;
  const height = baseSize.height * scale;

  return (
    <div className="pdf-page" data-page={pageNumber} ref={registerRef} style={{ width, height }}>
      {visible ? <canvas ref={canvasRef} /> : <div className="pdf-page-placeholder" style={{ width, height }} />}
    </div>
  );
}

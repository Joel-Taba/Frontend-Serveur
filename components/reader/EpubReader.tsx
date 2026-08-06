"use client";

import { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import type Rendition from "epubjs/types/rendition";
import { authHeaders } from "@/lib/api";
import { FontDownIcon, FontUpIcon, PrevIcon, NextIcon } from "./icons";
import FullscreenButton from "./FullscreenButton";
import type { ReaderProps } from "./types";

type Status = "loading" | "ready" | "error";

export default function EpubReader({ fileUrl, onToolbar, onProgress }: ReaderProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [fontSize, setFontSize] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(fileUrl, { headers: authHeaders() })
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (cancelled || !containerRef.current) return;
        const book = ePub(buffer);
        const rendition = book.renderTo(containerRef.current, {
          width: "100%",
          height: "100%",
          allowScriptedContent: false,
        });
        renditionRef.current = rendition;
        rendition.themes.default({
          body: { background: "#fbf3e3 !important", color: "#2a2114 !important" },
        });
        rendition.on("relocated", (location: { start: { percentage: number } }) => {
          onProgress(location.start.percentage || 0);
        });
        return rendition.display().then(() => {
          if (!cancelled) setStatus("ready");
        });
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      renditionRef.current?.destroy();
      renditionRef.current = null;
    };
  }, [fileUrl, onProgress]);

  useEffect(() => {
    onToolbar(
      <>
        <button
          type="button"
          title="Réduire le texte"
          onClick={() =>
            setFontSize((size) => {
              const next = Math.max(70, size - 10);
              renditionRef.current?.themes.fontSize(`${next}%`);
              return next;
            })
          }
        >
          <FontDownIcon />
        </button>
        <span className="tool-indicator">{fontSize}%</span>
        <button
          type="button"
          title="Agrandir le texte"
          onClick={() =>
            setFontSize((size) => {
              const next = Math.min(160, size + 10);
              renditionRef.current?.themes.fontSize(`${next}%`);
              return next;
            })
          }
        >
          <FontUpIcon />
        </button>
        <span className="tool-sep" />
        <button type="button" title="Page précédente" onClick={() => renditionRef.current?.prev()}>
          <PrevIcon />
        </button>
        <button type="button" title="Page suivante" onClick={() => renditionRef.current?.next()}>
          <NextIcon />
        </button>
        <span className="tool-sep" />
        <FullscreenButton />
      </>
    );
  }, [fontSize, onToolbar]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") renditionRef.current?.next();
      if (event.key === "ArrowLeft") renditionRef.current?.prev();
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <>
      {status === "loading" && <p className="viewer-status">Chargement du document…</p>}
      {status === "error" && <p className="viewer-status">Impossible de charger cet EPUB.</p>}
      <div id="epub-container" ref={containerRef} style={{ display: status === "ready" ? "block" : "none" }} />
    </>
  );
}

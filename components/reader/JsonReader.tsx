"use client";

import { useEffect, useState } from "react";
import { authHeaders } from "@/lib/api";
import { highlightJson } from "@/lib/highlightJson";
import FullscreenButton from "./FullscreenButton";
import type { ReaderProps } from "./types";

type Status = "loading" | "ready" | "error";

export default function JsonReader({ doc, fileUrl, onToolbar, onProgress, stageRef }: ReaderProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [html, setHtml] = useState("");
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(fileUrl, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const text = JSON.stringify(data, null, 2);
        setLineCount(text.split("\n").length);
        setHtml(highlightJson(data));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  useEffect(() => {
    onToolbar(<FullscreenButton />);
  }, [onToolbar]);

  useEffect(() => {
    const stage = stageRef.current;
    if (status !== "ready" || !stage) return;
    onProgress(0);
    function handleScroll() {
      if (!stage) return;
      const max = stage.scrollHeight - stage.clientHeight;
      onProgress(max > 0 ? stage.scrollTop / max : 1);
    }
    stage.addEventListener("scroll", handleScroll);
    return () => stage.removeEventListener("scroll", handleScroll);
  }, [status, stageRef, onProgress]);

  if (status === "loading") return <p className="viewer-status">Chargement du document…</p>;
  if (status === "error") return <p className="viewer-status">Impossible de charger ce document JSON.</p>;

  return (
    <div className="json-panel">
      <div className="json-panel-header">
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="name">{doc.title}.json</span>
        <span className="lines">{lineCount} lignes</span>
      </div>
      <pre className="json-view" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

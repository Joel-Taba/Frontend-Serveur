"use client";

import { useEffect, useRef, useState } from "react";
import { authHeaders } from "@/lib/api";
import { ZoomOutIcon, ZoomInIcon } from "./icons";
import FullscreenButton from "./FullscreenButton";
import type { ReaderProps } from "./types";

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.5;

export default function ImageReader({ doc, fileUrl, onToolbar, onProgress }: ReaderProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  // Taille "à l'échelle" (avant zoom) capturée au premier zoom avant, pour
  // dériver la largeur explicite à appliquer sans dupliquer la logique
  // d'ajustement de object-fit: contain en JS.
  const [baseSize, setBaseSize] = useState<{ width: number; height: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;

    fetch(fileUrl, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("download-failed");
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setObjectUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [fileUrl]);

  function zoomBy(delta: number) {
    if (scale === 1 && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setBaseSize({ width: rect.width, height: rect.height });
    }
    setScale((current) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, +(current + delta).toFixed(2))));
  }

  useEffect(() => {
    onToolbar(
      <>
        <button type="button" title="Zoom arrière" onClick={() => zoomBy(-SCALE_STEP)} disabled={scale <= MIN_SCALE}>
          <ZoomOutIcon />
        </button>
        <span className="tool-indicator">{Math.round(scale * 100)}%</span>
        <button type="button" title="Zoom avant" onClick={() => zoomBy(SCALE_STEP)} disabled={scale >= MAX_SCALE}>
          <ZoomInIcon />
        </button>
        <span className="tool-sep" />
        <FullscreenButton />
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, onToolbar]);

  if (error) return <p className="viewer-status">Impossible de charger cette image.</p>;
  if (!objectUrl) return <p className="viewer-status">Chargement du document…</p>;

  const zoomed = scale > 1 && baseSize;

  return (
    <>
      <div className="image-frame" data-zoomed={Boolean(zoomed)}>
        <img
          ref={imgRef}
          className="image-frame-img"
          src={objectUrl}
          alt={doc.title}
          draggable={false}
          onLoad={() => onProgress(1)}
          style={zoomed ? { width: baseSize.width * scale, height: "auto" } : undefined}
        />
      </div>
      <p className="image-caption">{doc.title}</p>
    </>
  );
}

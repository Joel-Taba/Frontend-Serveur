"use client";

import { useEffect, useRef, useState } from "react";
import { authHeaders } from "@/lib/api";
import { ZoomOutIcon, ZoomInIcon } from "./icons";
import FullscreenButton from "./FullscreenButton";
import type { ReaderProps } from "./types";

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.5;
// Comme le lecteur PDF (zoom par défaut > 100%) : une image s'ouvre déjà
// zoomée à 200%, centrée, plutôt qu'affichée en entier (contain) au clic.
const DEFAULT_SCALE = 2;

export default function ImageReader({ doc, fileUrl, onToolbar, onProgress }: ReaderProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  // Taille "à l'échelle" (avant zoom, object-fit: contain) capturée au
  // chargement de l'image, pour dériver la largeur explicite à appliquer
  // sans dupliquer la logique d'ajustement en JS.
  const [baseSize, setBaseSize] = useState<{ width: number; height: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;

    setScale(DEFAULT_SCALE);
    setBaseSize(null);
    hasCenteredRef.current = false;

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

  function handleImageLoad() {
    // Mesuré avant que le style de zoom ne s'applique (baseSize encore
    // `null` au premier rendu) : c'est bien la taille "contain" naturelle.
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setBaseSize({ width: rect.width, height: rect.height });
    }
    onProgress(1);
  }

  function zoomBy(delta: number) {
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

  const zoomed = scale > 1 && baseSize;

  // Centre le cadre sur l'image dès le premier affichage zoomé (par défaut
  // à 200%) : sans ça, le cadre reste ancré en haut à gauche et ne montre
  // qu'un coin de l'image. Une seule fois par document — un zoom manuel
  // ultérieur ne doit pas reforcer le recentrage et défaire le panoramique
  // de l'utilisateur.
  useEffect(() => {
    if (!zoomed || hasCenteredRef.current || !frameRef.current) return;
    hasCenteredRef.current = true;
    const frame = frameRef.current;
    frame.scrollLeft = (frame.scrollWidth - frame.clientWidth) / 2;
    frame.scrollTop = (frame.scrollHeight - frame.clientHeight) / 2;
  }, [zoomed]);

  if (error) return <p className="viewer-status">Impossible de charger cette image.</p>;
  if (!objectUrl) return <p className="viewer-status">Chargement du document…</p>;

  return (
    <>
      <div className="image-frame" data-zoomed={Boolean(zoomed)} ref={frameRef}>
        <img
          ref={imgRef}
          className="image-frame-img"
          src={objectUrl}
          alt={doc.title}
          draggable={false}
          onLoad={handleImageLoad}
          style={zoomed ? { width: baseSize.width * scale, height: "auto" } : undefined}
        />
      </div>
      <p className="image-caption">{doc.title}</p>
    </>
  );
}

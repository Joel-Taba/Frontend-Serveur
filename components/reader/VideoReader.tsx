"use client";

import { useEffect, useRef, useState } from "react";
import { authHeaders } from "@/lib/api";
import FullscreenButton from "./FullscreenButton";
import type { ReaderProps } from "./types";

type Status = "loading" | "ready" | "error";

export default function VideoReader({ doc, fileUrl, onToolbar, onProgress }: ReaderProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;

    fetch(fileUrl, { headers: authHeaders() })
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setObjectUrl(url);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [fileUrl]);

  useEffect(() => {
    onToolbar(<FullscreenButton />);
  }, [onToolbar]);

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (video && video.duration) onProgress(video.currentTime / video.duration);
  }

  if (status === "loading") return <p className="viewer-status">Chargement du document…</p>;
  if (status === "error") return <p className="viewer-status">Impossible de charger cette vidéo.</p>;

  return (
    <div className="video-stage">
      <video
        ref={videoRef}
        src={objectUrl ?? undefined}
        controls
        controlsList="nodownload"
        onTimeUpdate={handleTimeUpdate}
      />
      <p className="image-caption">{doc.title}</p>
    </div>
  );
}

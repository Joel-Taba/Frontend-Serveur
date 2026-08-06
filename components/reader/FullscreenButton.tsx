"use client";

import { useEffect, useState } from "react";
import { FullscreenCloseIcon, FullscreenOpenIcon } from "./icons";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <button
      type="button"
      title="Plein écran"
      aria-label="Plein écran"
      onClick={() => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }}
    >
      {isFullscreen ? <FullscreenCloseIcon /> : <FullscreenOpenIcon />}
    </button>
  );
}

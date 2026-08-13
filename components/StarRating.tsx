"use client";

import { useState } from "react";

const STAR_PATH =
  "M12 3.3l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.5l5.9-.8z";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
      <path d={STAR_PATH} strokeLinejoin="round" />
    </svg>
  );
}

/** Affichage en lecture seule d'une note moyenne — catalogue public comme
 * espace gestionnaire (DocumentRow.tsx, LibraryManager.tsx). Utilise des
 * `<span>` (jamais de `<button>`) : ces lignes sont déjà, dans leur
 * ensemble, un lien/bouton cliquable — imbriquer un élément interactif
 * dedans serait invalide. */
export function StarRatingDisplay({
  value,
  count,
}: {
  value: number | null;
  count: number;
}) {
  const rounded = value !== null ? Math.round(value) : 0;

  return (
    <span className="star-rating" title={value !== null ? `${value.toFixed(1)} / 5 (${count} avis)` : "Pas encore noté"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`star-rating-item${n <= rounded ? " is-filled" : ""}`}>
          <Star filled={n <= rounded} />
        </span>
      ))}
      <span className="star-rating-value">{value !== null ? value.toFixed(1) : "—"}</span>
    </span>
  );
}

/** Sélecteur interactif (1 à 5 étoiles) — pop-up de notation à la sortie du
 * lecteur (ReaderShell.tsx). Toujours utilisé hors de tout autre élément
 * cliquable (dans une boîte de dialogue), donc de vrais <button> ici. */
export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (stars: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <span className="star-rating star-rating-input" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-rating-item${n <= displayValue ? " is-filled" : ""}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          aria-label={`${n} étoile${n > 1 ? "s" : ""} sur 5`}
        >
          <Star filled={n <= displayValue} />
        </button>
      ))}
    </span>
  );
}

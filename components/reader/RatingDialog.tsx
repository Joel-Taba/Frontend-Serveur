"use client";

import { useEffect, useState } from "react";
import type { CatalogDocument } from "@/lib/catalog";
import { apiFetch, ApiError } from "@/lib/api";
import { StarRatingInput } from "../StarRating";

/** Pop-up proposée en quittant le lecteur (bouton Catalogue/Bibliothèque) —
 * réservée aux comptes non-gestionnaires (voir ReaderShell.tsx). La
 * notation est facultative : "Passer" ferme la pop-up sans rien envoyer. */
export default function RatingDialog({ doc, onDone }: { doc: CatalogDocument; onDone: () => void }) {
  const [stars, setStars] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDone();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    if (stars === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch(`/library/documents/${doc.backendId}/rate/`, { method: "POST", body: { stars } });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'enregistrer la note.");
      setSubmitting(false);
    }
  }

  return (
    <div className="confirm-overlay" onClick={onDone}>
      <div
        className="confirm-dialog rating-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="rating-dialog-title">Que pensez-vous de ce document ?</h3>
        <p>
          « {doc.title} » — votre avis aide les autres lecteurs à choisir. Vous pouvez aussi passer cette étape.
        </p>

        <StarRatingInput value={stars} onChange={setStars} />

        {error && <p className="contact-status contact-status-error">{error}</p>}

        <div className="confirm-dialog-actions">
          <button type="button" className="btn btn-ghost" onClick={onDone} disabled={submitting}>
            Passer
          </button>
          <button
            type="button"
            className="rating-dialog-submit"
            onClick={handleSubmit}
            disabled={submitting || stars === 0}
          >
            {submitting ? "Envoi…" : "Envoyer ma note"}
          </button>
        </div>
      </div>
    </div>
  );
}

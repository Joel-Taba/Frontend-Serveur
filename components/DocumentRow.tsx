"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogDocument, DocumentType } from "@/lib/catalog";
import { formatBytes } from "@/lib/format";
import { ChevronIcon } from "./catalogueIcons";
import { StarRatingDisplay } from "./StarRating";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Language } from "@/lib/i18n/LanguageContext";

const ICONS: Record<CatalogDocument["type"], React.ReactNode> = {
  pdf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M15 2v5h5" />
      <text x="8" y="17" fontSize="6" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif" fontWeight="700">
        PDF
      </text>
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.8" />
      <path d="M21 16l-5.5-5.5L9 17" />
    </svg>
  ),
  epub: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5.5C6 4.5 9 4 12 5v14c-3-1-6-.5-8 .5z" />
      <path d="M20 5.5C18 4.5 15 4 12 5v14c3-1 6-.5 8 .5z" />
    </svg>
  ),
  json: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 3c-2 0-3 1-3 3v3c0 1-.5 2-2 2 1.5 0 2 1 2 2v3c0 2 1 3 3 3" />
      <path d="M16 3c2 0 3 1 3 3v3c0 1 .5 2 2 2-1.5 0-2 1-2 2v3c0 2-1 3-3 3" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2.5" y="5" width="14" height="14" rx="2" />
      <path d="M16.5 10.2l5-2.7v9l-5-2.7" strokeLinejoin="round" />
    </svg>
  ),
};

const TYPE_LABELS: Record<Language, Record<DocumentType, string>> = {
  fr: { pdf: "PDF", image: "Image", epub: "EPUB", json: "JSON", video: "Vidéo" },
  en: { pdf: "PDF", image: "Image", epub: "EPUB", json: "JSON", video: "Video" },
  ar: { pdf: "PDF", image: "صورة", epub: "EPUB", json: "JSON", video: "فيديو" },
};

export default function DocumentRow({ doc, subtitle }: { doc: CatalogDocument; subtitle?: string }) {
  const { t, language } = useLanguage();
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = doc.type !== "json" && doc.type !== "video" && !coverFailed;
  const idPath = doc.id.join("/");

  return (
    <Link className="list-row" data-type={doc.type} href={`/viewer/${idPath}`}>
      {showCover ? (
        <img
          className="list-row-cover"
          src={`/api/thumbnail/${idPath}`}
          alt=""
          loading="lazy"
          onError={() => setCoverFailed(true)}
        />
      ) : (
        <span className="list-row-icon">{ICONS[doc.type]}</span>
      )}
      <span className="list-row-body">
        <span className="list-row-title">{doc.title}</span>
        <span className="list-row-subtitle">{subtitle ?? t.catalogue.documentSubtitle}</span>
      </span>
      <span className="list-row-type-badge" data-type={doc.type}>
        {TYPE_LABELS[language][doc.type]}
      </span>
      <StarRatingDisplay value={doc.averageRating} count={doc.ratingsCount} />
      <span className="list-row-size">{formatBytes(doc.size)}</span>
      <span className="list-row-chevron" aria-hidden="true">
        <ChevronIcon />
      </span>
    </Link>
  );
}

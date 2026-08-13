"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchableDocument } from "@/lib/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const MAX_SUGGESTIONS = 6;

export default function HeroSearchForm({ searchIndex }: { searchIndex: SearchableDocument[] }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const query = value.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!query) return [];
    return searchIndex
      .filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.folderNames.some((name) => name.toLowerCase().includes(query))
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [query, searchIndex]);

  function openDocument(doc: SearchableDocument) {
    setIsOpen(false);
    setValue("");
    router.push(`/viewer/${doc.id.join("/")}`);
  }

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (suggestions[0]) openDocument(suggestions[0]);
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(event.relatedTarget)) setIsOpen(false);
  }

  return (
    <div className="hero-search-wrap-inner" ref={containerRef} onBlur={handleBlur}>
      <form className="hero-search" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder={t.hero.searchPlaceholder}
          autoComplete="off"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="hero-search-listbox"
        />
        <button type="submit" className="btn btn-primary" disabled={!suggestions.length}>
          {t.hero.searchButton}
        </button>
      </form>

      {isOpen && query && (
        <div className="hero-search-suggestions" role="listbox" id="hero-search-listbox">
          {suggestions.length > 0 ? (
            suggestions.map((doc) => (
              <button
                type="button"
                key={doc.id.join("/")}
                className="hero-search-suggestion"
                role="option"
                aria-selected="false"
                onClick={() => openDocument(doc)}
              >
                <span className="hero-search-suggestion-title">{doc.title}</span>
                {doc.folderNames.length > 0 && (
                  <span className="hero-search-suggestion-path">{doc.folderNames.join(" / ")}</span>
                )}
              </button>
            ))
          ) : (
            <p className="hero-search-suggestion-empty">{t.hero.noResults(value.trim())}</p>
          )}
        </div>
      )}
    </div>
  );
}

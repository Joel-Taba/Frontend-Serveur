"use client";

import { useMemo } from "react";
import type { SearchableDocument } from "@/lib/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { filterSearchIndexByCountry } from "@/lib/countries";
import HeroSearchForm from "./HeroSearchForm";

/** Barre de recherche placée juste au-dessus de la section Catalogue —
 * volontairement proche de la bibliothèque plutôt que dans le hero, pour
 * raccourcir le trajet entre "je cherche" et "je trouve". Même index de
 * recherche filtré par pays que le catalogue juste en dessous. */
export default function CatalogueSearch({ searchIndex }: { searchIndex: SearchableDocument[] }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const countryFilter = user && user.role !== "manager" ? user.country : null;
  const visibleSearchIndex = useMemo(
    () => filterSearchIndexByCountry(searchIndex, countryFilter),
    [searchIndex, countryFilter]
  );

  return (
    <section className="section catalogue-search-section">
      <p className="eyebrow">{t.catalogueSearch.eyebrow}</p>
      <h2>{t.catalogueSearch.heading}</h2>
      <div className="catalogue-search-wrap">
        <HeroSearchForm searchIndex={visibleSearchIndex} />
      </div>
    </section>
  );
}

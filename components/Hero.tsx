"use client";

import { useMemo } from "react";
import Image from "next/image";
import Header from "./Header";
import HeroSearchForm from "./HeroSearchForm";
import type { SearchableDocument } from "@/lib/catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { filterSearchIndexByCountry } from "@/lib/countries";

export default function Hero({ searchIndex }: { searchIndex: SearchableDocument[] }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const countryFilter = user && user.role !== "manager" ? user.country : null;
  const visibleSearchIndex = useMemo(
    () => filterSearchIndexByCountry(searchIndex, countryFilter),
    [searchIndex, countryFilter]
  );

  return (
    <section className="hero-photo">
      <div className="hero-photo-media">
        <Image
          src="/assets/covers/fond.jpg"
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "62% 50%" }}
        />
        <div className="hero-photo-scrim" />
      </div>

      <Header />

      <span className="hero-photo-wordmark" aria-hidden="true">
        Flores Gong Nota
      </span>

      <div className="hero-photo-inner">
        <h1>{t.hero.title}</h1>
        <p className="hero-photo-subtitle">{t.hero.subtitle}</p>
        <div className="hero-photo-search-wrap">
          <HeroSearchForm searchIndex={visibleSearchIndex} />
        </div>
      </div>
    </section>
  );
}

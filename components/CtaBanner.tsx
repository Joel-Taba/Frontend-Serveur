"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CtaBanner() {
  const { t } = useLanguage();

  return (
    <section className="section">
      <div className="cta-banner">
        <h2>{t.cta.heading}</h2>
        <p>{t.cta.subtitle}</p>
        <a className="btn btn-primary" href="#catalogue">
          {t.cta.button}
        </a>
      </div>
    </section>
  );
}

"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

const ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="4" width="7" height="16" rx="1.5" />
    <rect x="14" y="4" width="7" height="10" rx="1.5" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 6c-2-1.5-5-2-8-1v13c3-1 6-.5 8 1 2-1.5 5-2 8-1V5c-3-1-6-.5-8 1z" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
  </svg>,
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="fonctionnalites" className="section section-tight">
      <p className="eyebrow">{t.features.eyebrow}</p>
      <h2>{t.features.heading}</h2>
      <div className="features-grid">
        {t.features.items.map((feature, index) => (
          <div className="feature-card" key={feature.title}>
            <div className="feature-icon">{ICONS[index]}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

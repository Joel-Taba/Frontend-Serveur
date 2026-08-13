"use client";

import ContactForm from "./ContactForm";
import { ChevronIcon } from "./catalogueIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Faq() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="section">
      <p className="eyebrow">{t.faq.eyebrow}</p>
      <h2>{t.faq.heading}</h2>
      <div className="faq-layout">
        <div className="faq-list">
          {t.faq.items.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="faq-chevron">
                  <ChevronIcon />
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

"use client";

import { COVERS, COVERS_BASE_PATH } from "@/lib/covers";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function About({ documentCount, formatCount }: { documentCount: number; formatCount: number }) {
  const { t } = useLanguage();
  const [coverPrimary, coverSecondary, coverTertiary] = [COVERS[0], COVERS[7], COVERS[3]];

  return (
    <section id="a-propos" className="section">
      <div className="about">
        <div className="about-collage" aria-hidden="true">
          <img className="ac-1" src={`${COVERS_BASE_PATH}${coverPrimary.file}`} alt="" />
          <img className="ac-2" src={`${COVERS_BASE_PATH}${coverSecondary.file}`} alt="" />
          <img className="ac-3" src={`${COVERS_BASE_PATH}${coverTertiary.file}`} alt="" />
        </div>
        <div className="about-text">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2>{t.about.heading}</h2>
          <p>{t.about.paragraph}</p>
          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-value">{documentCount}</span>
              <span className="stat-label">{t.about.documentsLabel}</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{formatCount}</span>
              <span className="stat-label">{t.about.formatsLabel}</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">100%</span>
              <span className="stat-label">{t.about.onlineReadingLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

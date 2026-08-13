"use client";

import { COVERS, COVERS_BASE_PATH } from "@/lib/covers";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function About({ documentCount, formatCount }: { documentCount: number; formatCount: number }) {
  const { t } = useLanguage();
  const [invisibles, romance, ia] = [COVERS[4], COVERS[1], COVERS[5]];

  return (
    <section id="a-propos" className="section">
      <div className="about">
        <div className="about-collage" aria-hidden="true">
          <img className="ac-1" src={`${COVERS_BASE_PATH}${invisibles.file}`} alt="" />
          <img className="ac-2" src={`${COVERS_BASE_PATH}${romance.file}`} alt="" />
          <img className="ac-3" src={`${COVERS_BASE_PATH}${ia.file}`} alt="" />
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

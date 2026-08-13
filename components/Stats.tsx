"use client";

import { BookIcon, UsersIcon } from "./catalogueIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Stats({
  documentCount,
  accountCount,
}: {
  documentCount: number;
  accountCount: number;
}) {
  const { t } = useLanguage();
  const stats = [
    { icon: <BookIcon />, value: documentCount, label: t.stats.documentsLabel },
    { icon: <UsersIcon />, value: accountCount, label: t.stats.accountsLabel },
  ];

  return (
    <section id="chiffres" className="section">
      <div className="stats-panel">
        <p className="eyebrow">{t.stats.eyebrow}</p>
        <h2>{t.stats.heading}</h2>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-block" key={stat.label}>
              <span className="stat-block-icon">{stat.icon}</span>
              <span className="stat-block-value">{stat.value}</span>
              <span className="stat-block-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

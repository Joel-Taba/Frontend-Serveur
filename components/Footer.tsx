"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="brand" href="/">
            <span className="brand-name">Flores Gong Nota</span>
          </Link>
          <p>{t.footer.description}</p>
        </div>
        <div className="footer-col">
          <h4>{t.footer.libraryHeading}</h4>
          <ul>
            <li>
              <a href="#catalogue">{t.footer.linkContents}</a>
            </li>
            <li>
              <a href="#genres">{t.footer.linkGenres}</a>
            </li>
            <li>
              <a href="#fonctionnalites">{t.footer.linkFeatures}</a>
            </li>
            <li>
              <a href="#a-propos">{t.footer.linkAbout}</a>
            </li>
            <li>
              <a href="#chiffres">{t.footer.linkStats}</a>
            </li>
            <li>
              <a href="#faq">{t.footer.linkFaq}</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t.footer.formatsHeading}</h4>
          <ul>
            <li>PDF</li>
            <li>EPUB</li>
            <li>Images</li>
            <li>JSON</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t.footer.trustHeading}</h4>
          <ul>
            <li>{t.footer.trustProtected}</li>
            <li>{t.footer.trustNoDownload}</li>
            <li>{t.footer.trustAutoUpdate}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        {t.footer.copyright}
        <span className="footer-credit">
          {" "}
          — Icônes alphabet :{" "}
          <a href="http://www.freepik.com" target="_blank" rel="noopener noreferrer">
            Designed by brgfx / Freepik
          </a>
        </span>
      </div>
    </footer>
  );
}

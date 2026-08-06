import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="brand" href="/">
            <span className="brand-name">Flores Gong Nota</span>
          </Link>
          <p>
            Bibliothèque numérique en lecture seule. Les documents proposés restent la
            propriété de leurs auteurs et ne peuvent être ni téléchargés, ni reproduits.
          </p>
        </div>
        <div className="footer-col">
          <h4>Bibliothèque</h4>
          <ul>
            <li>
              <a href="#catalogue">Contenus</a>
            </li>
            <li>
              <a href="#genres">Genres</a>
            </li>
            <li>
              <a href="#fonctionnalites">Fonctionnalités</a>
            </li>
            <li>
              <a href="#a-propos">À propos</a>
            </li>
            <li>
              <a href="#chiffres">Nos chiffres</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Formats pris en charge</h4>
          <ul>
            <li>PDF</li>
            <li>EPUB</li>
            <li>Images</li>
            <li>JSON</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Confiance</h4>
          <ul>
            <li>Lecture protégée</li>
            <li>Aucun téléchargement</li>
            <li>Contenus mis à jour automatiquement</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Flores Gong Nota. Tous droits réservés.</div>
    </footer>
  );
}

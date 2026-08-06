import { COVERS, COVERS_BASE_PATH } from "@/lib/covers";

export default function About({ documentCount, formatCount }: { documentCount: number; formatCount: number }) {
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
          <p className="eyebrow">À propos</p>
          <h2>Une Bibliothèque Vivante, Enrichie Chaque Mois</h2>
          <p>
            Flores Gong Nota rassemble des documents de natures variées — PDF, EPUB, images et
            données JSON — choisis pour leur qualité. Chaque nouvelle acquisition rejoint
            automatiquement le catalogue et devient consultable instantanément.
          </p>
          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-value">{documentCount}</span>
              <span className="stat-label">Documents</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{formatCount}</span>
              <span className="stat-label">Formats gérés</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">100%</span>
              <span className="stat-label">Lecture en ligne</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

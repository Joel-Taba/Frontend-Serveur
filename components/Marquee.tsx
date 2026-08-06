import { COVERS, COVERS_BASE_PATH } from "@/lib/covers";

export default function Marquee() {
  const items = [...COVERS, ...COVERS]; // dupliqué pour une boucle continue

  return (
    <section id="genres" className="section marquee-section">
      <div className="marquee-heading">
        <p className="eyebrow">Nos univers</p>
        <h2>Nos thématiques</h2>
      </div>
      <div className="marquee-track-wrap">
        <div className="marquee-track">
          {items.map((cover, index) => (
            <div className="marquee-card" key={`${cover.file}-${index}`}>
              <img src={`${COVERS_BASE_PATH}${cover.file}`} alt={cover.title} loading="lazy" />
              <div className="marquee-card-caption">
                <div className="genre">{cover.genre}</div>
                <div className="title">{cover.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

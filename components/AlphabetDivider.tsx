const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const ALPHABET_BASE_PATH = "/assets/alphabet-letters/";

/** Frise d'alphabet façon jeu de blocs pour enfants, qui défile en continu —
 * sépare le hero du reste de la page à la place de l'ancien dégradé. Les
 * lettres viennent de assets-source/english-alphabet/2901.eps (brgfx /
 * Freepik, voir la licence dans ce dossier — attribution requise, créditée
 * dans le pied de page) : découpées individuellement en PNG transparent
 * haute résolution, faute d'export SVG par lettre dans le fichier source.
 * Liste dupliquée pour un défilement sans coupure (même technique que
 * Marquee.tsx pour le bandeau des couvertures). */
export default function AlphabetDivider() {
  const items = [...LETTERS, ...LETTERS];

  return (
    <div className="alphabet-divider" aria-hidden="true">
      <div className="alphabet-track">
        {items.map((letter, index) => (
          <img
            key={`${letter}-${index}`}
            className="alphabet-tile"
            src={`${ALPHABET_BASE_PATH}${letter}.png`}
            alt=""
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

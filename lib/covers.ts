// Couvertures décoratives utilisées pour illustrer les genres de la
// bibliothèque (collage du hero + bandeau défilant). Ce ne sont pas des
// documents consultables : elles ne passent jamais par le catalogue.
export interface Cover {
  file: string;
  title: string;
  genre: string;
}

export const COVERS_BASE_PATH = "/assets/covers/";

export const COVERS: Cover[] = [
  { file: "cover-08.png", title: "Cosmos", genre: "Astronomie" },
  { file: "cover-08.png", title: "Et si c'était sous mes yeux", genre: "Romance" },
  { file: "cover-08.png", title: "L'Art de parler avec confiance", genre: "Développement personnel" },
  { file: "cover-04.jpeg", title: "Le Rose de mes Rêves", genre: "Romance" },
  { file: "cover-05.jpeg", title: "Les Invisibles de Fougeret", genre: "Roman" },
  { file: "cover-06.png", title: "Gagner de l'argent avec l'IA", genre: "Business & Tech" },
  { file: "cover-07.png", title: "Sciencia", genre: "Science" },
];

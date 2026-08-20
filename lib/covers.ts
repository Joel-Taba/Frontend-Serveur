// Couvertures décoratives utilisées pour illustrer les genres de la
// bibliothèque (collage du hero + bandeau défilant). Ce ne sont pas des
// documents consultables : elles ne passent jamais par le catalogue.
//
// Ce sont les véritables couvertures des manuels scolaires tchadiens de la
// bibliothèque (Éducation civique et morale, Centre National des Curricula ;
// Mathématiques « Le Néjm Essadi », manuels arabophones) — les titres ne
// sont volontairement pas traduits par la fonctionnalité multilingue du
// site, au même titre que les titres des documents du catalogue : ce sont
// de vrais titres d'ouvrages, pas du texte d'interface.
export interface Cover {
  file: string;
  title: string;
  genre: string;
}

export const COVERS_BASE_PATH = "/assets/covers/";

export const COVERS: Cover[] = [
  { file: "Cover-ECM2.jpg", title: "Éducation Civique et Morale — CP", genre: "Éducation civique" },
  { file: "Cover-ECM6.jpg", title: "Éducation Civique et Morale — CE", genre: "Éducation civique" },
  { file: "Cover-ECM4.jpg", title: "Éducation Civique et Morale — CM", genre: "Éducation civique" },
  { file: "Cover-ECM8.jpg", title: "Éducation Civique et Morale — 6ème", genre: "Éducation civique" },
  { file: "Cover-ECM10.jpg", title: "Éducation Civique et Morale — 5ème", genre: "Éducation civique" },
  { file: "Cover-ECM12.jpg", title: "Éducation Civique et Morale — 4ème", genre: "Éducation civique" },
  { file: "Cover-ECM14.jpg", title: "Éducation Civique et Morale — 3ème", genre: "Éducation civique" },
  { file: "Cover-Maths_02.jpg", title: "النجم الساطع في الرياضيات — CP1", genre: "Mathématiques" },
  { file: "Cover-Maths_04.jpg", title: "النجم الساطع في الرياضيات — CP2", genre: "Mathématiques" },
  { file: "Cover-Maths_06.jpg", title: "النجم الساطع في الرياضيات — CE1", genre: "Mathématiques" },
  { file: "Cover-Maths_08.jpg", title: "النجم الساطع في الرياضيات — CE2", genre: "Mathématiques" },
  { file: "Cover-Maths_10.jpg", title: "النجم الساطع في الرياضيات — CM1", genre: "Mathématiques" },
  { file: "Cover-Maths_12.jpg", title: "النجم الساطع في الرياضيات — CM2", genre: "Mathématiques" },
];

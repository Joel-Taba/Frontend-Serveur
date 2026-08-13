/**
 * Pays cibles de la plateforme, partagés entre le formulaire d'inscription,
 * la page profil et le filtrage de la bibliothèque publique par pays. Les
 * codes reprennent exactement Backend/apps/accounts/models.py (User.Country).
 */
import type { SearchableDocument } from "./catalog";
import type { Dictionary } from "./i18n/types";

export const COUNTRY_CODES = ["cameroon", "chad", "drc", "senegal", "burkina_faso", "niger"] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

/** Valeur spéciale "Tous les pays" — un compte avec ce pays (ou sans pays
 * renseigné, ou gestionnaire) voit la bibliothèque en entier, non filtrée. */
export const ALL_COUNTRIES_CODE = "all";

/** Options proposées dans les `<select>` pays (inscription, profil) — les 6
 * pays cibles puis "Tous les pays" en dernier, comme demandé. */
export const SELECTABLE_COUNTRY_CODES = [...COUNTRY_CODES, ALL_COUNTRIES_CODE] as const;

/** Slug du dossier racine (documents/<Pays>/…, importé par
 * import_existing_library) correspondant à chaque code pays — ne correspond
 * pas toujours au code lui-même (ex : "cameroon" → dossier "Cameroun", slug
 * "cameroun"). À tenir à jour si l'arborescence de documents/ est renommée. */
export const COUNTRY_CATEGORY_SLUGS: Record<CountryCode, string> = {
  cameroon: "cameroun",
  chad: "tchad",
  drc: "rdc",
  senegal: "senegal",
  burkina_faso: "burkina-faso",
  niger: "niger",
};

function countrySlug(country: string | null | undefined): string | undefined {
  if (!country || country === ALL_COUNTRIES_CODE) return undefined;
  return COUNTRY_CATEGORY_SLUGS[country as CountryCode];
}

/** Chemin (segments) du dossier racine de la bibliothèque correspondant à un
 * pays — sert à ancrer la navigation du catalogue sur ce dossier plutôt que
 * sur la racine complète. Les identifiants de dossiers/documents (`id`,
 * chemins réels côté Backend) ne sont eux jamais réécrits : la navigation
 * doit continuer à chercher dans l'arbre complet, faute de quoi un dossier
 * comme `["senegal", "primaire"]` ne se retrouve plus une fois la racine
 * "affichée" limitée à `senegal`. Tableau vide si aucun filtre ne
 * s'applique (pas de pays, "Tous les pays", ou gestionnaire). */
export function getCountryRootPath(country: string | null | undefined): string[] {
  const slug = countrySlug(country);
  return slug ? [slug] : [];
}

/** Nom traduit du pays choisi, pour remplacer le libellé générique
 * "Bibliothèque" dans le fil d'Ariane (on sait alors directement de quel
 * pays vient le contenu affiché). `null` si aucun filtre pays réel
 * ne s'applique — l'appelant retombe alors sur le libellé générique. */
export function getCountryLabel(t: Dictionary, country: string | null | undefined): string | null {
  if (!country || country === ALL_COUNTRIES_CODE) return null;
  return (COUNTRY_CODES as readonly string[]).includes(country) ? t.countries[country as CountryCode] : null;
}

/** Même filtre pour l'index de recherche de la barre du hero — un document
 * garde son chemin complet (`id`), dont le premier segment est le dossier
 * pays quand il en a un. */
export function filterSearchIndexByCountry(
  docs: SearchableDocument[],
  country: string | null | undefined
): SearchableDocument[] {
  const slug = countrySlug(country);
  if (!slug) return docs;
  return docs.filter((doc) => doc.id[0] === slug);
}

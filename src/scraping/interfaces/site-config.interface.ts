export interface SiteSelectors {
  produit: string;
  nom: string;
  prix: string;
  lien: string;
  image: string;
  disponibilite: string;
}

export interface SiteCategories {
  [key: string]: string;
}

export interface SiteConfig {
  id: string;
  nom: string;
  url: string;
  logo: string;
  selectors: SiteSelectors;
  categories: SiteCategories;
  recherche: string;
  delai_scraping: number;
}

export interface Categorie {
  id: string;
  nom: string;
  description: string;
}

export interface ConfigurationSites {
  sites: SiteConfig[];
  categories: Categorie[];
  intervalRafraichissement: number;
}

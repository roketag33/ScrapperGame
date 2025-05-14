export interface Produit {
  nom: string;
  prix: number;
  url: string;
  image?: string;
  description?: string;
  disponibilite?: string;
  categorie?: string;
  marque?: string;
  dateScraping: Date;
}

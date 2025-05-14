export interface Marque {
  id: string;
  nom: string;
  categories: string[];
}

export interface ConfigurationMarques {
  marques: Marque[];
}

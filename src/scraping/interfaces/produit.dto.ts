import { ApiProperty } from '@nestjs/swagger';

export class ProduitDto {
  @ApiProperty({
    description: 'Nom du produit',
    example: 'Carte graphique NVIDIA GeForce RTX 3080',
  })
  nom: string;

  @ApiProperty({
    description: 'Prix du produit en euros',
    example: 789.99,
  })
  prix: number;

  @ApiProperty({
    description: 'URL de la page du produit',
    example: 'https://www.ldlc.com/fiche/PB00387567.html',
  })
  url: string;

  @ApiProperty({
    description: "URL de l'image du produit",
    required: false,
    example: 'https://www.ldlc.com/images/products/PB00387567.jpg',
  })
  image?: string;

  @ApiProperty({
    description: 'Description du produit',
    required: false,
    example:
      'Carte graphique gaming haut de gamme avec 10 Go de mémoire GDDR6X',
  })
  description?: string;

  @ApiProperty({
    description: 'Disponibilité du produit',
    required: false,
    example: 'En stock',
  })
  disponibilite?: string;

  @ApiProperty({
    description: 'Catégorie du produit',
    required: false,
    example: 'carte-graphique',
  })
  categorie?: string;

  @ApiProperty({
    description: 'Marque du produit',
    required: false,
    example: 'NVIDIA',
  })
  marque?: string;

  @ApiProperty({
    description: 'Date et heure du scraping',
    example: '2023-06-01T14:30:00Z',
  })
  dateScraping: Date;
}

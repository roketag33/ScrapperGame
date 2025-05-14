import { Controller, Get, Query, Logger, Param } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { Produit } from './interfaces/produit.interface';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ProduitDto } from './interfaces/produit.dto';

@ApiTags('Scraping')
@Controller('scraping')
export class ScrapingController {
  private readonly logger = new Logger(ScrapingController.name);

  constructor(private readonly scrapingService: ScrapingService) {}

  @ApiOperation({ summary: 'Liste des sites disponibles pour le scraping' })
  @ApiResponse({
    status: 200,
    description: 'Liste des identifiants des sites configurés',
    type: [String],
  })
  @Get('sites')
  async listeSites(): Promise<string[]> {
    return this.scrapingService.listeSites();
  }

  @ApiOperation({ summary: 'Liste des catégories disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Liste des identifiants des catégories configurées',
    type: [String],
  })
  @Get('categories')
  async listeCategories(): Promise<string[]> {
    return this.scrapingService.listeCategories();
  }

  @ApiOperation({ summary: 'Scrape un site spécifique' })
  @ApiParam({ name: 'siteId', description: 'Identifiant du site à scraper' })
  @ApiQuery({
    name: 'categorie',
    description: 'Catégorie de produit',
    required: false,
    example: 'carte-graphique',
  })
  @ApiQuery({
    name: 'motCle',
    description: 'Mot-clé de recherche',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits scrapés',
    type: [ProduitDto],
  })
  @Get('site/:siteId')
  async scrapSite(
    @Param('siteId') siteId: string,
    @Query('categorie') categorie: string = 'carte-graphique',
    @Query('motCle') motCle?: string,
  ): Promise<Produit[]> {
    this.logger.log(
      `Requête de scraping pour le site ${siteId}, catégorie ${categorie} ${motCle ? 'avec le mot-clé: ' + motCle : ''}`,
    );
    return this.scrapingService.scrapSite(siteId, categorie, motCle);
  }

  @ApiOperation({ summary: 'Scrape le site LDLC' })
  @ApiQuery({
    name: 'categorie',
    description: 'Catégorie de produit',
    required: false,
    example: 'carte-graphique',
  })
  @ApiQuery({
    name: 'motCle',
    description: 'Mot-clé de recherche',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits scrapés sur LDLC',
    type: [ProduitDto],
  })
  @Get('ldlc')
  async scrapLDLC(
    @Query('categorie') categorie: string = 'carte-graphique',
    @Query('motCle') motCle?: string,
  ): Promise<Produit[]> {
    this.logger.log(
      `Requête de scraping LDLC pour ${categorie} ${motCle ? 'avec le mot-clé: ' + motCle : ''}`,
    );
    return this.scrapingService.scrapSite('ldlc', categorie, motCle);
  }

  @ApiOperation({ summary: 'Compare les prix entre différents sites' })
  @ApiQuery({
    name: 'categorie',
    description: 'Catégorie de produit',
    required: false,
    example: 'carte-graphique',
  })
  @ApiQuery({
    name: 'motCle',
    description: 'Mot-clé de recherche',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits triée par prix croissant',
    type: [ProduitDto],
  })
  @Get('comparer')
  async comparerPrix(
    @Query('categorie') categorie: string = 'carte-graphique',
    @Query('motCle') motCle?: string,
  ): Promise<Produit[]> {
    this.logger.log(
      `Requête de comparaison des prix pour ${categorie} ${motCle ? 'avec le mot-clé: ' + motCle : ''}`,
    );
    return this.scrapingService.comparerPrix(categorie, motCle);
  }

  @ApiOperation({ summary: 'Liste des marques disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Liste des noms de marques configurées',
    type: [String],
  })
  @Get('marques')
  async listeMarques(): Promise<string[]> {
    const marques = await this.scrapingService.listeMarques();
    return marques;
  }

  @ApiOperation({ summary: 'Liste des marques par catégorie' })
  @ApiParam({ name: 'categorieId', description: 'Identifiant de la catégorie' })
  @ApiResponse({
    status: 200,
    description: 'Liste des noms de marques pour la catégorie spécifiée',
    type: [String],
  })
  @Get('marques/:categorieId')
  async listeMarquesParCategorie(
    @Param('categorieId') categorieId: string,
  ): Promise<string[]> {
    const marques =
      await this.scrapingService.listeMarquesParCategorie(categorieId);
    return marques;
  }
}

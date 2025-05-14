import { Controller, Get, Query, Logger, Param } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { Produit } from './interfaces/produit.interface';

@Controller('scraping')
export class ScrapingController {
  private readonly logger = new Logger(ScrapingController.name);

  constructor(private readonly scrapingService: ScrapingService) {}

  @Get('sites')
  async listeSites(): Promise<string[]> {
    return this.scrapingService.listeSites();
  }

  @Get('categories')
  async listeCategories(): Promise<string[]> {
    return this.scrapingService.listeCategories();
  }

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

  @Get('marques')
  async listeMarques(): Promise<string[]> {
    const marques = await this.scrapingService.listeMarques();
    return marques;
  }

  @Get('marques/:categorieId')
  async listeMarquesParCategorie(
    @Param('categorieId') categorieId: string,
  ): Promise<string[]> {
    const marques =
      await this.scrapingService.listeMarquesParCategorie(categorieId);
    return marques;
  }
}

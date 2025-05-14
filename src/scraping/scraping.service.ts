import { Injectable, Logger } from '@nestjs/common';
import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { Produit } from './interfaces/produit.interface';
import { ConfigService } from '../config/config.service';
import { SiteConfig } from './interfaces/site-config.interface';
import { HistoriqueService } from './historique.service';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly historiqueService: HistoriqueService,
  ) {}

  async scrapSite(
    siteId: string,
    categorie: string,
    motCle?: string,
  ): Promise<Produit[]> {
    const site = this.configService.getSiteById(siteId);

    if (!site) {
      this.logger.error(`Site ${siteId} non trouvé dans la configuration`);
      throw new Error(`Site ${siteId} non trouvé dans la configuration`);
    }

    this.logger.log(
      `Démarrage du scraping ${site.nom} pour ${categorie} ${motCle ? 'avec le mot-clé: ' + motCle : ''}`,
    );

    // Déterminer l'URL à visiter
    let url: string;
    if (motCle) {
      url = `${site.url}${site.recherche.replace('{motCle}', encodeURIComponent(motCle))}`;
    } else if (site.categories[categorie]) {
      url = `${site.url}${site.categories[categorie]}`;
    } else {
      this.logger.error(
        `Catégorie ${categorie} non trouvée pour le site ${site.nom}`,
      );
      throw new Error(
        `Catégorie ${categorie} non trouvée pour le site ${site.nom}`,
      );
    }

    const startTime = Date.now();
    const produits = await this.executerScraping(site, url, categorie);
    const endTime = Date.now();
    const dureeMs = endTime - startTime;

    // Enregistrer la recherche dans la base de données
    await this.historiqueService.enregistrerRecherche(
      siteId,
      categorie,
      motCle ?? null,
      produits,
      dureeMs,
    );

    return produits;
  }

  private async executerScraping(
    site: SiteConfig,
    url: string,
    categorie: string,
  ): Promise<Produit[]> {
    const produits: Produit[] = [];

    try {
      // Utilisation de Playwright pour charger la page dynamique
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      this.logger.log(`Visite de l'URL: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Attente du chargement des produits
      await page
        .waitForSelector(site.selectors.produit, { timeout: 10000 })
        .catch(() => {
          this.logger.warn(
            `Timeout en attendant les éléments de produit (${site.selectors.produit})`,
          );
        });

      // Récupération du contenu HTML
      const content = await page.content();

      // Fermeture du navigateur
      await browser.close();

      // Analyse du HTML avec Cheerio
      const $ = cheerio.load(content);

      $(site.selectors.produit).each((index, element) => {
        try {
          const nom = $(element).find(site.selectors.nom).text().trim();
          const prixText = $(element)
            .find(site.selectors.prix)
            .text()
            .trim()
            .replace('€', '')
            .replace(',', '.')
            .replace(/\s+/g, '')
            .trim();
          const prix = parseFloat(prixText);
          const lien = $(element).find(site.selectors.lien).attr('href');

          // Vérification si lien est défini
          if (!lien) {
            this.logger.warn(
              `Lien non trouvé pour le produit à l'index ${index}`,
            );
            return; // Passer au produit suivant
          }

          const produitUrl = lien.startsWith('http')
            ? lien
            : `${site.url}${lien}`;
          const imageElement = $(element).find(site.selectors.image);
          const image =
            imageElement.attr('src') ?? imageElement.attr('data-src');
          const disponibilite = $(element)
            .find(site.selectors.disponibilite)
            .text()
            .trim();

          if (nom && !isNaN(prix)) {
            produits.push({
              nom,
              prix,
              url: produitUrl,
              image,
              disponibilite,
              categorie,
              marque: this.extraireMarque(nom),
              dateScraping: new Date(),
            });
          }
        } catch (error: unknown) {
          this.logError("parsing d'un produit", error);
        }
      });

      this.logger.log(
        `Scraping ${site.nom} terminé, ${produits.length} produits trouvés.`,
      );
      return produits;
    } catch (error: unknown) {
      this.logError(`scraping ${site.nom}`, error);
      throw error;
    }
  }

  private logError(context: string, error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.logger.error(`Erreur lors du ${context}: ${message}`);
  }

  private extraireMarque(nom: string): string {
    const marques = this.configService.getMarques();

    // Chercher la première correspondance
    for (const marque of marques) {
      if (nom.toLowerCase().includes(marque.nom.toLowerCase())) {
        return marque.nom;
      }
    }

    return 'Inconnue';
  }

  async comparerPrix(categorie: string, motCle?: string): Promise<Produit[]> {
    try {
      const sites = this.configService.getSites();
      let tousLesProduits: Produit[] = [];

      // Scraper chaque site configuré
      for (const site of sites) {
        try {
          const produits = await this.scrapSite(site.id, categorie, motCle);
          tousLesProduits = [...tousLesProduits, ...produits];
        } catch (error: unknown) {
          this.logError(`scraping du site ${site.nom}`, error);
          // Continuer avec les autres sites même si l'un d'eux échoue
        }
      }

      // Trier par prix croissant
      return tousLesProduits.sort((a, b) => a.prix - b.prix);
    } catch (error: unknown) {
      this.logError('la comparaison des prix', error);
      throw error;
    }
  }

  listeSites(): Promise<string[]> {
    const sites = this.configService.getSites();
    return Promise.resolve(sites.map((site) => site.id));
  }

  listeCategories(): Promise<string[]> {
    const categories = this.configService.getCategories();
    return Promise.resolve(categories.map((categorie) => categorie.id));
  }

  listeMarques(): Promise<string[]> {
    const marques = this.configService.getMarques();
    return Promise.resolve(marques.map((marque) => marque.nom));
  }

  listeMarquesParCategorie(categorieId: string): Promise<string[]> {
    const marques = this.configService.getMarquesByCategorie(categorieId);
    return Promise.resolve(marques.map((marque) => marque.nom));
  }
}

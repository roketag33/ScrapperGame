import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  ConfigurationSites,
  SiteConfig,
  Categorie,
} from '../scraping/interfaces/site-config.interface';
import {
  ConfigurationMarques,
  Marque,
} from '../scraping/interfaces/marque.interface';

@Injectable()
export class ConfigService implements OnModuleInit {
  private readonly logger = new Logger(ConfigService.name);
  private configuration: ConfigurationSites;
  private configurationMarques: ConfigurationMarques;
  private readonly configPath: string;
  private readonly marquesPath: string;

  constructor() {
    // En production, les fichiers seront recherchés dans le dossier dist
    const basePath =
      process.env.NODE_ENV === 'production'
        ? join(process.cwd(), 'dist', 'src', 'config')
        : join(process.cwd(), 'src', 'config');

    this.configPath = join(basePath, 'sites.json');
    this.marquesPath = join(basePath, 'marques.json');
  }

  async onModuleInit() {
    await this.chargerConfiguration();
    await this.chargerMarques();
  }

  async chargerConfiguration(): Promise<void> {
    try {
      this.logger.log(
        `Chargement de la configuration depuis ${this.configPath}`,
      );
      const contenu = await fs.readFile(this.configPath, 'utf8');
      this.configuration = JSON.parse(contenu) as ConfigurationSites;
      this.logger.log(
        `Configuration chargée avec succès: ${this.configuration.sites.length} sites trouvés.`,
      );
    } catch (erreur: unknown) {
      const errorMessage =
        erreur instanceof Error ? erreur.message : String(erreur);
      this.logger.error(
        `Erreur lors du chargement de la configuration: ${errorMessage}`,
      );
      // Initialiser avec une configuration par défaut si le fichier n'existe pas
      this.configuration = {
        sites: [],
        categories: [],
        intervalRafraichissement: 86400000,
      };
    }
  }

  async chargerMarques(): Promise<void> {
    try {
      this.logger.log(`Chargement des marques depuis ${this.marquesPath}`);
      const contenu = await fs.readFile(this.marquesPath, 'utf8');
      this.configurationMarques = JSON.parse(contenu) as ConfigurationMarques;
      this.logger.log(
        `Marques chargées avec succès: ${this.configurationMarques.marques.length} marques trouvées.`,
      );
    } catch (erreur: unknown) {
      const errorMessage =
        erreur instanceof Error ? erreur.message : String(erreur);
      this.logger.error(
        `Erreur lors du chargement des marques: ${errorMessage}`,
      );
      // Initialiser avec une configuration par défaut si le fichier n'existe pas
      this.configurationMarques = {
        marques: [],
      };
    }
  }

  async sauvegarderConfiguration(): Promise<void> {
    try {
      await fs.writeFile(
        this.configPath,
        JSON.stringify(this.configuration, null, 2),
        'utf8',
      );
      this.logger.log('Configuration sauvegardée avec succès.');
    } catch (erreur: unknown) {
      const errorMessage =
        erreur instanceof Error ? erreur.message : String(erreur);
      this.logger.error(
        `Erreur lors de la sauvegarde de la configuration: ${errorMessage}`,
      );
    }
  }

  async sauvegarderMarques(): Promise<void> {
    try {
      await fs.writeFile(
        this.marquesPath,
        JSON.stringify(this.configurationMarques, null, 2),
        'utf8',
      );
      this.logger.log('Marques sauvegardées avec succès.');
    } catch (erreur: unknown) {
      const errorMessage =
        erreur instanceof Error ? erreur.message : String(erreur);
      this.logger.error(
        `Erreur lors de la sauvegarde des marques: ${errorMessage}`,
      );
    }
  }

  getSites(): SiteConfig[] {
    return this.configuration?.sites || [];
  }

  getSiteById(id: string): SiteConfig | undefined {
    return this.configuration?.sites.find((site) => site.id === id);
  }

  getCategories(): Categorie[] {
    return this.configuration?.categories || [];
  }

  getCategorieById(id: string): Categorie | undefined {
    return this.configuration?.categories.find(
      (categorie) => categorie.id === id,
    );
  }

  getMarques(): Marque[] {
    return this.configurationMarques?.marques || [];
  }

  getMarqueById(id: string): Marque | undefined {
    return this.configurationMarques?.marques.find(
      (marque) => marque.id === id,
    );
  }

  getMarquesByCategorie(categorieId: string): Marque[] {
    return (
      this.configurationMarques?.marques.filter((marque) =>
        marque.categories.includes(categorieId),
      ) || []
    );
  }

  getMarqueByNom(nom: string): Marque | undefined {
    return this.configurationMarques?.marques.find(
      (marque) => marque.nom.toLowerCase() === nom.toLowerCase(),
    );
  }

  getIntervalRafraichissement(): number {
    return this.configuration?.intervalRafraichissement || 86400000; // 24h par défaut
  }

  async ajouterSite(site: SiteConfig): Promise<SiteConfig> {
    if (!this.configuration.sites) {
      this.configuration.sites = [];
    }

    // Vérifier si le site existe déjà
    const siteExistant = this.configuration.sites.find((s) => s.id === site.id);
    if (siteExistant) {
      throw new Error(`Un site avec l'ID ${site.id} existe déjà.`);
    }

    this.configuration.sites.push(site);
    await this.sauvegarderConfiguration();
    return site;
  }

  async modifierSite(
    id: string,
    site: Partial<SiteConfig>,
  ): Promise<SiteConfig> {
    const index = this.configuration.sites.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Site avec l'ID ${id} non trouvé.`);
    }

    this.configuration.sites[index] = {
      ...this.configuration.sites[index],
      ...site,
    };

    await this.sauvegarderConfiguration();
    return this.configuration.sites[index];
  }

  async supprimerSite(id: string): Promise<void> {
    const index = this.configuration.sites.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Site avec l'ID ${id} non trouvé.`);
    }

    this.configuration.sites.splice(index, 1);
    await this.sauvegarderConfiguration();
  }

  async ajouterMarque(marque: Marque): Promise<Marque> {
    if (!this.configurationMarques.marques) {
      this.configurationMarques.marques = [];
    }

    // Vérifier si la marque existe déjà
    const marqueExistante = this.configurationMarques.marques.find(
      (m) => m.id === marque.id,
    );
    if (marqueExistante) {
      throw new Error(`Une marque avec l'ID ${marque.id} existe déjà.`);
    }

    this.configurationMarques.marques.push(marque);
    await this.sauvegarderMarques();
    return marque;
  }

  async modifierMarque(id: string, marque: Partial<Marque>): Promise<Marque> {
    const index = this.configurationMarques.marques.findIndex(
      (m) => m.id === id,
    );
    if (index === -1) {
      throw new Error(`Marque avec l'ID ${id} non trouvée.`);
    }

    this.configurationMarques.marques[index] = {
      ...this.configurationMarques.marques[index],
      ...marque,
    };

    await this.sauvegarderMarques();
    return this.configurationMarques.marques[index];
  }

  async supprimerMarque(id: string): Promise<void> {
    const index = this.configurationMarques.marques.findIndex(
      (m) => m.id === id,
    );
    if (index === -1) {
      throw new Error(`Marque avec l'ID ${id} non trouvée.`);
    }

    this.configurationMarques.marques.splice(index, 1);
    await this.sauvegarderMarques();
  }
}

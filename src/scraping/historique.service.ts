import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Produit } from './interfaces/produit.interface';

// Type pour représenter une recherche avec ses produits associés

@Injectable()
export class HistoriqueService {
  private readonly logger = new Logger(HistoriqueService.name);

  constructor(private readonly prisma: PrismaService) {}

  async enregistrerRecherche(
    siteId: string,
    categorie: string,
    motCle: string | null,
    produits: Produit[],
    dureeMs: number,
  ): Promise<any> {
    try {
      this.logger.log(
        `Enregistrement d'une recherche pour ${siteId}, ${categorie}, ${motCle ?? 'sans mot-clé'}`,
      );

      const recherche = await this.prisma.recherche.create({
        data: {
          siteId,
          categorie,
          motCle: motCle ?? null,
          nombreResultats: produits.length,
          dureeMs,
          produits: {
            create: produits.map((produit) => ({
              nom: produit.nom,
              prix: produit.prix,
              url: produit.url,
              image: produit.image ?? null,
              disponibilite: produit.disponibilite ?? null,
              categorie: produit.categorie ?? 'Non spécifiée',
              marque: produit.marque ?? 'Inconnue',
              dateScraping: new Date(produit.dateScraping),
            })),
          },
        },
      });

      this.logger.log(`Recherche enregistrée avec succès. ID: ${recherche.id}`);
      return recherche;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Erreur lors de l'enregistrement de la recherche: ${errorMessage}`,
      );
      // Ne pas bloquer l'application si l'enregistrement échoue
      return null;
    }
  }

  async getHistoriqueRecherches(limit = 10, skip = 0): Promise<any[]> {
    try {
      return await this.prisma.recherche.findMany({
        take: limit,
        skip,
        orderBy: {
          dateRecherche: 'desc',
        },
        include: {
          produits: true,
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Erreur lors de la récupération de l'historique: ${errorMessage}`,
      );
      return [];
    }
  }

  async getHistoriqueParSite(
    siteId: string,
    limit = 10,
    skip = 0,
  ): Promise<any[]> {
    try {
      return await this.prisma.recherche.findMany({
        where: {
          siteId,
        },
        take: limit,
        skip,
        orderBy: {
          dateRecherche: 'desc',
        },
        include: {
          produits: true,
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Erreur lors de la récupération de l'historique pour le site ${siteId}: ${errorMessage}`,
      );
      return [];
    }
  }

  async getProduitsParRecherche(rechercheId: number): Promise<any[]> {
    try {
      return await this.prisma.produit.findMany({
        where: {
          rechercheId,
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Erreur lors de la récupération des produits pour la recherche ${rechercheId}: ${errorMessage}`,
      );
      return [];
    }
  }
}

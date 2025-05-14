import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoriqueService } from './historique.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ScrapingController],
  providers: [ScrapingService, HistoriqueService],
  exports: [ScrapingService, HistoriqueService],
})
export class ScrapingModule {}

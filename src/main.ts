import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Configuration de Swagger
  const options = new DocumentBuilder()
    .setTitle('Scrapper API')
    .setDescription(
      'API de scraping et comparaison de prix de matériel informatique',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Environnement local')
    .addTag('Scraping', 'Endpoints pour le scraping des sites e-commerce')
    .addTag('Historique', "Endpoints pour la gestion de l'historique")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `L'application est en cours d'exécution sur: http://localhost:${port}`,
  );
  logger.log(
    `Documentation Swagger disponible sur: http://localhost:${port}/api-docs`,
  );
}

bootstrap();

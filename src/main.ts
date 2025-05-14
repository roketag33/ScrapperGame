import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `L'application est en cours d'exécution sur: http://localhost:${port}`,
  );
}

bootstrap();

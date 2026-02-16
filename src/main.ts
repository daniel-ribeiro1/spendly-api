import { configDotenv } from 'dotenv';

import { AppModule } from '@/app.module';
import { setupRequestValidation } from '@/core/configs/request-validation.config';
import { setupSwagger } from '@/core/configs/swagger.config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

configDotenv();

async function bootstrap() {
  const API_PORT = process.env.API_PORT ?? 3000;
  const SWAGGER_PATH = 'swagger';

  const app = await NestFactory.create(AppModule);

  setupRequestValidation(app);
  setupSwagger(app, SWAGGER_PATH);

  await app.listen(API_PORT);

  Logger.log(`API is running: http://localhost:${API_PORT} 🔥🚀🎉`, 'Main');
  Logger.log(
    `Swagger is available: http://localhost:${process.env.API_PORT}/${SWAGGER_PATH}`,
    'SwaggerConfig',
  );
}

void bootstrap();

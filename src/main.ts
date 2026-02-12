import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';

configDotenv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const API_PORT = process.env.API_PORT ?? 3000;

  await app.listen(API_PORT);
  Logger.log(`API is running on port ${API_PORT}`, 'Main');
}

void bootstrap();

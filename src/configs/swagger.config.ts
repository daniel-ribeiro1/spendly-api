import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, path = 'swagger'): void {
  const config = new DocumentBuilder()
    .setTitle('Spendly API')
    .setDescription('The Spendly API description')
    .setVersion('1.0')
    .addTag('spendly')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, documentFactory);
}

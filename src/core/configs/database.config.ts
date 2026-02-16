import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

export const PEISMA_ADAPTER = 'PRISMA_ADAPTER';

export const PostgresAdapterProvider: Provider = {
  provide: PEISMA_ADAPTER,
  useFactory: (configService: ConfigService) => {
    const DATABASE_URL = `postgresql://${configService.getOrThrow('DB_USER')}:${configService.getOrThrow('DB_PASSWORD')}@${configService.getOrThrow('DB_HOST')}:${configService.getOrThrow('DB_PORT')}/${configService.getOrThrow('DB_NAME')}?schema=public`;

    return new PrismaPg({
      connectionString: DATABASE_URL,
      debug: true,
    });
  },
  inject: [ConfigService],
};

import { EnvironmentKey } from '@/shared/enums/environment.enum';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

export const PRISMA_ADAPTER = 'PRISMA_ADAPTER';

export const PostgresAdapterProvider: Provider = {
  provide: PRISMA_ADAPTER,
  useFactory: (configService: ConfigService) => {
    const DATABASE_URL = `postgresql://${configService.getOrThrow(EnvironmentKey.DB_USER)}:${configService.getOrThrow(EnvironmentKey.DB_PASSWORD)}@${configService.getOrThrow(EnvironmentKey.DB_HOST)}:${configService.getOrThrow(EnvironmentKey.DB_PORT)}/${configService.getOrThrow(EnvironmentKey.DB_NAME)}?schema=public`;

    return new PrismaPg({
      connectionString: DATABASE_URL,
      debug: true,
    });
  },
  inject: [ConfigService],
};

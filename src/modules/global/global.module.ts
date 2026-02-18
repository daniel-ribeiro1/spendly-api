import { ClsModule, ClsService } from 'nestjs-cls';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';

import { PostgresAdapterProvider } from '@/core/configs/database.config';
import { RequestExceptionFilter } from '@/core/filters/request-exception.filter';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { PrismaService } from '@/shared/services/prisma.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join('.', 'src', 'i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  providers: [
    PostgresAdapterProvider,
    PrismaService,
    {
      provide: LocalStorageService,
      useExisting: ClsService,
    },
    {
      provide: APP_FILTER,
      useClass: RequestExceptionFilter,
    },
  ],
  exports: [LocalStorageService, PrismaService],
})
export class GlobalModule {}

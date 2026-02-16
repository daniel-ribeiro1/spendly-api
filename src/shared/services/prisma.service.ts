import { PEISMA_ADAPTER } from '@/core/configs/database.config';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as DatabaseClient from '@prisma/client/runtime/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(PEISMA_ADAPTER) adapter: DatabaseClient.SqlDriverAdapterFactory,
    readonly configService: ConfigService,
  ) {
    super({
      adapter,
    });
  }

  onModuleInit() {
    void this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

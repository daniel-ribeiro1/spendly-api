import { PRISMA_ADAPTER } from '@/core/configs/database.config';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as DatabaseClient from '@prisma/client/runtime/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(PRISMA_ADAPTER) adapter: DatabaseClient.SqlDriverAdapterFactory,
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

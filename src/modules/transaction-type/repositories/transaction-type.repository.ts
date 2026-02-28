import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionTypeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<TransactionType[]> {
    return this.prismaService.transactionType.findMany();
  }
}

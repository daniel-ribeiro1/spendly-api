import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    body: Pick<
      Transaction,
      | 'name'
      | 'description'
      | 'amount'
      | 'date'
      | 'transactionTypeId'
      | 'transactionFolderId'
      | 'transactionCategoryId'
      | 'userId'
    >,
  ): Promise<Transaction> {
    return this.prismaService.transaction.create({
      data: body,
    });
  }

  findAllByTransactionFolderId(
    transactionFolderId: string,
  ): Promise<Transaction[]> {
    return this.prismaService.transaction.findMany({
      where: {
        transactionFolderId,
        isActive: true,
      },
    });
  }

  async softDeleteMany(ids: string[]): Promise<void> {
    await this.prismaService.transaction.updateMany({
      where: { id: { in: ids } },
      data: { isActive: false },
    });
  }

  async undoSoftDeleteMany(ids: string[]): Promise<void> {
    await this.prismaService.transaction.updateMany({
      where: { id: { in: ids } },
      data: { isActive: true },
    });
  }
}

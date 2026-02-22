import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { TransactionCategory } from '@prisma/client';

@Injectable()
export class TransactionCategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    data: Pick<TransactionCategory, 'name' | 'image' | 'userId'>,
  ): Promise<TransactionCategory> {
    return this.prismaService.transactionCategory.create({
      data,
    });
  }

  findByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<TransactionCategory | null> {
    return this.prismaService.transactionCategory.findFirst({
      where: { name, userId },
    });
  }
}

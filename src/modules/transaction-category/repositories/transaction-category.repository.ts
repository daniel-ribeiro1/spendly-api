import { PrismaService } from '@/shared/services/prisma.service';
import { StringUtil } from '@/shared/utils/string.util';
import { Injectable } from '@nestjs/common';
import { TransactionCategory } from '@prisma/client';

@Injectable()
export class TransactionCategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    data: Pick<TransactionCategory, 'name' | 'image' | 'userId'>,
  ): Promise<TransactionCategory> {
    return this.prismaService.transactionCategory.create({
      data: {
        ...data,
        normalizedName: StringUtil.normalizeString(data.name),
      },
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

  findAllByUserId(
    userId: string,
    searchTerm?: string,
  ): Promise<TransactionCategory[]> {
    return this.prismaService.transactionCategory.findMany({
      where: {
        normalizedName: searchTerm
          ? {
              contains: StringUtil.normalizeString(searchTerm),
              mode: 'insensitive',
            }
          : undefined,
        OR: [{ userId }, { userId: null }],
      },
    });
  }

  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<TransactionCategory | null> {
    return this.prismaService.transactionCategory.findFirst({
      where: { id, userId, isActive: true },
    });
  }
}

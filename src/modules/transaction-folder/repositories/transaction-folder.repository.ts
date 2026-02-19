import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { TransactionFolder } from '@prisma/client';

@Injectable()
export class TransactionFolderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: string): Promise<TransactionFolder | null> {
    return this.prismaService.transactionFolder.findUnique({
      where: { id, isActive: true },
    });
  }

  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<TransactionFolder | null> {
    return this.prismaService.transactionFolder.findUnique({
      where: { id, userId, isActive: true },
    });
  }

  create(
    data: Pick<TransactionFolder, 'name' | 'image' | 'description' | 'userId'>,
  ): Promise<TransactionFolder> {
    return this.prismaService.transactionFolder.create({
      data,
    });
  }

  update(
    id: string,
    data: Partial<TransactionFolder>,
  ): Promise<TransactionFolder> {
    return this.prismaService.transactionFolder.update({
      where: { id },
      data,
    });
  }
}

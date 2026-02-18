import { PrismaService } from '@/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { TransactionFolder } from '@prisma/client';

@Injectable()
export class TransactionFolderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    data: Pick<TransactionFolder, 'name' | 'image' | 'description' | 'userId'>,
  ): Promise<TransactionFolder> {
    return this.prismaService.transactionFolder.create({
      data,
    });
  }
}

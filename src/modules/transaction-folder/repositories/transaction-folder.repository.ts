import {
  PagedResponse,
  PaginationMetadata,
  PaginationOptionsQuery,
} from '@/shared/dtos/pagination.dto';
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

  async findAllPaged(
    userId: string,
    { page, take, orderBy }: PaginationOptionsQuery<TransactionFolder>,
  ): Promise<PagedResponse<TransactionFolder>> {
    const query = {
      take,
      skip: take * (page - 1),
      orderBy,
      where: {
        userId,
        isActive: true,
      },
    };

    const [data, total] = await Promise.all([
      this.prismaService.transactionFolder.findMany(query),
      this.prismaService.transactionFolder.count({
        where: query.where,
      }),
    ]);

    return new PagedResponse(
      data,
      new PaginationMetadata({
        page,
        take,
        total,
      }),
    );
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

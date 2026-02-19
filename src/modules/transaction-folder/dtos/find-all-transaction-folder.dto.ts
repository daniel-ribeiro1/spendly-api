import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { IsOrderBy } from '@/shared/decorators/is-order-by.decorator';
import { ToOrderBy } from '@/shared/decorators/to-order-by.decorator';
import { OrderBy } from '@/shared/enums/pagination.enum';
import { PaginationOptionsQuery } from '@/shared/dtos/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionFolder } from '@prisma/client';

export class FindAllTransactionFolderResponse implements Omit<
  TransactionFolderEntity,
  'isActive' | 'userId'
> {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  image: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class TransactionFolderPaginationQuery extends PaginationOptionsQuery<TransactionFolderEntity> {
  @ApiPropertyOptional({
    type: String,
    description: 'Ordenação da lista por coluna.',
    isArray: true,
    default: ['name:asc', 'createdAt:desc', 'updatedAt:asc'],
  })
  @IsOptional()
  @IsOrderBy<TransactionFolder>(['name', 'createdAt', 'updatedAt'])
  @ToOrderBy()
  declare orderBy?: Record<keyof TransactionFolder, OrderBy>[];
}

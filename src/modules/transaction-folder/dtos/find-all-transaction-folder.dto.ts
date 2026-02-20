import { IsOptional } from 'class-validator';

import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { IsOrderBy } from '@/shared/decorators/is-order-by.decorator';
import { ToOrderBy } from '@/shared/decorators/to-order-by.decorator';
import { OrderBy } from '@/shared/enums/pagination.enum';
import { PaginationOptionsQuery } from '@/shared/dtos/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionFolder } from '@prisma/client';

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

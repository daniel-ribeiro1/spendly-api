import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { OrderBy } from '@/shared/enums/pagination.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationOptionsQuery<T = void> {
  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  page: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  take: number = 10;

  orderBy?: Record<keyof T, OrderBy>[];
}

export class PaginationMetadata implements Pick<
  PaginationOptionsQuery,
  'page' | 'take'
> {
  @ApiProperty({
    description: 'Quantidade de itens',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
  })
  take: number;

  @ApiProperty({
    description: 'Quantidade total de itens',
    example: 1,
  })
  total: number;

  @ApiProperty({
    description: 'Indica se existe uma página anterior',
    example: true,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Indica se existe uma próxima página',
    example: true,
  })
  hasNextPage: boolean;

  constructor(metadata: Pick<PaginationMetadata, 'page' | 'take' | 'total'>) {
    Object.assign(this, metadata);

    this.hasPreviousPage = metadata.page > 1;
    this.hasNextPage = metadata.page * metadata.take < metadata.total;
  }
}

export class PagedResponse<T> {
  @Expose()
  data: T[];

  @Expose()
  @Type(() => PaginationMetadata)
  metadata: PaginationMetadata;

  constructor(data: T[], metadata: PaginationMetadata) {
    this.data = data;
    this.metadata = metadata;
  }
}

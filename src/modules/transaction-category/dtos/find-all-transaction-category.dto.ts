import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllTransactionCategoryQuery {
  @ApiPropertyOptional({
    description: 'Termo de busca para categorias de movimentação financeira.',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  searchTerm?: string;
}

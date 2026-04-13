import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import Decimal from 'decimal.js';

import { IsDecimalJs } from '@/shared/decorators/is-decimal-js.decorator';
import { ToDecimalJs } from '@/shared/decorators/to-decimal-js.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transaction } from '@prisma/client';

export class TransactionEntity implements Transaction {
  @ApiProperty({
    description: 'Id da movimentação financeira',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Nome da movimentação financeira',
    example: 'Compra do Civic 2021',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da movimentação financeira',
    example: 'Compra do Civic 2021 modelo Touring',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  @IsOptional()
  description: string | null;

  @ApiProperty({
    description: 'Valor da movimentação financeira',
    example: 120_000.0,
  })
  @IsDecimalJs()
  @ToDecimalJs()
  amount: Decimal;

  @ApiProperty({
    description: 'Data da movimentação financeira',
    example: '2026-11-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Status da movimentação financeira',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação da movimentação financeira',
    example: '2026-11-01T00:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização da movimentação financeira',
    example: '2026-11-01T00:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'Id do tipo da movimentação financeira',
    example: 1,
  })
  @IsNumber()
  transactionTypeId: number;

  @ApiProperty({
    description:
      'Id da pasta de movimentação financeira que a movimentação financeira pertence',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsUUID()
  transactionFolderId: string;

  @ApiProperty({
    description:
      'Id da categoria da movimentação financeira que a movimentação financeira pertence',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsUUID()
  @IsOptional()
  transactionCategoryId: string | null;

  @ApiProperty({
    description: 'Id do usuário que criou a movimentação financeira',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsUUID()
  userId: string;
}

import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { TransactionTypeName } from '@/shared/enums/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class TransactionTypeEntity implements TransactionType {
  @ApiProperty({
    description: 'Id do tipo da movimentação financeira',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Nome do tipo da movimentação financeira',
    example: 'EXPENSE',
  })
  @IsString()
  @IsEnum(TransactionTypeName)
  @IsNotEmpty()
  name: TransactionTypeName;

  @ApiProperty({
    description: 'Ordem de listagem do tipo da movimentação financeira',
    example: 1,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'Status do tipo da movimentação financeira',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação do tipo da movimentação financeira',
    example: '2023-06-15T00:00:00.000Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do tipo da movimentação financeira',
    example: '2023-06-15T00:00:00.000Z',
  })
  @IsDateString()
  updatedAt: Date;
}

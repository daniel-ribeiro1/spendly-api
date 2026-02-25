import { ApiProperty } from '@nestjs/swagger';
import { TransactionCategory } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TransactionCategoryEntity implements TransactionCategory {
  @ApiProperty({
    description: 'Id da categoria da movimentação financeira',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Nome da categoria da movimentação financeira',
    example: 'Alimentação',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Imagem da categoria da movimentação financeira',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  image: string | null;

  @ApiProperty({
    description: 'Status da categoria da movimentação financeira',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação da categoria da movimentação financeira',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização da categoria da movimentação financeira',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({
    description:
      'Id do usuário que criou a categoria da movimentação financeira',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsString()
  @IsUUID()
  userId: string | null;

  /**
   *  Utilizado para normalizar o nome da categoria da movimentação financeira
   * e facilitar a busca no banco de dados.
   */
  normalizedName: string;
}

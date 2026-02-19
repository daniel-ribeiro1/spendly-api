import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsStrictOptional } from '@/shared/decorators/is-strict-optional.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionFolder } from '@prisma/client';

export class TransactionFolderEntity implements TransactionFolder {
  @ApiProperty({
    description: 'Id da pasta de movimentação do usuário',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Nome da pasta de movimentação do usuário',
    example: 'Gerenciamento de gastos',
  })
  @IsStrictOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da pasta de movimentação do usuário',
    example: 'Pasta para gerenciamento de gastos',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  description: string | null;

  @ApiPropertyOptional({
    description: 'Imagem da pasta de movimentação do usuário',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  image: string | null;

  @ApiProperty({
    description: 'Status da pasta de movimentação do usuário',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Id do usuário que criou a pasta',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Data de criação da pasta de movimentação do usuário',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização da pasta de movimentação do usuário',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsDateString()
  updatedAt: Date;
}

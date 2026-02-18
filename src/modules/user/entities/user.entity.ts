import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    description: 'Id do usuário',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @IsUUID()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Admin do Sistema',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senh@123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Foto de perfil do usuário',
    example: 'https://example.com/300',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  picture: string | null;

  @ApiProperty({
    description: 'Status do usuário',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do usuário',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsDateString()
  updatedAt: Date;
}

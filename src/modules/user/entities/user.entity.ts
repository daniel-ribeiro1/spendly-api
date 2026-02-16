import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    description: 'Id do usuário',
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
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
  password: string;

  @ApiProperty({
    description: 'Foto de perfil do usuário',
    example: 'https://example.com/300',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  picture: string | null;

  @ApiProperty({
    description: 'Status do usuário',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do usuário',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

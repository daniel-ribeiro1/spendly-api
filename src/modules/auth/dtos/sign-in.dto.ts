import { IsString } from 'class-validator';

import { UserEntity } from '@/modules/user/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SignInBody extends PickType(UserEntity, ['email']) {
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senh@123456',
  })
  @IsString()
  password: string;
}

export class SignInResponse {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

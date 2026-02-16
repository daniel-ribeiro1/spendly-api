import { Exclude, Expose } from 'class-transformer';

import { UserEntity } from '@/modules/user/entities/user.entity';
import { OmitType } from '@nestjs/swagger';

export class SignUpDto extends OmitType(UserEntity, [
  'id',
  'isActive',
  'createdAt',
  'updatedAt',
]) {}

export class SignUpResponseSwagger extends OmitType(UserEntity, [
  'isActive',
  'password',
  'createdAt',
  'updatedAt',
]) {}

export class SignUpResponse implements Pick<
  UserEntity,
  'id' | 'name' | 'email' | 'picture'
> {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  picture: string | null;

  @Exclude()
  password: string;
}

import { UserEntity } from '@/modules/user/entities/user.entity';
import { Exception } from '@/shared/enums/exceptions.enum';
import { createRequestExceptionSwaggerModel } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  OmitType,
} from '@nestjs/swagger';

export class SignUpResponseSwaggerModel extends OmitType(UserEntity, [
  'isActive',
  'password',
  'createdAt',
  'updatedAt',
]) {}

export function SignUpResponseSwagger(): MethodDecorator & ClassDecorator {
  const path = '/auth/sign-up';

  return applyDecorators(
    ApiOperation({
      summary: 'Cadastrar um usuário no sistema.',
    }),
    ApiCreatedResponse({
      type: SignUpResponseSwaggerModel,
      description: 'Usuário cadastrado com sucesso.',
    }),
    ApiConflictResponse({
      description:
        'Já existe um usuário cadastrado no sistema com o e-mail informado.',
      type: createRequestExceptionSwaggerModel({
        path,
        status: HttpStatus.CONFLICT,
        exception: Exception.USER_ALREADY_EXISTS,
        message: 'A user with this email already exists.',
      }),
    }),
  );
}

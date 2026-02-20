import { Exception } from '@/shared/enums/exceptions.enum';
import { createRequestExceptionSwaggerSchema } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export class SignInResponseSwaggerModel {
  @ApiProperty({
    description: 'Token de acesso do usuário',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token de atualização do token de acesso do usuário',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  refreshToken: string;
}

export function SignInResponseSwagger(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Autenticar um usuário no sistema.',
    }),
    ApiCreatedResponse({
      type: SignInResponseSwaggerModel,
      description: 'Usuário autenticado com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'E-mail e/ou senha inválidos.',
      type: createRequestExceptionSwaggerSchema({
        example: {
          path: '/auth/sign-in',
          status: HttpStatus.UNAUTHORIZED,
          exception: Exception.INVALID_CREDENTIALS,
          message: 'Invalid email or password.',
        },
      }),
    }),
  );
}

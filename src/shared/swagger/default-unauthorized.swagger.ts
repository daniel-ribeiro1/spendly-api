import { Exception } from '@/shared/enums/exceptions.enum';
import { createRequestExceptionSwaggerSchema } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiCustomUnauthorizedResponse(metadata?: {
  sehcma: {
    name: string;
    description?: string;
  };
  example?: {
    path?: string;
    message?: string;
  };
}): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: metadata?.sehcma?.description || 'Usuário não autorizado.',
      type: createRequestExceptionSwaggerSchema({
        schema: {
          name: metadata?.sehcma?.name,
        },
        example: {
          path: metadata?.example?.path || '/endpoint',
          status: HttpStatus.UNAUTHORIZED,
          exception: Exception.UNAUTHORIZED,
          message: metadata?.example?.message || 'User is not authorized.',
        },
      }),
    }),
  );
}

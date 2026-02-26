import { Exception } from '@/shared/enums/exceptions.enum';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { createRequestExceptionSwaggerSchema } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function DeleteTransactionCategorySwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Remover uma categoria de movimentação financeira do usuário.',
    }),
    ApiNoContentResponse({
      description: 'Categoria de movimentação financeira removida com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedDeleteTransactionCategory',
      },
      example: {
        path: '/transaction-category/:id',
        message: 'User is not authorized.',
      },
    }),
    ApiNotFoundResponse({
      description: 'Categoria de movimentação financeira não encontrada.',
      type: createRequestExceptionSwaggerSchema({
        schema: {
          name: 'RequestExceptionNotFoundDeleteTransactionCategory',
        },
        example: {
          path: '/transaction-category/:id',
          status: HttpStatus.NOT_FOUND,
          exception: Exception.TRANSACTION_CATEGORY_NOT_FOUND,
          message: 'Transaction category not found.',
        },
      }),
    }),
  );
}

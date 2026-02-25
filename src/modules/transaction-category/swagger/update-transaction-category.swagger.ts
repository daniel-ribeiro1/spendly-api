import { TransactionCategorySwaggerModel } from '@/modules/transaction-category/swagger/transaction-category.swagger';
import { Exception } from '@/shared/enums/exceptions.enum';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { createRequestExceptionSwaggerSchema } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function UpdateTransactionCategorySwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar uma categoria de movimentação financeira do usuário.',
    }),
    ApiOkResponse({
      type: TransactionCategorySwaggerModel,
      description:
        'Categoria de movimentação financeira atualizada com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedUpdateTransactionCategory',
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
          name: 'RequestExceptionNotFoundUpdateTransactionCategory',
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

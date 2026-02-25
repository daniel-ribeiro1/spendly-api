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

export function FindOneTransactionCategorySwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter os detalhes de uma categoria de movimentação financeira.',
    }),
    ApiOkResponse({
      type: TransactionCategorySwaggerModel,
      description:
        'Detalhes da categoria de movimentação financeira obtidos com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedFindOneTransactionCategory',
      },
      example: {
        path: '/transaction-category',
        message: 'User is not authorized.',
      },
    }),
    ApiNotFoundResponse({
      description: 'Categoria de movimentação financeira não encontrada.',
      type: createRequestExceptionSwaggerSchema({
        example: {
          path: '/transaction-category',
          status: HttpStatus.NOT_FOUND,
          exception: Exception.TRANSACTION_CATEGORY_NOT_FOUND,
          message: 'Transaction category not found.',
        },
      }),
    }),
  );
}

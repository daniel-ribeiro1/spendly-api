import { TransactionCategorySwaggerModel } from '@/modules/transaction-category/swagger/transaction-category.swagger';
import { Exception } from '@/shared/enums/exceptions.enum';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { createRequestExceptionSwaggerSchema } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function CreateTransactionCategorySwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar uma categoria de movimentação financeira do usuário.',
    }),
    ApiCreatedResponse({
      type: TransactionCategorySwaggerModel,
      description: 'Categoria de movimentação financeira criada com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedCreateTransactionCategory',
      },
      example: {
        path: '/transaction-category',
        message: 'User is not authorized.',
      },
    }),
    ApiConflictResponse({
      description: 'Categoria de movimentação financeira já cadastrada.',
      type: createRequestExceptionSwaggerSchema({
        example: {
          path: '/transaction-category',
          status: HttpStatus.CONFLICT,
          exception: Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS,
          message: 'Transaction category already exists.',
        },
      }),
    }),
  );
}

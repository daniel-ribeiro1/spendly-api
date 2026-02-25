import { TransactionCategorySwaggerModel } from '@/modules/transaction-category/swagger/transaction-category.swagger';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function FindAllTransactionCategorySwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary:
        'Listar todas as categorias de movimentação financeira do usuário.',
    }),
    ApiOkResponse({
      type: TransactionCategorySwaggerModel,
      isArray: true,
      description:
        'Categorias de movimentação financeira listadas com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedFindAllTransactionCategory',
      },
      example: {
        path: '/transaction-category',
        message: 'User is not authorized.',
      },
    }),
  );
}

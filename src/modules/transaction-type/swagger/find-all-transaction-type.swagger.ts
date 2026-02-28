import { TransactionTypeSwaggerModel } from '@/modules/transaction-type/swagger/transaction-type.swagger';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function FindAllTransactionTypeSwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar todos os tipos de movimentação financeira.',
    }),
    ApiOkResponse({
      type: TransactionTypeSwaggerModel,
      isArray: true,
      description: 'Tipos de movimentação financeira listados com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedFindAllTransactionType',
      },
      example: {
        path: '/transaction-type',
        message: 'User is not authorized.',
      },
    }),
  );
}

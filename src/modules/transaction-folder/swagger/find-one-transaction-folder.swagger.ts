import { DefaultTransactionFolderSwaggerModel } from '@/modules/transaction-folder/swagger/transaction-folder.swagger';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

export function FindOneTransactionFolderResponseSwagger(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter os detalhes de uma pasta de movimentação financeira.',
    }),
    ApiCreatedResponse({
      type: DefaultTransactionFolderSwaggerModel,
      description:
        'Detalhes da pasta de movimentação financeira obtidos com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedFindOneTransactionFolder',
      },
      example: {
        path: '/transaction-folder/:id',
        message: 'User is not authorized.',
      },
    }),
  );
}

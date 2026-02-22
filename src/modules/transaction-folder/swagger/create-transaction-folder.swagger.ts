import { DefaultTransactionFolderSwaggerModel } from '@/modules/transaction-folder/swagger/transaction-folder.swagger';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

export function CreateTransactionFolderSwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar uma pasta de movimentação financeira do usuário.',
    }),
    ApiCreatedResponse({
      type: DefaultTransactionFolderSwaggerModel,
      description: 'Pasta de movimentação financeira criada com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedCreateTransactionFolder',
      },
      example: {
        path: '/transaction-folder',
        message: 'User is not authorized.',
      },
    }),
  );
}

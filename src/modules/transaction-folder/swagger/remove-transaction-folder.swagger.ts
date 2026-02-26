import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';

export function RemoveTransactionFolderSwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary:
        'Remover logicamente uma pasta de movimentação financeira do usuário.',
    }),
    ApiNoContentResponse({
      description: 'Pasta de movimentação financeira removida com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedRemoveTransactionFolder',
      },
      example: {
        path: '/transaction-folder/:id',
        message: 'User is not authorized.',
      },
    }),
  );
}

import { DefaultTransactionFolderSwaggerModel } from '@/modules/transaction-folder/swagger/transaction-folder.swagger';
import { ApiPagedResponse } from '@/shared/decorators/pagination.decorator';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export function FindAllTransactionFolderSwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar todas as pastas de movimentação financeira do usuário.',
    }),
    ApiPagedResponse(DefaultTransactionFolderSwaggerModel, {
      description: 'Pastas de movimentação financeira listadas com sucesso.',
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedFindAllTransactionFolder',
      },
      example: {
        path: '/transaction-folder',
        message: 'User is not authorized.',
      },
    }),
  );
}

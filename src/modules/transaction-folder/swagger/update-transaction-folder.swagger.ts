import { DefaultTransactionFolderSwaggerModel } from '@/modules/transaction-folder/swagger/transaction-folder.swagger';
import { Exception } from '@/shared/enums/exceptions.enum';
import { ApiCustomUnauthorizedResponse } from '@/shared/swagger/default-unauthorized.swagger';
import { createRequestExceptionSwaggerSchema } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function UpdateTransactionFolderSwaggerResponse(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza uma pasta de movimentação financeira do usuário.',
    }),
    ApiOkResponse({
      type: DefaultTransactionFolderSwaggerModel,
      description: 'Pasta de movimentação financeira atualizada com sucesso.',
    }),
    ApiNotFoundResponse({
      description: 'Pasta de movimentação financeira não encontrada.',
      type: createRequestExceptionSwaggerSchema({
        example: {
          path: '/transaction-folder/:id',
          status: HttpStatus.NOT_FOUND,
          exception: Exception.TRANSACTION_FOLDER_NOT_FOUND,
          message: 'Transaction folder not found.',
        },
      }),
    }),
    ApiCustomUnauthorizedResponse({
      sehcma: {
        name: 'RequestExceptionUnauthorizedUpdateTransactionFolder',
      },
      example: {
        path: '/transaction-folder/:id',
        message: 'User is not authorized.',
      },
    }),
  );
}

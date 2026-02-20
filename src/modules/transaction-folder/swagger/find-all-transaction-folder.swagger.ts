import { DefaultTransactionFolderSwaggerModel } from '@/modules/transaction-folder/swagger/transaction-folder.swagger';
import { ApiPagedResponse } from '@/shared/decorators/pagination.decorator';
import { Exception } from '@/shared/enums/exceptions.enum';
import { createRequestExceptionSwaggerModel } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function FindAllTransactionFolderResponseSwagger(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar todas as pastas de movimentação financeira do usuário.',
    }),
    ApiPagedResponse(DefaultTransactionFolderSwaggerModel, {
      description: 'Pastas de movimentação financeira listadas com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description:
        'Usuário não autorizado para listar todas as pastas de movimentação financeira.',
      type: createRequestExceptionSwaggerModel({
        path: '/transaction-folder',
        status: HttpStatus.UNAUTHORIZED,
        exception: Exception.UNAUTHORIZED,
        message: 'User is not authorized.',
      }),
    }),
  );
}

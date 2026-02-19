import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { ApiPagedResponse } from '@/shared/decorators/pagination.decorator';
import { Exception } from '@/shared/enums/exceptions.enum';
import { createRequestExceptionSwaggerModel } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';

export class FindAllTransactionFolderSwaggerModel extends OmitType(
  TransactionFolderEntity,
  ['isActive', 'userId'],
) {}

export function FindAllTransactionFolderResponseSwagger(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar todas as pastas de movimentação financeira do usuário.',
    }),
    ApiPagedResponse(FindAllTransactionFolderSwaggerModel, {
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

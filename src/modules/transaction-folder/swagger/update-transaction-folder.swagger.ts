import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { Exception } from '@/shared/enums/exceptions.enum';
import { createRequestExceptionSwaggerModel } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';

export class UpdateTransactionFolderSwaggerModel extends OmitType(
  TransactionFolderEntity,
  ['isActive', 'userId'],
) {}

export function UpdateTransactionFolderResponseSwagger(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualiza uma pasta de movimentação financeira do usuário.',
    }),
    ApiOkResponse({
      type: UpdateTransactionFolderSwaggerModel,
      description: 'Pasta de movimentação financeira atualizada com sucesso.',
    }),
    ApiNotFoundResponse({
      description: 'Pasta de movimentação financeira não encontrada.',
      type: createRequestExceptionSwaggerModel({
        path: '/transaction-folder',
        status: HttpStatus.NOT_FOUND,
        exception: Exception.TRANSACTION_FOLDER_NOT_FOUND,
        message: 'Transaction folder not found.',
      }),
    }),
    ApiUnauthorizedResponse({
      description:
        'Usuário não autorizado para criar uma pasta de movimentação financeira.',
      type: createRequestExceptionSwaggerModel({
        path: '/transaction-folder',
        status: HttpStatus.UNAUTHORIZED,
        exception: Exception.UNAUTHORIZED,
        message: 'User is not authorized.',
      }),
    }),
  );
}

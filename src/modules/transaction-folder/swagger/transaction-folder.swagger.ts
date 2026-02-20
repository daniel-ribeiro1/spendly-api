import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { Exception } from '@/shared/enums/exceptions.enum';
import { createRequestExceptionSwaggerModel } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';

export class DefaultTransactionFolderSwaggerModel extends OmitType(
  TransactionFolderEntity,
  ['isActive', 'userId'],
) {}

export function DefaultTransactionFolderResponseSwagger(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar uma pasta de movimentação financeira do usuário.',
    }),
    ApiCreatedResponse({
      type: DefaultTransactionFolderSwaggerModel,
      description: 'Pasta de movimentação financeira criada com sucesso.',
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

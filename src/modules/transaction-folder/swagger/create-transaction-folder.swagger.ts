import { Exception } from '@/shared/enums/exceptions.enum';
import { createRequestExceptionSwaggerModel } from '@/shared/swagger/request-exception.swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';
import { TransactionFolderEntity } from '../entities/transaction-folder.entity';

export class CreateTransactionFolderSwaggerModel extends OmitType(
  TransactionFolderEntity,
  ['isActive', 'userId'],
) {}

export function CreateTransactionFolderResponseSwagger(): MethodDecorator &
  ClassDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar uma pasta de movimentação financeira do usuário.',
    }),
    ApiCreatedResponse({
      type: CreateTransactionFolderSwaggerModel,
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

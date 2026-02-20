import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { OmitType } from '@nestjs/swagger';

export class DefaultTransactionFolderSwaggerModel extends OmitType(
  TransactionFolderEntity,
  ['isActive', 'userId'],
) {}

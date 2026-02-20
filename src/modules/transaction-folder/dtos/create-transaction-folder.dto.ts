import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { PickType } from '@nestjs/swagger';

export class CreateTransactionFolderBody extends PickType(
  TransactionFolderEntity,
  ['name', 'description', 'image'],
) {}

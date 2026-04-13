import { TransactionEntity } from '@/modules/transaction/entities/transaction.entity';
import { PickType } from '@nestjs/swagger';

export class CreateTransactionBody extends PickType(TransactionEntity, [
  'name',
  'description',
  'amount',
  'date',
  'transactionTypeId',
  'transactionCategoryId',
  'transactionFolderId',
]) {}

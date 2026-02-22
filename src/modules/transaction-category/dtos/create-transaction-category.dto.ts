import { TransactionCategoryEntity } from '@/modules/transaction-category/entities/transaction-category.entity';
import { PickType } from '@nestjs/swagger';

export class CreateTransactionCategoryBody extends PickType(
  TransactionCategoryEntity,
  ['name', 'image'],
) {}

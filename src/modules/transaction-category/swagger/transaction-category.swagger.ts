import { TransactionCategoryEntity } from '@/modules/transaction-category/entities/transaction-category.entity';
import { PickType } from '@nestjs/swagger';

export class TransactionCategorySwaggerModel extends PickType(
  TransactionCategoryEntity,
  ['id', 'name', 'image'],
) {}

import { TransactionCategoryEntity } from '@/modules/transaction-category/entities/transaction-category.entity';
import { PickType, PartialType } from '@nestjs/swagger';

export class UpdateTransactionCategoryBody extends PartialType(
  PickType(TransactionCategoryEntity, ['name', 'image']),
) {}

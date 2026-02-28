import { PickType } from '@nestjs/swagger';
import { TransactionTypeEntity } from '@/modules/transaction-type/entities/transaction-type.entity';

export class TransactionTypeSwaggerModel extends PickType(
  TransactionTypeEntity,
  ['id', 'name'],
) {}

import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

export class UpdateTransactionFolderBody extends IntersectionType(
  PickType(TransactionFolderEntity, ['name']),
  PartialType(PickType(TransactionFolderEntity, ['description', 'image'])),
) {}

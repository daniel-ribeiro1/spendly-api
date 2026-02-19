import { Expose } from 'class-transformer';

import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

export class UpdateTransactionFolderBody extends IntersectionType(
  PickType(TransactionFolderEntity, ['name']),
  PartialType(PickType(TransactionFolderEntity, ['description', 'image'])),
) {}

export class UpdateTransactionFolderResponse implements Omit<
  TransactionFolderEntity,
  'isActive' | 'userId'
> {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  image: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

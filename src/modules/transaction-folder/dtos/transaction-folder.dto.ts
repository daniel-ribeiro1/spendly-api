import { Expose } from 'class-transformer';

import { TransactionFolderEntity } from '@/modules/transaction-folder/entities/transaction-folder.entity';

export class DefaultTransactionFolderResponse implements Omit<
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

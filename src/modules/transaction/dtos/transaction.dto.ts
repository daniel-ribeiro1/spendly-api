import { Expose } from 'class-transformer';

import { Transaction } from '@prisma/client';

export class DefaultTransactionResponse implements Pick<
  Transaction,
  | 'id'
  | 'name'
  | 'description'
  | 'date'
  | 'transactionTypeId'
  | 'transactionCategoryId'
  | 'transactionFolderId'
> {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  amount: number;

  @Expose()
  date: Date;

  @Expose()
  transactionTypeId: number;

  @Expose()
  transactionCategoryId: string | null;

  @Expose()
  transactionFolderId: string;
}

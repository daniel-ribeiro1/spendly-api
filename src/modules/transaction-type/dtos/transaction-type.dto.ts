import { Expose } from 'class-transformer';

import { TransactionType } from '@prisma/client';

export class DefaultTransactionTypeResponse implements Partial<TransactionType> {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

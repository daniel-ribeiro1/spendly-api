import { Expose } from 'class-transformer';

import { TransactionCategory } from '@prisma/client';

export class DefaultTransactionCategoryResponse implements Partial<TransactionCategory> {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string | null;
}

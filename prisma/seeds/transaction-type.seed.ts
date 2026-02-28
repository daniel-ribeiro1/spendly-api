import { PrismaClient, TransactionType } from '@prisma/client';

export async function ExecuteTransactionTypeSeed(prisma: PrismaClient) {
  const transactionType: Pick<TransactionType, 'name' | 'order'>[] = [
    {
      name: 'EXPANSE',
      order: 1,
    },
    {
      name: 'INCOME',
      order: 2,
    },
  ];

  console.info('\nInserting values in TRANSACTION_TYPE table... ⌛');

  await prisma.transactionType.createMany({
    data: transactionType,
  });

  console.info('Transaction types inserted! 🔥\n');
}

import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  findAllByTransactionFolderId(
    transactionFolderId: string,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findAllByTransactionFolderId(
      transactionFolderId,
    );
  }

  softDeleteMany(ids: string[]): Promise<void> {
    return this.transactionRepository.softDeleteMany(ids);
  }

  undoSoftDeleteMany(ids: string[]): Promise<void> {
    return this.transactionRepository.undoSoftDeleteMany(ids);
  }
}

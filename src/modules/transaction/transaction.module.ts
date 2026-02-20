import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [TransactionRepository, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}

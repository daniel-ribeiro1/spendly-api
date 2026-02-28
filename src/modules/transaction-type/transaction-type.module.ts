import { TransactionTypeRepository } from '@/modules/transaction-type/repositories/transaction-type.repository';
import { TransactionTypeService } from '@/modules/transaction-type/services/transaction-type.service';
import { TransactionTypeController } from '@/modules/transaction-type/transaction-type.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TransactionTypeController],
  providers: [TransactionTypeRepository, TransactionTypeService],
  exports: [TransactionTypeService],
})
export class TransactionTypeModule {}

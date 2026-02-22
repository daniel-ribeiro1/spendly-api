import { TransactionCategoryRepository } from '@/modules/transaction-category/repositories/transaction-category.repository';
import { TransactionCategoryService } from '@/modules/transaction-category/services/transaction-category.service';
import { TransactionCategoryController } from '@/modules/transaction-category/transaction-category.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TransactionCategoryController],
  providers: [TransactionCategoryRepository, TransactionCategoryService],
  exports: [TransactionCategoryService],
})
export class TransactionCategoryModule {}

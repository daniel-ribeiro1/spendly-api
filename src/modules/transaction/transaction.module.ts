import { TransactionCategoryModule } from '@/modules/transaction-category/transaction-category.module';
import { TransactionFolderModule } from '@/modules/transaction-folder/transaction-folder.module';
import { TransactionTypeModule } from '@/modules/transaction-type/transaction-type.module';
import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { TransactionController } from '@/modules/transaction/transaction.controller';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  controllers: [TransactionController],
  imports: [
    forwardRef(() => TransactionFolderModule),
    TransactionCategoryModule,
    TransactionTypeModule,
  ],
  providers: [TransactionRepository, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}

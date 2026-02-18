import { TransactionFolderRepository } from '@/modules/transaction-folder/repositories/transaction-folder.repository';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { TransactionFolderController } from '@/modules/transaction-folder/transaction-folder.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TransactionFolderController],
  providers: [TransactionFolderRepository, TransactionFolderService],
  exports: [TransactionFolderService],
})
export class TransactionFolderModule {}

import {
  CreateTransactionFolderDto,
  CreateTransactionFolderResponseDto,
} from '@/modules/transaction-folder/dtos/transaction-folder.dto';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { CreateTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/create-transaction-folder.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('transaction-folder')
export class TransactionFolderController {
  constructor(
    private readonly transactionFolderService: TransactionFolderService,
  ) {}

  @Post()
  @Serialize(CreateTransactionFolderResponseDto)
  @CreateTransactionFolderResponseSwagger()
  create(
    @Body() body: CreateTransactionFolderDto,
  ): Promise<CreateTransactionFolderResponseDto> {
    return this.transactionFolderService.create(body);
  }
}

import {
  CreateTransactionFolderDto,
  CreateTransactionFolderResponseDto,
} from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import {
  UpdateTransactionFolderDto,
  UpdateTransactionFolderResponseDto,
} from '@/modules/transaction-folder/dtos/update-transaction-folder.dto';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { CreateTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/create-transaction-folder.swagger';
import { UpdateTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/update-transaction-folder.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';

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

  @Patch(':id')
  @Serialize(UpdateTransactionFolderResponseDto)
  @UpdateTransactionFolderResponseSwagger()
  update(
    @Param('id') id: string,
    @Body() body: UpdateTransactionFolderDto,
  ): Promise<UpdateTransactionFolderResponseDto> {
    return this.transactionFolderService.update(id, body);
  }
}

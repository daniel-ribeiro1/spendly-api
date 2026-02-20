import { CreateTransactionFolderBody } from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import { TransactionFolderPaginationQuery } from '@/modules/transaction-folder/dtos/find-all-transaction-folder.dto';
import { DefaultTransactionFolderResponse } from '@/modules/transaction-folder/dtos/transaction-folder.dto';
import { UpdateTransactionFolderBody } from '@/modules/transaction-folder/dtos/update-transaction-folder.dto';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { CreateTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/create-transaction-folder.swagger';
import { FindAllTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/find-all-transaction-folder.swagger';
import { FindOneTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/find-one-transaction-folder.swagger';
import { RemoveTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/remove-transaction-folder.swagger';
import { UpdateTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/update-transaction-folder.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { PagedResponse } from '@/shared/dtos/pagination.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('transaction-folder')
export class TransactionFolderController {
  constructor(
    private readonly transactionFolderService: TransactionFolderService,
  ) {}

  @Get()
  @Serialize(DefaultTransactionFolderResponse)
  @FindAllTransactionFolderResponseSwagger()
  findAll(
    @Query() paginationQuery: TransactionFolderPaginationQuery,
  ): Promise<PagedResponse<DefaultTransactionFolderResponse>> {
    return this.transactionFolderService.findAll(paginationQuery);
  }

  @Post()
  @Serialize(DefaultTransactionFolderResponse)
  @CreateTransactionFolderResponseSwagger()
  create(
    @Body() body: CreateTransactionFolderBody,
  ): Promise<DefaultTransactionFolderResponse> {
    return this.transactionFolderService.create(body);
  }

  @Get(':id')
  @Serialize(DefaultTransactionFolderResponse)
  @FindOneTransactionFolderResponseSwagger()
  findOne(@Param('id') id: string): Promise<DefaultTransactionFolderResponse> {
    return this.transactionFolderService.findOne(id);
  }

  @Patch(':id')
  @Serialize(DefaultTransactionFolderResponse)
  @UpdateTransactionFolderResponseSwagger()
  update(
    @Param('id') id: string,
    @Body() body: UpdateTransactionFolderBody,
  ): Promise<DefaultTransactionFolderResponse> {
    return this.transactionFolderService.update(id, body);
  }

  @Delete(':id')
  @RemoveTransactionFolderResponseSwagger()
  softDelete(@Param('id') id: string): Promise<void> {
    return this.transactionFolderService.softDelete(id);
  }
}

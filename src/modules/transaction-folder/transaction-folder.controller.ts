import { CreateTransactionFolderBody } from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import { TransactionFolderPaginationQuery } from '@/modules/transaction-folder/dtos/find-all-transaction-folder.dto';
import { DefaultTransactionFolderResponse } from '@/modules/transaction-folder/dtos/transaction-folder.dto';
import { UpdateTransactionFolderBody } from '@/modules/transaction-folder/dtos/update-transaction-folder.dto';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { FindAllTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/find-all-transaction-folder.swagger';
import { DefaultTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/transaction-folder.swagger';
import { UpdateTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/update-transaction-folder.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { PagedResponse } from '@/shared/dtos/pagination.dto';
import {
  Body,
  Controller,
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
  @DefaultTransactionFolderResponseSwagger()
  create(
    @Body() body: CreateTransactionFolderBody,
  ): Promise<DefaultTransactionFolderResponse> {
    return this.transactionFolderService.create(body);
  }

  @Get(':id')
  @Serialize(DefaultTransactionFolderResponse)
  @DefaultTransactionFolderResponseSwagger()
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
}

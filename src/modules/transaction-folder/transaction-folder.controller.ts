import {
  CreateTransactionFolderBody,
  CreateTransactionFolderResponse,
} from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import {
  FindAllTransactionFolderResponse,
  TransactionFolderPaginationQuery,
} from '@/modules/transaction-folder/dtos/find-all-transaction-folder.dto';
import {
  UpdateTransactionFolderBody,
  UpdateTransactionFolderResponse,
} from '@/modules/transaction-folder/dtos/update-transaction-folder.dto';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { CreateTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/create-transaction-folder.swagger';
import { FindAllTransactionFolderResponseSwagger } from '@/modules/transaction-folder/swagger/find-all-transaction-folder.swagger';
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
  @Serialize(FindAllTransactionFolderResponse)
  @FindAllTransactionFolderResponseSwagger()
  findAll(
    @Query() paginationQuery: TransactionFolderPaginationQuery,
  ): Promise<PagedResponse<FindAllTransactionFolderResponse>> {
    return this.transactionFolderService.findAll(paginationQuery);
  }

  @Post()
  @Serialize(CreateTransactionFolderResponse)
  @CreateTransactionFolderResponseSwagger()
  create(
    @Body() body: CreateTransactionFolderBody,
  ): Promise<CreateTransactionFolderResponse> {
    return this.transactionFolderService.create(body);
  }

  @Patch(':id')
  @Serialize(UpdateTransactionFolderResponse)
  @UpdateTransactionFolderResponseSwagger()
  update(
    @Param('id') id: string,
    @Body() body: UpdateTransactionFolderBody,
  ): Promise<UpdateTransactionFolderResponse> {
    return this.transactionFolderService.update(id, body);
  }
}

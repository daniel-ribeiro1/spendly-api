import { CreateTransactionCategoryBody } from '@/modules/transaction-category/dtos/create-transaction-category.dto';
import { FindAllTransactionCategoryQuery } from '@/modules/transaction-category/dtos/find-all-transaction-category.dto';
import { DefaultTransactionCategoryResponse } from '@/modules/transaction-category/dtos/transaction-category.dto';
import { UpdateTransactionCategoryBody } from '@/modules/transaction-category/dtos/update-transaction-category.dto';
import { TransactionCategoryService } from '@/modules/transaction-category/services/transaction-category.service';
import { CreateTransactionCategorySwaggerResponse } from '@/modules/transaction-category/swagger/create-transaction-category.swagger';
import { FindAllTransactionCategorySwaggerResponse } from '@/modules/transaction-category/swagger/find-all-transaction-category.swagger';
import { FindOneTransactionCategorySwaggerResponse } from '@/modules/transaction-category/swagger/find-one-transaction-category.swagger';
import { UpdateTransactionCategorySwaggerResponse } from '@/modules/transaction-category/swagger/update-transaction-category.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('transaction-category')
export class TransactionCategoryController {
  constructor(
    private readonly transactionCategoryService: TransactionCategoryService,
  ) {}

  @Post()
  @Serialize(DefaultTransactionCategoryResponse)
  @CreateTransactionCategorySwaggerResponse()
  create(
    @Body() body: CreateTransactionCategoryBody,
  ): Promise<DefaultTransactionCategoryResponse> {
    return this.transactionCategoryService.create(body);
  }

  @Get()
  @Serialize(DefaultTransactionCategoryResponse)
  @FindAllTransactionCategorySwaggerResponse()
  findAll(
    @Query() query: FindAllTransactionCategoryQuery,
  ): Promise<DefaultTransactionCategoryResponse[]> {
    return this.transactionCategoryService.findAll(query);
  }

  @Get(':id')
  @Serialize(DefaultTransactionCategoryResponse)
  @FindOneTransactionCategorySwaggerResponse()
  findOne(
    @Param('id') id: string,
  ): Promise<DefaultTransactionCategoryResponse> {
    return this.transactionCategoryService.findOne(id);
  }

  @Patch(':id')
  @Serialize(DefaultTransactionCategoryResponse)
  @UpdateTransactionCategorySwaggerResponse()
  update(
    @Param('id') id: string,
    @Body() body: UpdateTransactionCategoryBody,
  ): Promise<DefaultTransactionCategoryResponse> {
    return this.transactionCategoryService.update(id, body);
  }
}

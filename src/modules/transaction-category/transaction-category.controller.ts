import { CreateTransactionCategoryBody } from '@/modules/transaction-category/dtos/create-transaction-category.dto';
import { FindAllTransactionCategoryQuery } from '@/modules/transaction-category/dtos/find-all-transaction-category.dto';
import { DefaultTransactionCategoryResponse } from '@/modules/transaction-category/dtos/transaction-category.dto';
import { TransactionCategoryService } from '@/modules/transaction-category/services/transaction-category.service';
import { CreateTransactionCategorySwaggerResponse } from '@/modules/transaction-category/swagger/create-transaction-category.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

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
  findAll(
    @Query() query: FindAllTransactionCategoryQuery,
  ): Promise<DefaultTransactionCategoryResponse[]> {
    return this.transactionCategoryService.findAll(query);
  }
}

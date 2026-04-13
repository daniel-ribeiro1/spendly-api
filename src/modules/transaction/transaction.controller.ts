import { CreateTransactionBody } from '@/modules/transaction/dtos/create-transaction.dto';
import { DefaultTransactionResponse } from '@/modules/transaction/dtos/transaction.dto';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { Transaction } from '@prisma/client';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Serialize(DefaultTransactionResponse)
  // TODO: Swagger
  create(@Body() body: CreateTransactionBody): Promise<Transaction> {
    return this.transactionService.create(body);
  }
}

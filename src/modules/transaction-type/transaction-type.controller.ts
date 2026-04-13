import { DefaultTransactionTypeResponse } from '@/modules/transaction-type/dtos/transaction-type.dto';
import { TransactionTypeService } from '@/modules/transaction-type/services/transaction-type.service';
import { FindAllTransactionTypeSwaggerResponse } from '@/modules/transaction-type/swagger/find-all-transaction-type.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Controller, Get } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

@Controller('transaction-types')
export class TransactionTypeController {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @Get()
  @Serialize(DefaultTransactionTypeResponse)
  @FindAllTransactionTypeSwaggerResponse()
  findAll(): Promise<TransactionType[]> {
    return this.transactionTypeService.findAll();
  }
}

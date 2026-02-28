import { DefaultTransactionTypeResponse } from '@/modules/transaction-type/dtos/transaction-type.dto';
import { TransactionTypeService } from '@/modules/transaction-type/services/transaction-type.service';
import { FindAllTransactionTypeSwaggerResponse } from '@/modules/transaction-type/swagger/find-all-transaction-type.swagger';
import { Serialize } from '@/shared/decorators/serialize.decorator';
import { Controller, Get } from '@nestjs/common';

@Controller('transaction-type')
export class TransactionTypeController {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @Get()
  @Serialize(DefaultTransactionTypeResponse)
  @FindAllTransactionTypeSwaggerResponse()
  findAll(): Promise<DefaultTransactionTypeResponse[]> {
    return this.transactionTypeService.findAll();
  }
}

import { TransactionTypeRepository } from '@/modules/transaction-type/repositories/transaction-type.repository';
import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionTypeService {
  constructor(
    private readonly transactionTypeRepository: TransactionTypeRepository,
  ) {}

  findAll(): Promise<TransactionType[]> {
    return this.transactionTypeRepository.findAll();
  }
}

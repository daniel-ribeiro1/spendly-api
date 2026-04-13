import { RequestException } from '@/core/exceptions/request.exception';
import { TransactionTypeRepository } from '@/modules/transaction-type/repositories/transaction-type.repository';
import { Exception } from '@/shared/enums/exceptions.enum';
import { HttpStatus, Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionTypeService {
  constructor(
    private readonly transactionTypeRepository: TransactionTypeRepository,
  ) {}

  findAll(): Promise<TransactionType[]> {
    return this.transactionTypeRepository.findAll();
  }

  async findOne(id: number): Promise<TransactionType> {
    const transactionType = await this.transactionTypeRepository.findById(id);

    if (!transactionType) {
      throw new RequestException(
        Exception.TRANSACTION_TYPE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return transactionType;
  }
}

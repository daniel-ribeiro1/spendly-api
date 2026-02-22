import { RequestException } from '@/core/exceptions/request.exception';
import { CreateTransactionCategoryBody } from '@/modules/transaction-category/dtos/create-transaction-category.dto';
import { DefaultTransactionCategoryResponse } from '@/modules/transaction-category/dtos/transaction-category.dto';
import { TransactionCategoryRepository } from '@/modules/transaction-category/repositories/transaction-category.repository';
import { Exception } from '@/shared/enums/exceptions.enum';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TransactionCategoryService {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly transactionCategoryRepository: TransactionCategoryRepository,
  ) {}

  async create(
    body: CreateTransactionCategoryBody,
  ): Promise<DefaultTransactionCategoryResponse> {
    const requester = this.localStorageService.get('requester');

    const category =
      await this.transactionCategoryRepository.findByNameAndUserId(
        body.name,
        requester.id,
      );

    if (category) {
      throw new RequestException(
        Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    return this.transactionCategoryRepository.create({
      ...body,
      userId: requester.id,
    });
  }
}

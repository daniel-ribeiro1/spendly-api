import { RequestException } from '@/core/exceptions/request.exception';
import { CreateTransactionCategoryBody } from '@/modules/transaction-category/dtos/create-transaction-category.dto';
import { FindAllTransactionCategoryQuery } from '@/modules/transaction-category/dtos/find-all-transaction-category.dto';
import { DefaultTransactionCategoryResponse } from '@/modules/transaction-category/dtos/transaction-category.dto';
import { UpdateTransactionCategoryBody } from '@/modules/transaction-category/dtos/update-transaction-category.dto';
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

    await this.validateCategoryNameByUser(body.name);

    return this.transactionCategoryRepository.create({
      ...body,
      userId: requester.id,
    });
  }

  async findAll(
    query?: FindAllTransactionCategoryQuery,
  ): Promise<DefaultTransactionCategoryResponse[]> {
    const requester = this.localStorageService.get('requester');

    return this.transactionCategoryRepository.findAllByUserId(
      requester.id,
      query?.searchTerm,
    );
  }

  async findOneByRequester(
    id: string,
  ): Promise<DefaultTransactionCategoryResponse> {
    const requester = this.localStorageService.get('requester');
    const category = await this.transactionCategoryRepository.findByIdAndUserId(
      id,
      requester.id,
    );

    if (!category) {
      throw new RequestException(
        Exception.TRANSACTION_CATEGORY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return category;
  }

  async update(
    id: string,
    body: UpdateTransactionCategoryBody,
  ): Promise<DefaultTransactionCategoryResponse> {
    const category = await this.findOneByRequester(id);

    if (body?.name && body.name != category.name) {
      await this.validateCategoryNameByUser(body.name);
    }

    return this.transactionCategoryRepository.update(id, body);
  }

  async hardDelete(id: string): Promise<void> {
    const category = await this.findOneByRequester(id);
    return this.transactionCategoryRepository.hardDelete(category.id);
  }

  private async validateCategoryNameByUser(name: string): Promise<void> {
    const requester = this.localStorageService.get('requester');

    const category =
      await this.transactionCategoryRepository.findByNameAndUserId(
        name,
        requester.id,
      );

    if (category) {
      throw new RequestException(
        Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }
  }
}

import { RequestException } from '@/core/exceptions/request.exception';
import { TransactionCategoryService } from '@/modules/transaction-category/services/transaction-category.service';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { TransactionTypeService } from '@/modules/transaction-type/services/transaction-type.service';
import { CreateTransactionBody } from '@/modules/transaction/dtos/create-transaction.dto';
import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { tryIt } from '@/shared/utils/try-catch.util';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(forwardRef(() => TransactionFolderService))
    private readonly transactionFolderService: TransactionFolderService,
    private readonly localStorageService: LocalStorageService,
    private readonly transactionCategoryService: TransactionCategoryService,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  findAllByTransactionFolderId(
    transactionFolderId: string,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findAllByTransactionFolderId(
      transactionFolderId,
    );
  }

  async create(body: CreateTransactionBody): Promise<Transaction> {
    const requester = this.localStorageService.get('requester');

    const transactionCategory = await tryIt(
      async () => {
        if (!body.transactionCategoryId) return null;

        return this.transactionCategoryService.findOneByRequester(
          body.transactionCategoryId,
        );
      },
      (error) => {
        if (error instanceof RequestException) {
          throw new RequestException(error.exception, HttpStatus.BAD_REQUEST);
        }
      },
    );

    const transactionType: TransactionType = await tryIt(
      () => this.transactionTypeService.findOne(body.transactionTypeId),
      (error) => {
        if (error instanceof RequestException) {
          throw new RequestException(error.exception, HttpStatus.BAD_REQUEST);
        }
      },
    );

    const transactionFolder = await tryIt(
      () =>
        this.transactionFolderService.findOneByRequester(
          body.transactionFolderId,
        ),
      (error) => {
        if (error instanceof RequestException) {
          throw new RequestException(error.exception, HttpStatus.BAD_REQUEST);
        }
      },
    );

    return this.transactionRepository.create({
      ...body,
      userId: requester.id,
      transactionTypeId: transactionType.id,
      transactionFolderId: transactionFolder.id,
      transactionCategoryId: transactionCategory?.id || null,
    });
  }

  softDeleteMany(ids: string[]): Promise<void> {
    return this.transactionRepository.softDeleteMany(ids);
  }

  undoSoftDeleteMany(ids: string[]): Promise<void> {
    return this.transactionRepository.undoSoftDeleteMany(ids);
  }
}

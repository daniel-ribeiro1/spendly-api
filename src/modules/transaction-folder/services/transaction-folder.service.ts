import { RequestException } from '@/core/exceptions/request.exception';
import { CreateTransactionFolderBody } from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import { TransactionFolderPaginationQuery } from '@/modules/transaction-folder/dtos/find-all-transaction-folder.dto';
import { DefaultTransactionFolderResponse } from '@/modules/transaction-folder/dtos/transaction-folder.dto';
import { UpdateTransactionFolderBody } from '@/modules/transaction-folder/dtos/update-transaction-folder.dto';
import { TransactionFolderRepository } from '@/modules/transaction-folder/repositories/transaction-folder.repository';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { PagedResponse } from '@/shared/dtos/pagination.dto';
import { Exception } from '@/shared/enums/exceptions.enum';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { RollbackManager } from '@/shared/utils/rollback-manager.util';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TransactionFolderService {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly transactionFolderRepository: TransactionFolderRepository,
    protected readonly transactionService: TransactionService,
  ) {}

  async findOne(id: string) {
    const requester = this.localStorageService.get('requester');

    const transactionFolder =
      await this.transactionFolderRepository.findByIdAndUserId(
        id,
        requester.id,
      );

    if (!transactionFolder) {
      throw new RequestException(
        Exception.TRANSACTION_FOLDER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return transactionFolder;
  }

  findAll(
    paginationQuery: TransactionFolderPaginationQuery,
  ): Promise<PagedResponse<DefaultTransactionFolderResponse>> {
    const requester = this.localStorageService.get('requester');

    return this.transactionFolderRepository.findAllPaged(
      requester.id,
      paginationQuery,
    );
  }

  async create(
    body: CreateTransactionFolderBody,
  ): Promise<DefaultTransactionFolderResponse> {
    const requester = this.localStorageService.get('requester');

    return this.transactionFolderRepository.create({
      ...body,
      userId: requester.id,
    });
  }

  async update(
    id: string,
    body: UpdateTransactionFolderBody,
  ): Promise<DefaultTransactionFolderResponse> {
    const requester = this.localStorageService.get('requester');
    const transactionFolder =
      await this.transactionFolderRepository.findByIdAndUserId(
        id,
        requester.id,
      );

    if (!transactionFolder) {
      throw new RequestException(
        Exception.TRANSACTION_FOLDER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.transactionFolderRepository.update(id, body);
  }

  async softDelete(id: string): Promise<void> {
    const requester = this.localStorageService.get('requester');
    const transactionFolder =
      await this.transactionFolderRepository.findByIdAndUserId(
        id,
        requester.id,
      );

    if (!transactionFolder) {
      throw new RequestException(
        Exception.TRANSACTION_FOLDER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const transactionIds = (
      await this.transactionService.findAllByTransactionFolderId(id)
    ).map((transaction) => transaction.id);

    const rollback = new RollbackManager();

    await rollback.try({
      execute: async () => {
        return this.transactionService.softDeleteMany(transactionIds);
      },
      rollback: async () => {
        await this.transactionService.undoSoftDeleteMany(transactionIds);
      },
    });

    await rollback.try({
      execute: async () => {
        return this.transactionFolderRepository.softDelete(id);
      },
    });

    await this.transactionFolderRepository.softDelete(id);
  }
}

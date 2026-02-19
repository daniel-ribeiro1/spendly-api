import { RequestException } from '@/core/exceptions/request.exception';
import {
  CreateTransactionFolderDto,
  CreateTransactionFolderResponseDto,
} from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import {
  UpdateTransactionFolderDto,
  UpdateTransactionFolderResponseDto,
} from '@/modules/transaction-folder/dtos/update-transaction-folder.dto';
import { TransactionFolderRepository } from '@/modules/transaction-folder/repositories/transaction-folder.repository';
import { Exception } from '@/shared/enums/exceptions.enum';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TransactionFolderService {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly transactionFolderRepository: TransactionFolderRepository,
  ) {}

  async create(
    body: CreateTransactionFolderDto,
  ): Promise<CreateTransactionFolderResponseDto> {
    const requester = this.localStorageService.get('requester');

    return this.transactionFolderRepository.create({
      ...body,
      userId: requester.id,
    });
  }

  async update(
    id: string,
    body: UpdateTransactionFolderDto,
  ): Promise<UpdateTransactionFolderResponseDto> {
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
}

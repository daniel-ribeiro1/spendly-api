import {
  CreateTransactionFolderDto,
  CreateTransactionFolderResponseDto,
} from '@/modules/transaction-folder/dtos/transaction-folder.dto';
import { TransactionFolderRepository } from '@/modules/transaction-folder/repositories/transaction-folder.repository';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { Injectable } from '@nestjs/common';

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
}

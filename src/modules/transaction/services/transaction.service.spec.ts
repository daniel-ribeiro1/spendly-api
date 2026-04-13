import Decimal from 'decimal.js';

import { TransactionCategoryService } from '@/modules/transaction-category/services/transaction-category.service';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { TransactionTypeService } from '@/modules/transaction-type/services/transaction-type.service';
import { CreateTransactionBody } from '@/modules/transaction/dtos/create-transaction.dto';
import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { Test } from '@nestjs/testing';
import {
  Transaction,
  TransactionCategory,
  TransactionFolder,
  TransactionType,
} from '@prisma/client';
import { RequestException } from '@/core/exceptions/request.exception';
import { Exception } from '@/shared/enums/exceptions.enum';
import { HttpStatus } from '@nestjs/common';

describe('TransactionService', () => {
  let transactionService: TransactionService;

  let transactionRepository: jest.Mocked<TransactionRepository>;
  let localStorageService: jest.Mocked<LocalStorageService>;
  let transactionCategoryService: jest.Mocked<TransactionCategoryService>;
  let transactionFolderService: jest.Mocked<TransactionFolderService>;
  let transactionTypeService: jest.Mocked<TransactionTypeService>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: LocalStorageService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: TransactionCategoryService,
          useValue: {
            findOneByRequester: jest.fn(),
          },
        },
        {
          provide: TransactionFolderService,
          useValue: {
            findOneByRequester: jest.fn(),
          },
        },
        {
          provide: TransactionTypeService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService = module.get(TransactionService);
    transactionRepository = module.get(TransactionRepository);
    localStorageService = module.get(LocalStorageService);
    transactionCategoryService = module.get(TransactionCategoryService);
    transactionFolderService = module.get(TransactionFolderService);
    transactionTypeService = module.get(TransactionTypeService);
  });

  describe('create', () => {
    const requester = {
      id: '123e4567-e89b-12d3-a456-426655440000',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    const transactionFolder: TransactionFolder = {
      id: '123e4567-e89b-12d3-a456-426655440002',
      name: 'Pasta de Teste',
      description: 'Pasta para testes unitários',
      userId: requester.id,
      createdAt: new Date('2026-11-01T00:00:00.000Z'),
      updatedAt: new Date('2026-11-01T00:00:00.000Z'),
      image: null,
      isActive: true,
    };

    const transactionCategory: TransactionCategory = {
      id: '123e4567-e89b-12d3-a456-426655440001',
      name: 'Categoria de Teste',
      userId: requester.id,
      createdAt: new Date('2026-11-01T00:00:00.000Z'),
      updatedAt: new Date('2026-11-01T00:00:00.000Z'),
      isActive: true,
      image: null,
      normalizedName: 'categoria-de-teste',
    };

    const transactionType: TransactionType = {
      id: 1,
      name: 'Tipo de Teste',
      createdAt: new Date('2026-11-01T00:00:00.000Z'),
      updatedAt: new Date('2026-11-01T00:00:00.000Z'),
      isActive: true,
      order: 1,
    };

    const createTransactionBody: CreateTransactionBody = {
      name: 'Civic 2021 Touring',
      description: 'Aquisição do carro próprio',
      amount: new Decimal(120_000.0),
      date: new Date('2026-11-01T00:00:00.000Z'),
      transactionTypeId: 1,
      transactionCategoryId: '123e4567-e89b-12d3-a456-426655440001',
      transactionFolderId: '123e4567-e89b-12d3-a456-426655440002',
    };

    const transaction: Transaction = {
      ...createTransactionBody,
      id: '123e4567-e89b-12d3-a456-426655440003',
      createdAt: new Date('2026-11-01T00:00:00.000Z'),
      updatedAt: new Date('2026-11-01T00:00:00.000Z'),
      isActive: true,
      userId: requester.id,
    };

    it('should create a transaction', async () => {
      localStorageService.get.mockReturnValue(requester);

      transactionCategoryService.findOneByRequester.mockResolvedValue(
        transactionCategory,
      );

      transactionFolderService.findOneByRequester.mockResolvedValue(
        transactionFolder,
      );

      transactionTypeService.findOne.mockResolvedValue(transactionType);
      transactionRepository.create.mockResolvedValue(transaction);

      const result = await transactionService.create(createTransactionBody);

      expect(result).toBeDefined();
      expect(result).toEqual(transaction);
    });

    it('should create a transaction without category', async () => {
      localStorageService.get.mockReturnValue(requester);

      transactionFolderService.findOneByRequester.mockResolvedValue(
        transactionFolder,
      );

      transactionTypeService.findOne.mockResolvedValue(transactionType);
      transactionRepository.create.mockResolvedValue({
        ...transaction,
        transactionCategoryId: null,
      });

      const result = await transactionService.create({
        ...createTransactionBody,
        transactionCategoryId: null,
      });

      expect(result).toBeDefined();
      expect(result).toEqual({
        ...transaction,
        transactionCategoryId: null,
      });
    });

    it('should throw an error if transaction type is not found', async () => {
      localStorageService.get.mockReturnValue(requester);

      transactionCategoryService.findOneByRequester.mockResolvedValue(
        transactionCategory,
      );

      transactionFolderService.findOneByRequester.mockResolvedValue(
        transactionFolder,
      );

      transactionTypeService.findOne.mockRejectedValue(
        new RequestException(
          Exception.TRANSACTION_TYPE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );

      await expect(
        transactionService.create(createTransactionBody),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_TYPE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw an error if transaction category is not found', async () => {
      localStorageService.get.mockReturnValue(requester);

      transactionTypeService.findOne.mockResolvedValue(transactionType);
      transactionFolderService.findOneByRequester.mockResolvedValue(
        transactionFolder,
      );

      transactionCategoryService.findOneByRequester.mockRejectedValue(
        new RequestException(
          Exception.TRANSACTION_CATEGORY_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );

      await expect(
        transactionService.create(createTransactionBody),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_CATEGORY_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw an error if transaction folder is not found', async () => {
      localStorageService.get.mockReturnValue(requester);

      transactionTypeService.findOne.mockResolvedValue(transactionType);
      transactionCategoryService.findOneByRequester.mockResolvedValue(
        transactionCategory,
      );

      transactionFolderService.findOneByRequester.mockRejectedValue(
        new RequestException(
          Exception.TRANSACTION_FOLDER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );

      await expect(
        transactionService.create(createTransactionBody),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_FOLDER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});

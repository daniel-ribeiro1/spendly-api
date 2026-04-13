import { RequestException } from '@/core/exceptions/request.exception';
import { TransactionTypeRepository } from '@/modules/transaction-type/repositories/transaction-type.repository';
import { TransactionTypeService } from '@/modules/transaction-type/services/transaction-type.service';
import { Exception } from '@/shared/enums/exceptions.enum';
import { TransactionTypeName } from '@/shared/enums/transaction-type.enum';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TransactionType } from '@prisma/client';

describe('TransactionTypeService', () => {
  let transactionTypeService: TransactionTypeService;
  let transactionTypeRepository: jest.Mocked<TransactionTypeRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionTypeService,
        {
          provide: TransactionTypeRepository,
          useValue: { findAll: jest.fn(), findById: jest.fn() },
        },
      ],
    }).compile();

    transactionTypeService = module.get(TransactionTypeService);
    transactionTypeRepository = module.get(TransactionTypeRepository);
  });

  describe('findAll', () => {
    it('should return an array of transaction types', async () => {
      const transactionTypes: TransactionType[] = [
        {
          id: 1,
          name: TransactionTypeName.INCOME,
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      transactionTypeRepository.findAll.mockReturnValue(
        Promise.resolve(transactionTypes),
      );

      const result = await transactionTypeService.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual(transactionTypes);
    });
  });

  describe('findOne', () => {
    it('should return a transaction type', async () => {
      const transactionType: TransactionType = {
        id: 1,
        name: TransactionTypeName.INCOME,
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      transactionTypeRepository.findById.mockReturnValue(
        Promise.resolve(transactionType),
      );

      const result = await transactionTypeService.findOne(transactionType.id);

      expect(result).toBeDefined();
      expect(result).toEqual(transactionType);
    });

    it('should throw an error if transaction type is not found', async () => {
      const transactionType: TransactionType = {
        id: 1,
        name: TransactionTypeName.INCOME,
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      transactionTypeRepository.findById.mockReturnValue(Promise.resolve(null));

      await expect(
        transactionTypeService.findOne(transactionType.id),
      ).rejects.toThrow();

      await expect(
        transactionTypeService.findOne(transactionType.id),
      ).rejects.toBeInstanceOf(RequestException);

      await expect(
        transactionTypeService.findOne(transactionType.id),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_TYPE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});

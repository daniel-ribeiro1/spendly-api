import { TransactionTypeRepository } from '@/modules/transaction-type/repositories/transaction-type.repository';
import { TransactionTypeService } from '@/modules/transaction-type/services/transaction-type.service';
import { TransactionTypeName } from '@/shared/enums/transaction-type.enum';
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
          useValue: { findAll: jest.fn() },
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
});

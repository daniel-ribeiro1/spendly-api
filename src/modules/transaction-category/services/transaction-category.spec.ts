import { RequestException } from '@/core/exceptions/request.exception';
import { CreateTransactionCategoryBody } from '@/modules/transaction-category/dtos/create-transaction-category.dto';
import { UpdateTransactionCategoryBody } from '@/modules/transaction-category/dtos/update-transaction-category.dto';
import { TransactionCategoryRepository } from '@/modules/transaction-category/repositories/transaction-category.repository';
import { TransactionCategoryService } from '@/modules/transaction-category/services/transaction-category.service';
import { Exception } from '@/shared/enums/exceptions.enum';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TransactionCategory } from '@prisma/client';

describe('TransactionCategoryService', () => {
  let transactionCategoryService: TransactionCategoryService;
  let transactionCategoryRepository: jest.Mocked<TransactionCategoryRepository>;
  let localStorageService: jest.Mocked<LocalStorageService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionCategoryService,
        {
          provide: TransactionCategoryRepository,
          useValue: {
            create: jest.fn(),
            findByNameAndUserId: jest.fn(),
            findAllByUserId: jest.fn(),
            findByIdAndUserId: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: LocalStorageService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    transactionCategoryRepository = module.get(TransactionCategoryRepository);
    transactionCategoryService = module.get(TransactionCategoryService);
    localStorageService = module.get(LocalStorageService);
  });

  describe('create', () => {
    const requester = {
      id: '1',
      email: 'zK9ZV@example.com',
      name: 'John Doe',
    };

    const body: CreateTransactionCategoryBody = {
      name: 'Category',
      image: null,
    };

    it('should create a transaction category', async () => {
      localStorageService.get.mockReturnValue(requester);
      transactionCategoryRepository.findByNameAndUserId.mockResolvedValue(null);

      transactionCategoryRepository.create.mockResolvedValue({
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: requester.id,
        isActive: true,
        normalizedName: '',
        ...body,
      });

      const result = await transactionCategoryService.create(body);

      expect(result).toBeDefined();
      expect(result).toMatchObject(body);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('image');
    });

    it('should throw an error if category already exists', async () => {
      localStorageService.get.mockReturnValue(requester);

      jest
        .spyOn(transactionCategoryService as any, 'validateCategoryNameByUser')
        .mockRejectedValue(
          new RequestException(
            Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS,
            HttpStatus.CONFLICT,
          ),
        );

      await expect(transactionCategoryService.create(body)).rejects.toThrow();

      await expect(
        transactionCategoryService.create(body),
      ).rejects.toBeInstanceOf(RequestException);

      await expect(transactionCategoryService.create(body)).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('findAll', () => {
    const requester = {
      id: '1',
      email: 'zK9ZV@example.com',
      name: 'John Doe',
    };

    const foundCategories: TransactionCategory[] = [
      {
        id: '1',
        name: 'Example 1',
        normalizedName: 'example 1',
        image: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: requester.id,
      },
    ];

    it('should find all transaction categories', async () => {
      localStorageService.get.mockReturnValue(requester);
      transactionCategoryRepository.findAllByUserId.mockResolvedValue(
        foundCategories,
      );

      const result = await transactionCategoryService.findAll();

      expect(result).toBeDefined();
      expect(result).toHaveLength(foundCategories.length);
      expect(result[0]).toMatchObject(foundCategories[0]);
    });
  });

  describe('findOne', () => {
    const requester = {
      id: '1',
      email: 'zK9ZV@example.com',
      name: 'John Doe',
    };

    const foundCategory: TransactionCategory = {
      id: '1',
      name: 'Example 1',
      normalizedName: 'example 1',
      image: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: requester.id,
    };

    it('should find one transaction category', async () => {
      localStorageService.get.mockReturnValue(requester);
      transactionCategoryRepository.findByIdAndUserId.mockResolvedValue(
        foundCategory,
      );

      const result = await transactionCategoryService.findOne(foundCategory.id);

      expect(result).toBeDefined();
      expect(result).toMatchObject(foundCategory);
    });

    it('should throw an error if category not found', async () => {
      localStorageService.get.mockReturnValue(requester);
      transactionCategoryRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        transactionCategoryService.findOne('nonexistent-id'),
      ).rejects.toThrow();

      await expect(
        transactionCategoryService.findOne('nonexistent-id'),
      ).rejects.toBeInstanceOf(RequestException);

      await expect(
        transactionCategoryService.findOne('nonexistent-id'),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_CATEGORY_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('update', () => {
    const requester = {
      id: '1',
      email: 'zK9ZV@example.com',
      name: 'John Doe',
    };

    const foundCategory: TransactionCategory = {
      id: '1',
      name: 'Example 1',
      normalizedName: 'example 1',
      image: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: requester.id,
    };

    const body: UpdateTransactionCategoryBody = {
      name: 'Updated Category',
      image: null,
    };

    it('should update a transaction category', async () => {
      localStorageService.get.mockReturnValue(requester);
      transactionCategoryRepository.findByIdAndUserId.mockResolvedValue(
        foundCategory,
      );

      transactionCategoryRepository.update.mockResolvedValue({
        ...foundCategory,
        ...body,
      });

      const result = await transactionCategoryService.update(
        foundCategory.id,
        body,
      );

      expect(result).toBeDefined();
      expect(result).toMatchObject(body);
    });

    it('should throw an error if category not found', async () => {
      localStorageService.get.mockReturnValue(requester);
      transactionCategoryRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        transactionCategoryService.update('nonexistent-id', body),
      ).rejects.toThrow();

      await expect(
        transactionCategoryService.update('nonexistent-id', body),
      ).rejects.toBeInstanceOf(RequestException);

      await expect(
        transactionCategoryService.update('nonexistent-id', body),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_CATEGORY_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw an error if category name already exists', async () => {
      localStorageService.get.mockReturnValue(requester);
      transactionCategoryRepository.findByIdAndUserId.mockResolvedValue(
        foundCategory,
      );

      jest
        .spyOn(transactionCategoryService as any, 'validateCategoryNameByUser')
        .mockRejectedValue(
          new RequestException(
            Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS,
            HttpStatus.CONFLICT,
          ),
        );

      await expect(
        transactionCategoryService.update(foundCategory.id, body),
      ).rejects.toThrow();

      await expect(
        transactionCategoryService.update(foundCategory.id, body),
      ).rejects.toBeInstanceOf(RequestException);

      await expect(
        transactionCategoryService.update(foundCategory.id, body),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });
});

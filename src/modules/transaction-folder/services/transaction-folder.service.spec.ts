import { RequestException } from '@/core/exceptions/request.exception';
import { CreateTransactionFolderBody } from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import { DefaultTransactionFolderResponse } from '@/modules/transaction-folder/dtos/transaction-folder.dto';
import { UpdateTransactionFolderBody } from '@/modules/transaction-folder/dtos/update-transaction-folder.dto';
import { TransactionFolderRepository } from '@/modules/transaction-folder/repositories/transaction-folder.repository';
import { TransactionFolderService } from '@/modules/transaction-folder/services/transaction-folder.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { PagedResponse } from '@/shared/dtos/pagination.dto';
import { Exception } from '@/shared/enums/exceptions.enum';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TransactionFolder } from '@prisma/client';

describe('TransactionFolderService', () => {
  let transactionFolderService: TransactionFolderService;
  let transactionFolderRepository: jest.Mocked<TransactionFolderRepository>;
  let localStorageService: jest.Mocked<LocalStorageService>;
  let transactionService: jest.Mocked<TransactionService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionFolderService,
        {
          provide: TransactionFolderRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findByIdAndUserId: jest.fn(),
            findAllPaged: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: TransactionService,
          useValue: {
            findAllByTransactionFolderId: jest.fn(),
            softDeleteMany: jest.fn(),
            undoSoftDeleteMany: jest.fn(),
          },
        },
        {
          provide: LocalStorageService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionFolderService = module.get(TransactionFolderService);
    transactionFolderRepository = module.get(TransactionFolderRepository);
    transactionService = module.get(TransactionService);
    localStorageService = module.get(LocalStorageService);
  });

  describe('create', () => {
    it('should create a transaction folder', async () => {
      const createTransactionFolderBody: CreateTransactionFolderBody = {
        name: 'Transaction Folder',
        image: 'https://example.com/image.jpg',
        description: 'Description',
      };

      const requester = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'John Doe',
        email: '6oXo9@example.com',
      };

      const mockedTransactionFolder: TransactionFolder = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: createTransactionFolderBody.name,
        image: createTransactionFolderBody.image,
        description: createTransactionFolderBody.description,
        userId: requester.id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockedTransactionFolderResponse: DefaultTransactionFolderResponse =
        {
          id: mockedTransactionFolder.id,
          name: mockedTransactionFolder.name,
          description: mockedTransactionFolder.description,
          image: mockedTransactionFolder.image,
          createdAt: mockedTransactionFolder.createdAt,
          updatedAt: mockedTransactionFolder.updatedAt,
        };

      localStorageService.get.mockReturnValue({ id: requester.id });
      transactionFolderRepository.create.mockResolvedValue(
        mockedTransactionFolder,
      );

      const result = await transactionFolderService.create(
        createTransactionFolderBody,
      );

      expect(result).toBeDefined();
      expect(result).toMatchObject(mockedTransactionFolderResponse);
    });
  });

  describe('update', () => {
    const updateTransactionFolderBody: UpdateTransactionFolderBody = {
      name: 'Updated Transaction Folder',
      image: 'https://example.com/updated-image.jpg',
      description: 'Updated Description',
    };

    const requester = {
      id: '123e4567-e89b-12d3-a456-426655440000',
      name: 'John Doe',
      email: '6oXo9@example.com',
    };

    const mockedTransactionFolder: TransactionFolder = {
      id: '123e4567-e89b-12d3-a456-426655440000',
      name: updateTransactionFolderBody.name,
      image: updateTransactionFolderBody.image || null,
      description: updateTransactionFolderBody.description || null,
      userId: requester.id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockedTransactionFolderResponse: DefaultTransactionFolderResponse = {
      id: mockedTransactionFolder.id,
      name: mockedTransactionFolder.name,
      description: mockedTransactionFolder.description,
      image: mockedTransactionFolder.image,
      createdAt: mockedTransactionFolder.createdAt,
      updatedAt: mockedTransactionFolder.updatedAt,
    };

    it('should update a transaction folder', async () => {
      localStorageService.get.mockReturnValue({ id: requester.id });

      transactionFolderRepository.findByIdAndUserId.mockResolvedValue(
        mockedTransactionFolder,
      );

      transactionFolderRepository.update.mockResolvedValue(
        mockedTransactionFolder,
      );

      const result = await transactionFolderService.update(
        mockedTransactionFolder.id,
        updateTransactionFolderBody,
      );

      expect(result).toBeDefined();
      expect(result).toMatchObject(mockedTransactionFolderResponse);
    });

    it('should throw an error if transaction folder is not found', async () => {
      localStorageService.get.mockReturnValue({ id: requester.id });
      transactionFolderRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        transactionFolderService.update(
          'nonexistent-id',
          updateTransactionFolderBody,
        ),
      ).rejects.toThrow();

      await expect(
        transactionFolderService.update(
          'nonexistent-id',
          updateTransactionFolderBody,
        ),
      ).rejects.toBeInstanceOf(RequestException);

      await expect(
        transactionFolderService.update(
          'nonexistent-id',
          updateTransactionFolderBody,
        ),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_FOLDER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should find all transaction folders', async () => {
      const requester = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'John Doe',
        email: '6oXo9@example.com',
      };

      const transactionFolderResponse: DefaultTransactionFolderResponse = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'Transaction Folder',
        description: 'Description',
        image: 'https://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const transactionFolderPagedResponse: PagedResponse<TransactionFolder> = {
        data: [
          {
            ...transactionFolderResponse,
            isActive: true,
            userId: '123e4567-e89b-12d3-a456-426655440000',
          },
        ],
        metadata: {
          page: 1,
          total: 1,
          take: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      localStorageService.get.mockReturnValue(requester);

      transactionFolderRepository.findAllPaged.mockResolvedValue(
        transactionFolderPagedResponse,
      );

      const result = await transactionFolderService.findAll({
        page: 1,
        take: 10,
      });

      expect(result).toBeDefined();
      expect(result).toMatchObject(transactionFolderPagedResponse);

      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('description');
      expect(result.data[0]).toHaveProperty('image');
      expect(result.data[0]).toHaveProperty('createdAt');
      expect(result.data[0]).toHaveProperty('updatedAt');
    });
  });

  describe('findOne', () => {
    it('should find one transaction folder', async () => {
      const requester = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'John Doe',
        email: '6oXo9@example.com',
      };

      const transactionFolder: TransactionFolder = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'Transaction Folder',
        image: 'https://example.com/image.jpg',
        description: 'Description',
        userId: requester.id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const transactionFolderResponse: DefaultTransactionFolderResponse =
        transactionFolder;

      localStorageService.get.mockReturnValue(requester);

      transactionFolderRepository.findByIdAndUserId.mockResolvedValue(
        transactionFolder,
      );

      const result = await transactionFolderService.findOne(
        transactionFolder.id,
      );

      expect(result).toBeDefined();
      expect(result).toMatchObject(transactionFolderResponse);
    });

    it('should throw an error if transaction folder is not found', async () => {
      const requester = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'John Doe',
        email: '6oXo9@example.com',
      };

      localStorageService.get.mockReturnValue(requester);

      transactionFolderRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        transactionFolderService.findOne('nonexistent-id'),
      ).rejects.toThrow();

      await expect(
        transactionFolderService.findOne('nonexistent-id'),
      ).rejects.toBeInstanceOf(RequestException);

      await expect(
        transactionFolderService.findOne('nonexistent-id'),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_FOLDER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete a transaction folder', async () => {
      const requester = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'John Doe',
        email: '6oXo9@example.com',
      };

      const transactionFolder: TransactionFolder = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'Transaction Folder',
        image: 'https://example.com/image.jpg',
        description: 'Description',
        userId: requester.id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorageService.get.mockReturnValue(requester);
      transactionService.findAllByTransactionFolderId.mockResolvedValue([]);
      transactionService.softDeleteMany.mockResolvedValue();
      transactionFolderRepository.findByIdAndUserId.mockResolvedValue(
        transactionFolder,
      );
      transactionFolderRepository.softDelete.mockResolvedValue();

      const result = await transactionFolderService.softDelete(
        transactionFolder.id,
      );

      expect(result).toBeUndefined();
    });

    it('should throw an error if transaction folder is not found', async () => {
      const requester = {
        id: '123e4567-e89b-12d3-a456-426655440000',
        name: 'John Doe',
        email: '6oXo9@example.com',
      };

      localStorageService.get.mockReturnValue(requester);
      transactionFolderRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        transactionFolderService.softDelete('nonexistent-id'),
      ).rejects.toThrow();

      await expect(
        transactionFolderService.softDelete('nonexistent-id'),
      ).rejects.toBeInstanceOf(RequestException);

      await expect(
        transactionFolderService.softDelete('nonexistent-id'),
      ).rejects.toThrow(
        new RequestException(
          Exception.TRANSACTION_FOLDER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});

import { RequestException } from '@/core/exceptions/request.exception';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserService } from '@/modules/user/services/user.service';
import { Exception } from '@/shared/enums/exceptions.enum';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userRepository = module.get(UserRepository);
  });

  describe('findByEmail', () => {
    const mockedUser: User = {
      id: '123e4567-e89b-12d3-a456-426655440000',
      name: 'Admin do Sistema',
      email: 'admin@example.com',
      password: 'Senh@123456',
      picture: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a existing user', async () => {
      userRepository.findByEmail.mockResolvedValue(mockedUser);

      const user = await userService.findByEmail('admin@example.com');

      expect(user).toBeDefined();
      expect(user).toBe(mockedUser);
    });

    it('should throw an error if user is not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        userService.findByEmail('nonexistent@email.com'),
      ).rejects.toThrow();

      await expect(userService.findByEmail('email')).rejects.toBeInstanceOf(
        RequestException,
      );

      await expect(userService.findByEmail('email')).rejects.toMatchObject({
        exception: Exception.USER_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    const mockedUser: User = {
      id: '123e4567-e89b-12d3-a456-426655440000',
      name: 'Admin do Sistema',
      email: 'admin@example.com',
      password: 'Senh@123456',
      picture: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user', async () => {
      userRepository.create.mockResolvedValue(mockedUser);

      const user = await userService.create({
        name: 'Admin do Sistema',
        password: 'Senh@123456',
        email: 'admin@example.com',
        picture: null,
      });

      expect(user).toBeDefined();
      expect(user).toBe(mockedUser);
    });
  });

  describe('findById', () => {
    const mockedUser: User = {
      id: '123e4567-e89b-12d3-a456-426655440000',
      name: 'Admin do Sistema',
      email: 'admin@example.com',
      password: 'Senh@123456',
      picture: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return a existing user', async () => {
      userRepository.findById.mockResolvedValue(mockedUser);

      const user = await userService.findById(mockedUser.id);

      expect(user).toBeDefined();
      expect(user).toBe(mockedUser);
    });

    it('should throw an error if user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(userService.findById('nonexistent-id')).rejects.toThrow();

      await expect(userService.findById('id')).rejects.toBeInstanceOf(
        RequestException,
      );

      await expect(userService.findById('id')).rejects.toMatchObject({
        exception: Exception.USER_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    });
  });
});

import { RequestException } from '@/core/exceptions/request.exception';
import { UserService } from '@/modules/user/services/user.service';
import { Exception } from '@/shared/enums/exceptions.enum';
import { EncryptionUtil } from '@/shared/utils/encryption.util';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';

import { SignUpDto } from '../dtos/sign-up.dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { findByEmail: jest.fn(), create: jest.fn() },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  describe('signUp', () => {
    const mockedSignUpDto: SignUpDto = {
      name: 'Admin do Sistema',
      password: 'Senh@123456',
      email: 'admin@example.com',
      picture: null,
    };

    const mockedCreatedUser: User = {
      id: '123e4567-e89b-12d3-a456-426655440000',
      name: mockedSignUpDto.name,
      email: mockedSignUpDto.email,
      password: 'encryptedPassword',
      picture: mockedSignUpDto.picture,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user', async () => {
      userService.create.mockResolvedValue(mockedCreatedUser);

      const user = await authService.signUp(mockedSignUpDto);

      expect(user).toBeDefined();
      expect(user).toBe(mockedCreatedUser);
    });

    it('should throw an error if user already exists', async () => {
      userService.findByEmail.mockResolvedValue(mockedCreatedUser);

      await expect(authService.signUp(mockedSignUpDto)).rejects.toThrow();

      await expect(authService.signUp(mockedSignUpDto)).rejects.toBeInstanceOf(
        RequestException,
      );
      await expect(authService.signUp(mockedSignUpDto)).rejects.toMatchObject({
        exception: Exception.USER_ALREADY_EXISTS,
        status: HttpStatus.CONFLICT,
      });
    });

    it('should encrypt the password', async () => {
      jest
        .spyOn(EncryptionUtil, 'encrypt')
        .mockResolvedValue('encryptedPassword');

      userService.create.mockImplementation(async (data: User) => {
        return Promise.resolve({
          ...mockedCreatedUser,
          password: data.password,
        });
      });

      const user = await authService.signUp(mockedSignUpDto);

      expect(user.password).not.toBe(mockedSignUpDto.password);
    });
  });
});

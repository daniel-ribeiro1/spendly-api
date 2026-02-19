import { RequestException } from '@/core/exceptions/request.exception';
import { SignInBody, SignInResponse } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpBody, SignUpResponse } from '@/modules/auth/dtos/sign-up.dto';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UserJwtService } from '@/modules/user/services/user-jwt.service';
import { UserService } from '@/modules/user/services/user.service';
import { Exception } from '@/shared/enums/exceptions.enum';
import { EncryptionUtil } from '@/shared/utils/encryption.util';
import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';

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
        {
          provide: UserJwtService,
          useValue: {
            createAccessToken: jest.fn(),
            createRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  describe('signUp', () => {
    const mockedSignUpDto: SignUpBody = {
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

      const user = (await authService.signUp(
        mockedSignUpDto,
      )) as SignUpResponse;

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

      const user = (await authService.signUp(
        mockedSignUpDto,
      )) as SignUpResponse;

      expect(user.password).not.toBe(mockedSignUpDto.password);
    });
  });

  describe('sign-in', () => {
    const mockedUser: User = {
      id: '123e4567-e89b-12d3-a456-426655440000',
      name: 'Admin do Sistema',
      email: 'admin@example.com',
      password: 'encryptedPassword',
      picture: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should authenticate a user', async () => {
      // Compara a senha criptografada com a senha informada
      jest.spyOn(EncryptionUtil, 'compare').mockResolvedValue(true);

      const signInDto: SignInBody = {
        email: mockedUser.email,
        password: mockedUser.password,
      };

      userService.findByEmail.mockResolvedValue(mockedUser);

      const user = (await authService.signIn(signInDto)) as SignInResponse;

      expect(user).toBeDefined();
      expect(user).toHaveProperty('accessToken');
      expect(user).toHaveProperty('refreshToken');
    });

    it('should throw an error if user is not found', async () => {
      const signInDto: SignInBody = {
        email: mockedUser.email,
        password: mockedUser.password,
      };

      userService.findByEmail.mockRejectedValue(
        new RequestException(Exception.USER_NOT_FOUND, HttpStatus.NOT_FOUND),
      );

      await expect(authService.signIn(signInDto)).rejects.toThrow();

      await expect(authService.signIn(signInDto)).rejects.toBeInstanceOf(
        RequestException,
      );

      await expect(authService.signIn(signInDto)).rejects.toMatchObject({
        exception: Exception.INVALID_CREDENTIALS,
        status: HttpStatus.UNAUTHORIZED,
      });
    });

    it('should throw an error if password is incorrect', async () => {
      // Compara a senha criptografada com a senha informada
      jest.spyOn(EncryptionUtil, 'compare').mockResolvedValue(false);

      const signInDto: SignInBody = {
        email: mockedUser.email,
        password: 'invalidPassword',
      };

      userService.findByEmail.mockResolvedValue(mockedUser);

      await expect(authService.signIn(signInDto)).rejects.toThrow();

      await expect(authService.signIn(signInDto)).rejects.toBeInstanceOf(
        RequestException,
      );

      await expect(authService.signIn(signInDto)).rejects.toMatchObject({
        exception: Exception.INVALID_CREDENTIALS,
        status: HttpStatus.UNAUTHORIZED,
      });
    });
  });
});

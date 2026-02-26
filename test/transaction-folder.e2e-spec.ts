import { I18nService } from 'nestjs-i18n';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { setupRequestValidation } from '@/core/configs/request-validation.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { SignInBody, SignInResponse } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpBody } from '@/modules/auth/dtos/sign-up.dto';
import { GlobalModule } from '@/modules/global/global.module';
import { CreateTransactionFolderBody } from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import { DefaultTransactionFolderResponse } from '@/modules/transaction-folder/dtos/transaction-folder.dto';
import { UpdateTransactionFolderBody } from '@/modules/transaction-folder/dtos/update-transaction-folder.dto';
import { TransactionFolderModule } from '@/modules/transaction-folder/transaction-folder.module';
import { UserModule } from '@/modules/user/user.module';
import { PagedResponse } from '@/shared/dtos/pagination.dto';
import { Exception } from '@/shared/enums/exceptions.enum';
import { PrismaService } from '@/shared/services/prisma.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('TransactionFolderController (E2E)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let i18nService: I18nService;
  let accessToken: string;

  const requesterSignUpDto: SignUpBody = {
    name: 'E2E User',
    email: 'e2e@example.com',
    password: 'Senh@123456',
    picture: null,
  };

  const requesterSignInDto: SignInBody = {
    email: requesterSignUpDto.email,
    password: requesterSignUpDto.password,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TransactionFolderModule,
        AuthModule,
        UserModule,
        GlobalModule,
      ],
    }).compile();

    app = module.createNestApplication();

    setupRequestValidation(app);

    prismaService = app.get(PrismaService);
    i18nService = app.get(I18nService);

    await app.init();

    if (!accessToken) {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(requesterSignUpDto);

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(requesterSignInDto);

      const body = response.body as SignInResponse;
      accessToken = body.accessToken;
    }
  });

  afterAll(async () => {
    await prismaService.user.findUnique({
      where: {
        email: requesterSignUpDto.email,
      },
    });

    await app.close();
  });

  describe('(POST) /transaction-folder', () => {
    afterEach(async () => {
      await prismaService.transactionFolder.deleteMany({
        where: {
          user: {
            email: requesterSignUpDto.email,
          },
        },
      });
    });

    it('should create a new transaction folder', () => {
      const body: CreateTransactionFolderBody = {
        name: 'E2E Transaction Folder',
        description: 'E2E Transaction Folder Description',
        image: null,
      };

      return request(app.getHttpServer())
        .post('/transaction-folder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('image');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');

          expect(res.body).toMatchObject(body);
        });
    });

    it('should throw an error if user is not authenticated', () => {
      return request(app.getHttpServer())
        .post('/transaction-folder')
        .send({})
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toMatchObject({
            path: '/transaction-folder',
            status: HttpStatus.UNAUTHORIZED,
            exception: Exception.UNAUTHORIZED,
            message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
          });
        });
    });
  });

  describe('(PATCH) /transaction-folder/:id', () => {
    afterEach(async () => {
      await prismaService.transactionFolder.deleteMany({
        where: {
          user: {
            email: requesterSignUpDto.email,
          },
        },
      });
    });

    it('should update a transaction folder', async () => {
      const body: CreateTransactionFolderBody = {
        name: 'E2E Transaction Folder',
        description: 'E2E Transaction Folder Description',
        image: null,
      };

      const updateBody: UpdateTransactionFolderBody = {
        name: 'E2E Transaction Folder Updated',
      };

      const createdResponse = await request(app.getHttpServer())
        .post('/transaction-folder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED);

      const transactionFolder =
        createdResponse.body as DefaultTransactionFolderResponse;

      return request(app.getHttpServer())
        .patch(`/transaction-folder/${transactionFolder.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateBody)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('image');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');

          expect(res.body).toMatchObject({
            ...body,
            ...updateBody,
          });
        });
    });

    it('should throw an error if user is not authenticated', async () => {
      const updateBody: CreateTransactionFolderBody = {
        name: 'E2E Transaction Folder',
        description: 'E2E Transaction Folder Description',
        image: null,
      };

      const path = '/transaction-folder/valid-id';

      return request(app.getHttpServer())
        .patch(path)
        .send(updateBody)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path,
            status: HttpStatus.UNAUTHORIZED,
            exception: Exception.UNAUTHORIZED,
            message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
          });
        });
    });

    it('should throw an error if transaction folder is not found', () => {
      return request(app.getHttpServer())
        .patch('/transaction-folder/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toMatchObject({
            path: '/transaction-folder/nonexistent-id',
            status: HttpStatus.NOT_FOUND,
            exception: Exception.TRANSACTION_FOLDER_NOT_FOUND,
            message: i18nService.t(
              `exceptions.${Exception.TRANSACTION_FOLDER_NOT_FOUND}`,
            ),
          });
        });
    });
  });

  describe('(GET) /transaction-folder', () => {
    afterEach(async () => {
      await prismaService.transactionFolder.deleteMany({
        where: {
          user: {
            email: requesterSignUpDto.email,
          },
        },
      });
    });

    it('should get all transaction folders', async () => {
      const body: CreateTransactionFolderBody = {
        name: 'E2E Transaction Folder',
        description: 'E2E Transaction Folder Description',
        image: null,
      };

      const createdResponse = await request(app.getHttpServer())
        .post('/transaction-folder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED);

      const transactionFolder =
        createdResponse.body as DefaultTransactionFolderResponse;

      return request(app.getHttpServer())
        .get('/transaction-folder')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const findAllResponse =
            res.body as PagedResponse<DefaultTransactionFolderResponse>;

          expect(findAllResponse.data[0]).toHaveProperty('id');
          expect(findAllResponse.data[0]).toHaveProperty('name');
          expect(findAllResponse.data[0]).toHaveProperty('description');
          expect(findAllResponse.data[0]).toHaveProperty('image');
          expect(findAllResponse.data[0]).toHaveProperty('createdAt');
          expect(findAllResponse.data[0]).toHaveProperty('updatedAt');

          expect(findAllResponse.data[0]).toMatchObject({
            ...body,
            id: transactionFolder.id,
          });
        });
    });

    it('should throw an error if user is not authenticated', () => {
      return request(app.getHttpServer())
        .get('/transaction-folder')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toMatchObject({
            path: '/transaction-folder',
            status: HttpStatus.UNAUTHORIZED,
            exception: Exception.UNAUTHORIZED,
            message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
          });
        });
    });
  });

  describe('(GET) /transaction-folder/:id', () => {
    afterEach(async () => {
      await prismaService.transactionFolder.deleteMany({
        where: {
          user: {
            email: requesterSignUpDto.email,
          },
        },
      });
    });

    it('should get a transaction folder', async () => {
      const body: CreateTransactionFolderBody = {
        name: 'E2E Transaction Folder',
        description: 'E2E Transaction Folder Description',
        image: null,
      };

      const createdResponse = await request(app.getHttpServer())
        .post('/transaction-folder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED);

      const transactionFolder =
        createdResponse.body as DefaultTransactionFolderResponse;

      await request(app.getHttpServer())
        .get(`/transaction-folder/${transactionFolder.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const findOneResponse = res.body as DefaultTransactionFolderResponse;

          expect(findOneResponse).toHaveProperty('id');
          expect(findOneResponse).toHaveProperty('name');
          expect(findOneResponse).toHaveProperty('description');
          expect(findOneResponse).toHaveProperty('image');
          expect(findOneResponse).toHaveProperty('createdAt');
          expect(findOneResponse).toHaveProperty('updatedAt');

          expect(findOneResponse).toMatchObject({
            ...body,
            id: transactionFolder.id,
          });
        });
    });
  });

  it('should throw an error if transaction folder is not found', () => {
    return request(app.getHttpServer())
      .get('/transaction-folder/nonexistent-id')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect((res) => {
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('exception');
        expect(res.body).toHaveProperty('message');

        expect(res.body).toMatchObject({
          path: '/transaction-folder/nonexistent-id',
          status: HttpStatus.NOT_FOUND,
          exception: Exception.TRANSACTION_FOLDER_NOT_FOUND,
          message: i18nService.t(
            `exceptions.${Exception.TRANSACTION_FOLDER_NOT_FOUND}`,
          ),
        });
      });
  });

  it('should throw an error if user is not authenticated', () => {
    return request(app.getHttpServer())
      .get('/transaction-folder/nonexistent-id')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('exception');
        expect(res.body).toHaveProperty('message');

        expect(res.body).toMatchObject({
          path: '/transaction-folder/nonexistent-id',
          status: HttpStatus.UNAUTHORIZED,
          exception: Exception.UNAUTHORIZED,
          message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
        });
      });
  });

  describe('(DELETE) /transaction-folder/:id', () => {
    afterEach(async () => {
      await prismaService.transactionFolder.deleteMany({
        where: {
          user: {
            email: requesterSignUpDto.email,
          },
        },
      });
    });

    it('should delete a transaction folder', async () => {
      const body: CreateTransactionFolderBody = {
        name: 'E2E Transaction Folder',
        description: 'E2E Transaction Folder Description',
        image: null,
      };

      const createdResponse = await request(app.getHttpServer())
        .post('/transaction-folder')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED);

      const transactionFolder =
        createdResponse.body as DefaultTransactionFolderResponse;

      await request(app.getHttpServer())
        .delete(`/transaction-folder/${transactionFolder.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NO_CONTENT);

      await request(app.getHttpServer())
        .get(`/transaction-folder/${transactionFolder.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should throw an error if transaction folder is not found', () => {
      return request(app.getHttpServer())
        .delete('/transaction-folder/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path: '/transaction-folder/nonexistent-id',
            status: HttpStatus.NOT_FOUND,
            exception: Exception.TRANSACTION_FOLDER_NOT_FOUND,
            message: i18nService.t(
              `exceptions.${Exception.TRANSACTION_FOLDER_NOT_FOUND}`,
            ),
          });
        });
    });

    it('should throw an error if user is not authenticated', () => {
      return request(app.getHttpServer())
        .delete('/transaction-folder/nonexistent-id')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path: '/transaction-folder/nonexistent-id',
            status: HttpStatus.UNAUTHORIZED,
            exception: Exception.UNAUTHORIZED,
            message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
          });
        });
    });
  });
});

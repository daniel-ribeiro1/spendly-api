import { I18nService } from 'nestjs-i18n';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { setupRequestValidation } from '@/core/configs/request-validation.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { SignInResponse } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpBody } from '@/modules/auth/dtos/sign-up.dto';
import { GlobalModule } from '@/modules/global/global.module';
import { DefaultTransactionResponse } from '@/modules/transaction/dtos/transaction.dto';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { Exception } from '@/shared/enums/exceptions.enum';
import { PrismaService } from '@/shared/services/prisma.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  TransactionCategory,
  TransactionFolder,
  TransactionType,
} from '@prisma/client';

describe('TransactionController (e2e)', () => {
  let app: INestApplication<App>;

  let prismaService: PrismaService;
  let i18nService: I18nService;

  let accessToken: string;

  const requester: SignUpBody = {
    name: 'E2E User',
    email: 'transaction-e2e@example.com',
    password: '@Password123',
    picture: null,
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, AuthModule, GlobalModule, TransactionModule],
    }).compile();

    app = module.createNestApplication();

    setupRequestValidation(app);

    await app.init();

    prismaService = app.get(PrismaService);
    i18nService = app.get(I18nService);

    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(requester)
      .expect(HttpStatus.CREATED);

    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: requester.email,
        password: requester.password,
      })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');

        const response = res.body as SignInResponse;
        accessToken = response.accessToken;
      });
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: {
        email: requester.email,
      },
    });

    await app.close();
  });

  describe('(POST) /transactions', () => {
    let transactionType: TransactionType;
    let transactionFolder: TransactionFolder;
    let transactionCategory: TransactionCategory;

    beforeAll(async () => {
      transactionType = await prismaService.transactionType.create({
        data: {
          order: 1,
          name: 'E2E_SIMPLE_EXAMPLE_TYPE',
        },
      });

      transactionFolder = await prismaService.transactionFolder.create({
        data: {
          name: 'E2E_SIMPLE_EXAMPLE_FOLDER',
          user: {
            connect: {
              email: requester.email,
            },
          },
        },
      });

      transactionCategory = await prismaService.transactionCategory.create({
        data: {
          name: 'E2E_SIMPLE_EXAMPLE_CATEGORY',
          normalizedName: 'E2E_SIMPLE_EXAMPLE_CATEGORY',
          user: {
            connect: {
              email: requester.email,
            },
          },
        },
      });
    });

    afterAll(async () => {
      await prismaService.transaction.deleteMany({
        where: {
          user: {
            email: requester.email,
          },
        },
      });

      await prismaService.transactionType.deleteMany({
        where: {
          id: transactionType.id,
        },
      });

      await prismaService.transactionFolder.deleteMany({
        where: {
          OR: [
            {
              user: {
                email: requester.email,
              },
            },
            {
              id: transactionFolder.id,
            },
          ],
        },
      });

      await prismaService.transactionCategory.deleteMany({
        where: {
          OR: [
            { id: transactionCategory.id },
            {
              user: {
                email: requester.email,
              },
            },
          ],
        },
      });
    });

    it('should create a transaction', async () => {
      const body = {
        name: 'Test Transaction',
        description: 'Test Transaction description',
        amount: 100,
        date: new Date().toISOString(),
        transactionTypeId: transactionType.id,
        transactionFolderId: transactionFolder.id,
        transactionCategoryId: transactionCategory.id,
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const response = res.body as DefaultTransactionResponse;

          expect(response).toHaveProperty('id');
          expect(response).toMatchObject(body);
        });
    });

    it('should create a transaction without category', async () => {
      const body = {
        name: 'Test Transaction Without Category',
        description: 'Test Transaction description',
        amount: 100,
        date: new Date().toISOString(),
        transactionTypeId: transactionType.id,
        transactionFolderId: transactionFolder.id,
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const response = res.body as DefaultTransactionResponse;

          expect(response).toHaveProperty('id');
          expect(response).toMatchObject({
            ...body,
            transactionCategoryId: null,
          });
        });
    });

    it('should not create a transaction with invalid transaction type', async () => {
      const body = {
        name: 'Test Transaction',
        description: 'Test Transaction description',
        amount: 100,
        date: new Date().toISOString(),
        transactionTypeId: 999, // Non-existent transaction type ID
        transactionFolderId: transactionFolder.id,
        transactionCategoryId: transactionCategory.id,
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path: '/transactions',
            status: HttpStatus.BAD_REQUEST,
            exception: Exception.TRANSACTION_TYPE_NOT_FOUND,
            message: i18nService.t(
              `exceptions.${Exception.TRANSACTION_TYPE_NOT_FOUND}`,
            ),
          });
        });
    });
  });
});

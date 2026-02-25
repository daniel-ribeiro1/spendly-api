import { I18nService } from 'nestjs-i18n';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SignInResponse } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpBody } from '@/modules/auth/dtos/sign-up.dto';
import { GlobalModule } from '@/modules/global/global.module';
import { CreateTransactionCategoryBody } from '@/modules/transaction-category/dtos/create-transaction-category.dto';
import { DefaultTransactionCategoryResponse } from '@/modules/transaction-category/dtos/transaction-category.dto';
import { TransactionCategoryModule } from '@/modules/transaction-category/transaction-category.module';
import { Exception } from '@/shared/enums/exceptions.enum';
import { PrismaService } from '@/shared/services/prisma.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('TransactionCategoryController (E2E)', () => {
  let app: INestApplication<App>;

  let prismaService: PrismaService;
  let i18nService: I18nService;

  let accessToken: string;

  const requester: SignUpBody = {
    email: 'transaction-category-e2e@example.com',
    name: 'E2E User',
    password: 'Senh@123456',
    picture: null,
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, AuthModule, GlobalModule, TransactionCategoryModule],
    }).compile();

    app = module.createNestApplication();

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
    await prismaService.user.delete({
      where: {
        email: requester.email,
      },
    });

    await app.close();
  });

  describe('(POST) /transaction-category', () => {
    const body: CreateTransactionCategoryBody = {
      name: 'Category',
      image: null,
    };

    afterEach(async () => {
      await prismaService.transactionCategory.deleteMany({
        where: {
          user: {
            email: requester.email,
          },
        },
      });
    });

    it('should create a transaction category', () => {
      return request(app.getHttpServer())
        .post('/transaction-category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('image');

          expect(res.body).toMatchObject(body);
        });
    });

    it('should throw an error if transaction category already exists', async () => {
      await request(app.getHttpServer())
        .post('/transaction-category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CREATED);

      return request(app.getHttpServer())
        .post('/transaction-category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body)
        .expect(HttpStatus.CONFLICT)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path: '/transaction-category',
            status: HttpStatus.CONFLICT,
            exception: Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS,
            message: i18nService.t(
              `exceptions.${Exception.TRANSACTION_CATEGORY_ALREADY_EXISTS}`,
            ),
          });
        });
    });

    it('should throw an error if user is not authenticated', () => {
      return request(app.getHttpServer())
        .post('/transaction-category')
        .send(body)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path: '/transaction-category',
            status: HttpStatus.UNAUTHORIZED,
            exception: Exception.UNAUTHORIZED,
            message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
          });
        });
    });
  });

  describe('(GET) /transaction-category', () => {
    const anotherRequester: SignUpBody = {
      email: 'another-transaction-category-e2e@example.com',
      name: 'Another E2E User',
      password: 'Senh@123456',
      picture: null,
    };

    afterAll(async () => {
      await prismaService.user.delete({
        where: {
          email: anotherRequester.email,
        },
      });
    });

    afterEach(async () => {
      await prismaService.transactionCategory.deleteMany({
        where: {
          user: {
            OR: [{ email: requester.email }, { email: anotherRequester.email }],
          },
        },
      });
    });

    it('should get all transaction categories by user', async () => {
      const response = await request(app.getHttpServer())
        .post('/transaction-category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'FindAllCategory',
          image: null,
        })
        .expect(HttpStatus.CREATED);

      const transactionCategory =
        response.body as DefaultTransactionCategoryResponse;

      return request(app.getHttpServer())
        .get('/transaction-category')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const response = res.body as DefaultTransactionCategoryResponse[];

          expect(response).toBeInstanceOf(Array);
          expect(
            response.find((item) => item.id === transactionCategory.id),
          ).toBeDefined();
        });
    });

    it('should return categories that match the search term', async () => {
      const transactionCategoryBody: CreateTransactionCategoryBody = {
        name: 'áFindAllCategorySearchTerm',
        image: null,
      };

      const response = await request(app.getHttpServer())
        .post('/transaction-category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(transactionCategoryBody)
        .expect(HttpStatus.CREATED);

      const transactionCategory =
        response.body as DefaultTransactionCategoryResponse;

      const searchTerm = transactionCategoryBody.name.toLowerCase().slice(0, 3);

      return request(app.getHttpServer())
        .get(`/transaction-category?searchTerm=${searchTerm}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const response = res.body as DefaultTransactionCategoryResponse[];

          expect(response).toBeInstanceOf(Array);
          expect(
            response.find((item) => item.id === transactionCategory.id),
          ).toBeDefined();
        });
    });

    it('should return an empty array if no categories match the search term', async () => {
      const transactionCategoryBody: CreateTransactionCategoryBody = {
        name: 'FindAllCategorySearchTermEmpty',
        image: null,
      };

      await request(app.getHttpServer())
        .post('/transaction-category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(transactionCategoryBody)
        .expect(HttpStatus.CREATED);

      const searchTerm = 'NonexistentSearchTerm';

      return request(app.getHttpServer())
        .get(`/transaction-category?searchTerm=${searchTerm}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const response = res.body as DefaultTransactionCategoryResponse[];

          expect(response).toBeInstanceOf(Array);
          expect(response).toHaveLength(0);
        });
    });

    it('should not return categories from another user', async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(anotherRequester)
        .expect(HttpStatus.CREATED);

      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: anotherRequester.email,
          password: anotherRequester.password,
        })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const response = res.body as SignInResponse;
          expect(response).toHaveProperty('accessToken');
        });

      const anotherRequesterAccessToken = (
        signInResponse.body as SignInResponse
      ).accessToken;

      const postTransactionCategoryAnotherRequesterResponse = await request(
        app.getHttpServer(),
      )
        .post('/transaction-category')
        .set('Authorization', `Bearer ${anotherRequesterAccessToken}`)
        .send({
          name: 'PostCategoryAnotherRequester',
          image: null,
        })
        .expect(HttpStatus.CREATED);

      const transactionCategoryAnotherRequester =
        postTransactionCategoryAnotherRequesterResponse.body as DefaultTransactionCategoryResponse;

      return request(app.getHttpServer())
        .get('/transaction-category')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const response = res.body as DefaultTransactionCategoryResponse[];

          expect(response).toBeInstanceOf(Array);
          expect(
            response.find(
              (res) => res.id === transactionCategoryAnotherRequester.id,
            ),
          ).toBeUndefined();
        });
    });

    it('should throw an error if user is not authenticated', () => {
      return request(app.getHttpServer())
        .get('/transaction-category')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path: '/transaction-category',
            status: HttpStatus.UNAUTHORIZED,
            exception: Exception.UNAUTHORIZED,
            message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
          });
        });
    });
  });
});

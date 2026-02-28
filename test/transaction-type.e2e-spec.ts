import { I18nService } from 'nestjs-i18n';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { setupRequestValidation } from '@/core/configs/request-validation.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { SignInResponse } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpBody } from '@/modules/auth/dtos/sign-up.dto';
import { GlobalModule } from '@/modules/global/global.module';
import { PrismaService } from '@/shared/services/prisma.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TransactionTypeModule } from '@/modules/transaction-type/transaction-type.module';
import { TransactionTypeName } from '@/shared/enums/transaction-type.enum';
import { DefaultTransactionTypeResponse } from '@/modules/transaction-type/dtos/transaction-type.dto';
import { Exception } from '@/shared/enums/exceptions.enum';

describe('TransactionTypeController (E2E)', () => {
  let app: INestApplication<App>;

  let prismaService: PrismaService;
  let i18nService: I18nService;

  let accessToken: string;

  const requester: SignUpBody = {
    email: 'transaction-type-e2e@example.com',
    name: 'E2E User',
    password: 'Senh@123456',
    picture: null,
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, AuthModule, GlobalModule, TransactionTypeModule],
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
    await prismaService.user.delete({
      where: {
        email: requester.email,
      },
    });

    await app.close();
  });

  describe('(GET) /transaction-type', () => {
    it('should return an array of transaction types', () => {
      return request(app.getHttpServer())
        .get('/transaction-type')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const response = res.body as DefaultTransactionTypeResponse[];
          const transactionTypes = Object.keys(TransactionTypeName).map(
            (key) => key,
          );

          expect(response).toBeInstanceOf(Array);
          expect(response).toHaveLength(transactionTypes.length);

          expect(response[0]).toHaveProperty('id');
          expect(response[0]).toHaveProperty('name');

          expect(
            response.every((item) => transactionTypes.includes(item.name)),
          );
        });
    });

    it('should throw an error if user is not authenticated', () => {
      return request(app.getHttpServer())
        .get('/transaction-type')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path: '/transaction-type',
            status: HttpStatus.UNAUTHORIZED,
            exception: Exception.UNAUTHORIZED,
            message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
          });
        });
    });
  });
});

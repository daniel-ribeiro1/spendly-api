import { I18nService } from 'nestjs-i18n';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SignInBody, SignInResponse } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpBody } from '@/modules/auth/dtos/sign-up.dto';
import { GlobalModule } from '@/modules/global/global.module';
import {
  CreateTransactionFolderBody,
  CreateTransactionFolderResponse,
} from '@/modules/transaction-folder/dtos/create-transaction-folder.dto';
import { TransactionFolderModule } from '@/modules/transaction-folder/transaction-folder.module';
import { UserModule } from '@/modules/user/user.module';
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
    try {
      const user = await prismaService.user.findUnique({
        where: {
          email: requesterSignUpDto.email,
        },
      });

      if (user) {
        await prismaService.transactionFolder.deleteMany({
          where: {
            userId: user.id,
          },
        });

        await prismaService.user.delete({
          where: {
            id: user.id,
          },
        });
      }
    } catch {
      // ignore
    }

    await app.close();
  });

  describe('(POST) /transaction-folder', () => {
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
    it('should update a transaction folder', () => {
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
          const response = res.body as CreateTransactionFolderResponse;
          const updateBody = {
            name: 'E2E Transaction Folder Updated',
          };

          return request(app.getHttpServer())
            .patch(`/transaction-folder/${response.id}`)
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
    });

    it('should throw an error if user is not authenticated', () => {
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
          const response = res.body as CreateTransactionFolderResponse;
          const updateBody = {
            name: 'E2E Transaction Folder Updated',
          };

          return request(app.getHttpServer())
            .patch(`/transaction-folder/${response.id}`)
            .send(updateBody)
            .expect(HttpStatus.OK)
            .expect((res) => {
              expect(res.body).toHaveProperty('path');
              expect(res.body).toHaveProperty('status');
              expect(res.body).toHaveProperty('exception');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toMatchObject({
                path: '/transaction-folder/:id',
                status: HttpStatus.UNAUTHORIZED,
                exception: Exception.UNAUTHORIZED,
                message: i18nService.t(`exceptions.${Exception.UNAUTHORIZED}`),
              });
            });
        });
    });

    it('should throw an error if transaction folder is not found', () => {
      return request(app.getHttpServer())
        .patch('/transaction-folder/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
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
});

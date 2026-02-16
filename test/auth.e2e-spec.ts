import { I18nService } from 'nestjs-i18n';
import request from 'supertest';
import { App } from 'supertest/types';

import { AuthModule } from '@/modules/auth/auth.module';
import { SignUpDto } from '@/modules/auth/dtos/sign-up.dto';
import { GlobalModule } from '@/modules/global/global.module';
import { UserModule } from '@/modules/user/user.module';
import { Exception } from '@/shared/enums/exceptions.enum';
import { PrismaService } from '@/shared/services/prisma.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthController (E2E)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let i18nService: I18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule, GlobalModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = app.get(PrismaService);
    i18nService = app.get(I18nService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('(POST) /auth/sign-up', () => {
    const signUpDto: SignUpDto = {
      name: 'Admin do Sistema',
      password: 'Senh@123456',
      email: 'admin@example.com',
      picture: null,
    };

    beforeEach(async () => {
      await prismaService.user.delete({
        where: { email: signUpDto.email },
      });
    });

    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('picture');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should throw an error if user already exists', async () => {
      await request(app.getHttpServer()).post('/auth/sign-up').send(signUpDto);

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(HttpStatus.CONFLICT)
        .expect((res) => {
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('exception');
          expect(res.body).toHaveProperty('message');

          expect(res.body).toMatchObject({
            path: '/auth/sign-up',
            status: HttpStatus.CONFLICT,
            exception: Exception.USER_ALREADY_EXISTS,
            message: i18nService.t(
              `exceptions.${Exception.USER_ALREADY_EXISTS}`,
            ),
          });
        });
    });
  });
});

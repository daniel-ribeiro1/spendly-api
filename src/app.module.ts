import { AppController } from '@/app.controller';
import { AuthorizationMiddleware } from '@/core/middlewares/authorization.middleware';
import { LocalStorageMiddleware } from '@/core/middlewares/local-storage.middleware';
import { AuthModule } from '@/modules/auth/auth.module';
import { GlobalModule } from '@/modules/global/global.module';
import { UserModule } from '@/modules/user/user.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  controllers: [AppController],
  imports: [AuthModule, UserModule, GlobalModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocalStorageMiddleware).forRoutes('*');

    consumer
      .apply(AuthorizationMiddleware)
      .exclude('auth/*path')
      .exclude('/health-check')
      .forRoutes('*');
  }
}

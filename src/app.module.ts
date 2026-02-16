import { AppController } from '@/app.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { GlobalModule } from '@/modules/global/global.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AppController],
  imports: [AuthModule, GlobalModule],
})
export class AppModule {}

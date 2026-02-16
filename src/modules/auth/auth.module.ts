import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthController],
  imports: [UserModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

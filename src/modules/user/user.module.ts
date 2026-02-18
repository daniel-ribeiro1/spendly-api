import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserJwtService } from '@/modules/user/services/user-jwt.service';
import { UserService } from '@/modules/user/services/user.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [UserJwtService, UserRepository, UserService],
  exports: [UserService, UserJwtService],
})
export class UserModule {}

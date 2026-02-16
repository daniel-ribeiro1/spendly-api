import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserService } from '@/modules/user/services/user.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}

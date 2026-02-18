import { RequestException } from '@/core/exceptions/request.exception';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { Exception } from '@/shared/enums/exceptions.enum';
import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new RequestException(
        Exception.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new RequestException(
        Exception.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  create(
    user: Pick<User, 'name' | 'password' | 'email' | 'picture'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }
}

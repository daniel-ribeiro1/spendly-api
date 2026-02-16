import { RequestException } from '@/core/exceptions/request.exception';
import { SignUpDto, SignUpResponse } from '@/modules/auth/dtos/sign-up.dto';
import { UserService } from '@/modules/user/services/user.service';
import { Exception } from '@/shared/enums/exceptions.enum';
import { EncryptionUtil } from '@/shared/utils/encryption.util';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(body: SignUpDto): Promise<SignUpResponse> {
    try {
      const user = await this.userService.findByEmail(body.email);

      if (user) {
        throw new RequestException(
          Exception.USER_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
    } catch (error) {
      if (
        (error instanceof RequestException &&
          error.exception === Exception.USER_ALREADY_EXISTS) ||
        !(error instanceof RequestException)
      )
        throw error;
    }

    const password = await EncryptionUtil.encrypt(body.password);

    return this.userService.create({
      ...body,
      password,
    });
  }
}

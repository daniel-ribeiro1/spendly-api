import { RequestException } from '@/core/exceptions/request.exception';
import { SignInBody, SignInResponse } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpBody, SignUpResponse } from '@/modules/auth/dtos/sign-up.dto';
import { UserJwtService } from '@/modules/user/services/user-jwt.service';
import { UserService } from '@/modules/user/services/user.service';
import { Exception } from '@/shared/enums/exceptions.enum';
import { EncryptionUtil } from '@/shared/utils/encryption.util';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userJwtService: UserJwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(body: SignUpBody): Promise<SignUpResponse> {
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

  async signIn(body: SignInBody): Promise<SignInResponse> {
    try {
      const user = await this.userService.findByEmail(body.email);
      const doesPasswordMatch = await EncryptionUtil.compare(
        body.password,
        user.password,
      );

      if (!doesPasswordMatch) {
        throw new RequestException(
          Exception.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        accessToken: this.userJwtService.createAccessToken({
          id: user.id,
          name: user.name,
          email: user.email,
        }),
        refreshToken: this.userJwtService.createRefreshToken({
          id: user.id,
        }),
      };
    } catch (error) {
      if (!(error instanceof RequestException)) throw error;

      if (error.exception === Exception.USER_NOT_FOUND) {
        throw new RequestException(
          Exception.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw error;
    }
  }
}

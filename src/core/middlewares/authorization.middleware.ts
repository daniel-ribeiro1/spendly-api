import { NextFunction, Request, Response } from 'express';

import { RequestException } from '@/core/exceptions/request.exception';
import { UserJwtService } from '@/modules/user/services/user-jwt.service';
import { UserService } from '@/modules/user/services/user.service';
import { Exception } from '@/shared/enums/exceptions.enum';
import { LocalStorageService } from '@/shared/services/local-storage.service';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly userJwtService: UserJwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    await this.handleAuthorization(req);

    next();
  }

  private async handleAuthorization(req: Request) {
    const [schema, token] = req.headers?.authorization?.split(' ') || [];

    if (schema !== 'Bearer' || !token)
      throw new RequestException(
        Exception.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const jwtPayload = this.userJwtService.decodeAccessToken(token);
      const user = await this.userService.findById(jwtPayload.id);

      this.localStorageService.set('requester', {
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      if (!(error instanceof RequestException)) {
        if (
          error instanceof Error &&
          error.message == (Exception.INVALID_TOKEN as string)
        )
          throw new RequestException(
            Exception.INVALID_TOKEN,
            HttpStatus.UNAUTHORIZED,
          );

        throw error;
      }

      if (error.exception === Exception.USER_NOT_FOUND)
        throw new RequestException(
          Exception.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );

      throw error;
    }
  }
}

import jwt from 'jsonwebtoken';

import { EnvironmentKey } from '@/shared/enums/environment.enum';
import { Exception } from '@/shared/enums/exceptions.enum';
import { UserJwtPayload } from '@/shared/types/user-jwt.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserJwtService {
  constructor(private readonly configService: ConfigService) {}

  createAccessToken(payload: UserJwtPayload): string {
    const EXPIRES_IN = this.configService.getOrThrow<
      jwt.SignOptions['expiresIn']
    >(EnvironmentKey.JWT_ACCESS_TOKEN_EXPIRATION);

    return this._sign(payload, EXPIRES_IN);
  }

  createRefreshToken(payload: Pick<UserJwtPayload, 'id'>): string {
    const EXPIRES_IN = this.configService.getOrThrow<
      jwt.SignOptions['expiresIn']
    >(EnvironmentKey.JWT_REFRESH_TOKEN_EXPIRATION);

    return this._sign(payload, EXPIRES_IN);
  }

  decodeAccessToken(token: string): UserJwtPayload {
    const API_SECRET = this.configService.getOrThrow<string>(
      EnvironmentKey.API_SECRET,
    );

    try {
      jwt.verify(token, API_SECRET) as UserJwtPayload;

      return jwt.decode(token) as UserJwtPayload;
    } catch {
      throw new Error(Exception.INVALID_TOKEN);
    }
  }

  private _sign(
    payload: Pick<UserJwtPayload, 'id'> & Partial<Omit<UserJwtPayload, 'id'>>,
    expiresIn: jwt.SignOptions['expiresIn'],
  ): string {
    const API_SECRET = this.configService.getOrThrow<string>(
      EnvironmentKey.API_SECRET,
    );

    const options: jwt.SignOptions = {
      expiresIn,
      subject: payload.id,
    };

    return jwt.sign(payload, API_SECRET, options);
  }
}

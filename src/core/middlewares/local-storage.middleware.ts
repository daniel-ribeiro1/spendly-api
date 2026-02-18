import { NextFunction, Request, Response } from 'express';
import { CLS_ID } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

import { LocalStorageService } from '@/shared/services/local-storage.service';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LocalStorageMiddleware implements NestMiddleware {
  constructor(private readonly localStorageService: LocalStorageService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.localStorageService.run(() => {
      this.localStorageService.set(CLS_ID, uuidv4());

      return next();
    });
  }
}

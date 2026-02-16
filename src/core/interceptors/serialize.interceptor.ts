import { ClassConstructor, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly classConstructor: ClassConstructor<unknown>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (!data || typeof data !== 'object')
          return data as undefined | null | string | number | boolean;

        return plainToClass(this.classConstructor, data, {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

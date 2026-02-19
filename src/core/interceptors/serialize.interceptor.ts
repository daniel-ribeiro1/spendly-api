import { ClassConstructor, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

import { PagedResponse } from '@/shared/dtos/pagination.dto';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly classConstructor: ClassConstructor<unknown>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((response) => {
        if (!response || typeof response !== 'object')
          return response as undefined | null | string | number | boolean;

        if (response instanceof PagedResponse)
          return this._serializePagedResponse(response);

        if (Array.isArray(response))
          return response.map((item) => this._defaultSerialize(item));

        return this._defaultSerialize(response);
      }),
    );
  }

  private _serializePagedResponse(
    response: PagedResponse<unknown>,
  ): PagedResponse<unknown> {
    return {
      data: response.data.map((item) =>
        plainToClass(this.classConstructor, item, {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        }),
      ),
      metadata: response.metadata,
    };
  }

  private _defaultSerialize(response: unknown): unknown {
    return plainToClass(this.classConstructor, response, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
  }
}

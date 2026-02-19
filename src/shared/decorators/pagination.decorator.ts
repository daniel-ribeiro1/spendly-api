import { ClassConstructor } from 'class-transformer';

import {
  PagedResponse,
  PaginationMetadata,
} from '@/shared/dtos/pagination.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseNoStatusOptions,
  getSchemaPath,
} from '@nestjs/swagger';

export function ApiPagedResponse<T>(
  model: ClassConstructor<T>,
  options?: Pick<ApiResponseNoStatusOptions, 'description'>,
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ApiExtraModels(PagedResponse, PaginationMetadata, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PagedResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              metadata: { $ref: getSchemaPath(PaginationMetadata) },
            },
          },
        ],
      },
      ...options,
    }),
  );
}

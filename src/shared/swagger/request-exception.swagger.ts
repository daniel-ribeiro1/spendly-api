import { Exception } from '@/shared/enums/exceptions.enum';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function createRequestExceptionSwaggerSchema(metadata: {
  schema?: {
    name?: string;
  };
  example: {
    path: string;
    status: HttpStatus;
    exception: Exception;
    message: string;
  };
}) {
  class RequestExceptionSwaggerModel {
    @ApiProperty({
      description: 'Endpoint que apresentou o erro.',
      example: metadata.example.path,
    })
    path: string;

    @ApiProperty({
      description: 'Status HTTP do erro.',
      example: metadata.example.status,
    })
    status: string;

    @ApiProperty({
      description: 'Enum que representa o erro.',
      example: metadata.example.exception,
    })
    exception: string;

    @ApiProperty({
      description: 'Mensagem de erro.',
      example: metadata.example.message,
    })
    message: string;
  }

  Object.defineProperty(RequestExceptionSwaggerModel, 'name', {
    value:
      metadata.schema?.name ||
      `RequestException${metadata.example.exception
        .split('_')
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase(),
        )
        .join('')}`,
  });

  return RequestExceptionSwaggerModel;
}

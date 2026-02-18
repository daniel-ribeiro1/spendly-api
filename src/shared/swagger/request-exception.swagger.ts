import { Exception } from '@/shared/enums/exceptions.enum';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export function createRequestExceptionSwaggerModel(requestException: {
  path: string;
  status: HttpStatus;
  exception: Exception;
  message: string;
}) {
  class RequestExceptionSwaggerModel {
    @ApiProperty({
      description: 'Endpoint que apresentou o erro.',
      example: requestException.path,
    })
    path: string;

    @ApiProperty({
      description: 'Status HTTP do erro.',
      example: requestException.status,
    })
    status: string;

    @ApiProperty({
      description: 'Enum que representa o erro.',
      example: requestException.exception,
    })
    exception: string;

    @ApiProperty({
      description: 'Mensagem de erro.',
      example: requestException.message,
    })
    message: string;
  }

  Object.defineProperty(RequestExceptionSwaggerModel, 'name', {
    value: `RequestException${requestException.exception
      .split('_')
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase(),
      )
      .join('')}`,
  });

  return RequestExceptionSwaggerModel;
}

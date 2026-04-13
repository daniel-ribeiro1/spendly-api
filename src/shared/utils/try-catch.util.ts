import { RequestException } from '@/core/exceptions/request.exception';
import { Exception } from '@/shared/enums/exceptions.enum';
import { HttpStatus } from '@nestjs/common';

export async function tryIt<T>(
  fn: () => T | Promise<T>,
  catchFn?: (error: unknown) => void,
): Promise<T> {
  try {
    const response = await fn();

    return response;
  } catch (error) {
    if (catchFn) {
      catchFn(error);
    }

    const internalServerErrorException = new RequestException(
      Exception.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    if (error instanceof Error) {
      internalServerErrorException.cause = error;
      internalServerErrorException.message = error.message;
      internalServerErrorException.stack = error.stack;
    }

    throw internalServerErrorException;
  }
}

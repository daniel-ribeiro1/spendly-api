import { Exception } from '@/shared/enums/exceptions.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestException extends HttpException {
  constructor(
    public exception: Exception,
    status: HttpStatus,
  ) {
    super(exception, status);
  }
}

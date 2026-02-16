import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RequestException } from '@/core/exceptions/request.exception';
import { I18nService } from 'nestjs-i18n';
import { Request, Response } from 'express';

@Catch(RequestException)
export class RequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18nService: I18nService) {}
  catch(requestException: RequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (requestException instanceof RequestException) {
      response.status(requestException.getStatus()).json({
        path: request.originalUrl,
        status: requestException.getStatus(),
        exception: requestException.exception,
        message: this.i18nService.translate(
          `exceptions.${requestException.exception}`,
        ),
      });
    }
  }
}

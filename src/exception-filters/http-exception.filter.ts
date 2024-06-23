import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionInfo = this.parseJSONOrText(exception.message);

    if (
      ![
        HttpStatus.BAD_REQUEST,
        HttpStatus.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
      ].includes(status)
    ) {
      console.error(exception);
    }

    response.status(status).json({
      status: 'fail',
      data: exceptionInfo,
      code: status || 500,
      timestamps: new Date().toISOString(),
    });
  }

  private parseJSONOrText(str: string): object | string {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }
}

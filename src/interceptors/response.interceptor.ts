import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return {
          status: 'success',
          data,
        };
      }),
      catchError((err) => {
        if (err instanceof HttpException) {
          throw new HttpException(err.message, err.getStatus());
        }

        throw new InternalServerErrorException(err.message);
      }),
    );
  }
}

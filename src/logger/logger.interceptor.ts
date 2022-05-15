import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  public constructor(
    @Inject(LoggerService.diKey) private logger: LoggerService,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        this.logger.requestError({
          message: err.message,
          exception: err.stack,
          httpRequestBody: {
            url: request.url,
            method: request.method,
          },
        });

        return throwError(() => err);
      }),
    );
  }
}

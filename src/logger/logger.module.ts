import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module, Scope } from '@nestjs/common';
import { loggerService, LoggerService } from './logger.service';
import { LoggerInterceptor } from './logger.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      scope: Scope.DEFAULT,
      provide: LoggerService.diKey,
      useValue: loggerService,
    },
  ],
  exports: [
    {
      scope: Scope.DEFAULT,
      provide: LoggerService.diKey,
      useValue: loggerService,
    },
  ],
})
export class LoggerModule {}

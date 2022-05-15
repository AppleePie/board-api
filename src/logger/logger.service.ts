import { ErrorType, LevelEnum, RequestErrorType } from './types';

const systemName = 'board-api';

function stdout(message: unknown) {
  console.log(JSON.stringify(message));
}

function logBase(
  errorLevel: LevelEnum,
  message?: string | string[],
): ErrorType {
  return {
    '@timestamp': new Date().toISOString(),
    level: errorLevel,
    system: systemName,
    message: Array.isArray(message) ? message.toString() : message || '',
  };
}

class Logger {
  info(...messages: string[]) {
    stdout(logBase(LevelEnum.info, messages));
  }
  trace(...messages: string[]) {
    stdout(logBase(LevelEnum.trace, messages));
  }
  warn(...messages: string[]) {
    stdout(logBase(LevelEnum.warn, messages));
  }
  error(...messages: string[]) {
    stdout(logBase(LevelEnum.error, messages));
  }
  fatal(...messages: string[]) {
    stdout(logBase(LevelEnum.fatal, messages));
  }
  debug(...messages: string[]) {
    stdout(logBase(LevelEnum.debug, messages));
  }
  child() {
    return new Logger();
  }
}

export class LoggerService extends Logger {
  public static diKey = Symbol.for('LoggerServiceKey');

  public requestError(error: RequestErrorType): void {
    stdout({
      ...logBase(LevelEnum.error),
      ...error,
    });
  }
}

export const loggerService = new LoggerService();

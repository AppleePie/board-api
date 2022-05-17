export type RequestErrorType = {
  message: string;
  userId?: number;
  exception?: string;
  httpRequestBody?: Record<string, unknown>;
  httpResponseBody?: Record<string, unknown>;
};

export enum LevelEnum {
  'error' = 'ERROR',
  'debug' = 'DEBUG',
  'critical' = 'CRITICAL',
  'fatal' = 'FATAL',
  'emergency' = 'EMERGENCY',
  'info' = 'INFO',
  'important' = 'IMPORTANT',
  'warn' = 'WARN',
  'trace' = 'TRACE',
}

export type ErrorType = {
  '@timestamp': string; // дата/время лога в utc
  level: LevelEnum;
  system: string; // имя приложения
  message: string;
};

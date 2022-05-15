export type RequestErrorType = {
  message: string;
  userId?: number; // id пользователя
  exception?: string; // ошибка (если есть с трейсом)
  httpRequestBody?: Record<string, unknown>; // тело запроса, нужно чуствительные данные вырезать https://wiki.tcsbank.ru/pages/viewpage.action?pageId=517257323
  httpResponseBody?: Record<string, unknown>; // тело ответа, требования аналогичны httpRequestBody
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

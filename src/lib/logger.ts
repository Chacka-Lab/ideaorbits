type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LoggerFn = (message: string, meta?: unknown) => void;

interface Logger {
  debug: LoggerFn;
  info: LoggerFn;
  warn: LoggerFn;
  error: LoggerFn;
}

function createLogger(): Readonly<Logger> {
  const write = (level: LogLevel, message: string, ...params: unknown[]) => {
    if (import.meta.env.PROD && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const payload = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
      case 'debug':
        console.debug(payload, ...params);
        break;
      case 'info':
        console.info(payload, ...params);
        break;
      case 'warn':
        console.warn(payload, ...params);
        break;
      case 'error':
        console.error(payload, ...params);
        break;
    }
  };

  return {
    debug: (message, meta) => write('debug', message, ...(meta ? [meta] : [])),
    info: (message, meta) => write('info', message, ...(meta ? [meta] : [])),
    warn: (message, meta) => write('warn', message, ...(meta ? [meta] : [])),
    error: (message, meta) => write('error', message, ...(meta ? [meta] : [])),
  };
}

const logger = createLogger();

export default logger;

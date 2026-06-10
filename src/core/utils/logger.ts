type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const configuredLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || 'info';

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[configuredLevel];
}

function timestamp(): string {
  return new Date().toISOString();
}

export const Logger = {
  debug: (msg: string, ctx?: unknown) => {
    if (shouldLog('debug'))
      console.debug(`[${timestamp()}] 🔍 DEBUG  ${msg}`, ctx ?? '');
  },
  info: (msg: string, ctx?: unknown) => {
    if (shouldLog('info'))
      console.info(`[${timestamp()}] ℹ INFO   ${msg}`, ctx ?? '');
  },
  warn: (msg: string, ctx?: unknown) => {
    if (shouldLog('warn'))
      console.warn(`[${timestamp()}] ⚠ WARN   ${msg}`, ctx ?? '');
  },
  error: (msg: string, ctx?: unknown) => {
    if (shouldLog('error'))
      console.error(`[${timestamp()}] ✖ ERROR  ${msg}`, ctx ?? '');
  },
  latency: (url: string, ms: number, warnMs: number, failMs: number) => {
    if (ms >= failMs) {
      console.error(
        `[${timestamp()}] 🔴 LATENCY FAIL  ${ms}ms >= ${failMs}ms  ← ${url}`
      );
    } else if (ms >= warnMs) {
      console.warn(
        `[${timestamp()}] 🟡 LATENCY WARN  ${ms}ms >= ${warnMs}ms  ← ${url}`
      );
    } else {
      console.info(
        `[${timestamp()}] 🟢 LATENCY OK    ${ms}ms  ← ${url}`
      );
    }
  },
};

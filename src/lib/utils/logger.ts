type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerConfig {
  enabled: boolean
  level: LogLevel
  prefix?: string
}

class Logger {
  private config: LoggerConfig

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      enabled: process.env.NODE_ENV === 'development',
      level: 'debug',
      prefix: '[App]',
      ...config,
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.config.level)
    const requestedLevelIndex = levels.indexOf(level)

    return requestedLevelIndex >= currentLevelIndex
  }

  private formatMessage(level: LogLevel, ...args: unknown[]): unknown[] {
    const timestamp = new Date().toISOString()
    const prefix = this.config.prefix
    const levelEmoji = {
      debug: '🐛',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }[level]

    return [`${levelEmoji} ${prefix} [${timestamp}]`, ...args]
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(...this.formatMessage('debug', ...args))
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', ...args))
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', ...args))
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.formatMessage('error', ...args))
    }
  }

  group(label: string, callback: () => void): void {
    if (this.config.enabled) {
      console.group(label)
      callback()
      console.groupEnd()
    }
  }
}

export const logger = new Logger()

export const createLogger = (config?: Partial<LoggerConfig>) => new Logger(config)
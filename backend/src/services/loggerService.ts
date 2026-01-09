import fs from "fs";
import path from "path";

enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

class Logger {
  private logDir = path.join(process.cwd(), "logs");
  private logLevel = (process.env.LOG_LEVEL || "info").toUpperCase();

  constructor() {
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] ${message}${metaStr}\n`;
  }

  private writeLog(level: LogLevel, message: string, meta?: any) {
    const formattedMessage = this.formatMessage(level, message, meta);

    if (this.shouldLog(level)) {
      console.log(formattedMessage);
    }

    const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`);
    fs.appendFileSync(logFile, formattedMessage);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.logLevel as LogLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  error(message: string, meta?: any) {
    this.writeLog(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta?: any) {
    this.writeLog(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: any) {
    this.writeLog(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: any) {
    this.writeLog(LogLevel.DEBUG, message, meta);
  }
}

export const logger = new Logger();

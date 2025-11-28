import { LogLevel } from "../enums/log-level.enum";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = LogLevel.DEBUG;
  private logToConsole = true;
  private logToServer = false;
  private logToLocalStorage = false;
  private serverEndpoint = '';
  private context: any = {};

  constructor(){}

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  setServerEndpoint(endpoint: string): void {
    this.serverEndpoint = endpoint;
    this.logToServer = true;
  }

  setLogToConsole(value: boolean): void {
    this.logToConsole = value;
  }

  setLogToLocalStorage(value: boolean): void {
    this.logToLocalStorage = value;
  }

  addContext(context: any): void {
    this.context = { ...this.context, ...context };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private log(level: LogLevel, message: string, ...optionalParams: any[]): void {
    if (!this.shouldLog(level)) return;

    const logEntry = {
      level: LogLevel[level],
      message: message,
      params: optionalParams,
      context: this.context,
      timestamp: new Date()
    };

    if (this.logToConsole) {
      switch (level) {
        case LogLevel.DEBUG:
        case LogLevel.INFO:
          console.log(`[${logEntry.timestamp}] - [${logEntry.level}] ${logEntry.message}`, ...logEntry.params);
          break;
        case LogLevel.WARN:
          console.warn(`[${logEntry.timestamp}] - [${logEntry.level}] ${logEntry.message}`, ...logEntry.params);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(`[${logEntry.timestamp}] - [${logEntry.level}] ${logEntry.message}`, ...logEntry.params);
          break;
      }
    }

    if (this.logToServer && this.serverEndpoint) {
      this.sendToServer(logEntry);
    }

    if (this.logToLocalStorage) {
      this.saveToLocalStorage(logEntry);
    }
  }

  private sendToServer(log: any): void {
    // Implementar la logica asociada al logger con el back
  }

  private saveToLocalStorage(log: any): void {
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push(log);
    localStorage.setItem('logs', JSON.stringify(logs));
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.DEBUG, message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.INFO, message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.WARN, message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.ERROR, message, ...optionalParams);
  }

  fatal(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.FATAL, message, ...optionalParams);
  }
}

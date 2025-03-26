/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import chalk from 'chalk'
import { name as PACKAGE_NAME } from '../../../package.json'
import { Injectable } from '../decorators'

const LOGGERTYPE: Record<string, any> = {
  log: chalk.green.bold,
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  debug: chalk.cyan.bold,
  verbose: chalk.magenta.bold
}
export declare type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose'
export interface LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]): void
  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]): void
  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]): void
  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]): void
  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]): void
}

/**
 *
 * @export
 * @class Logger
 * @implements {LoggerService}
 */
@Injectable()
export class Logger implements LoggerService {
  private static WrapBuffer: MethodDecorator = (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalFn = descriptor.value
    descriptor.value = function (...args: any[]) {
      const staticLogger = `${LOGGERTYPE[<string>propertyKey](
        `[${PACKAGE_NAME}]`
      )} ${chalk.white.bold(new Date().toLocaleString())} ${LOGGERTYPE[
        <string>propertyKey
      ](`[${propertyKey.toString().toUpperCase()}]`)} ${chalk.yellow.bold(
        '[RouterExplorer]'
      )} ${chalk.green.bold('Mapped')}`
      return originalFn.apply(this, [staticLogger, ...args])
    }
  }

  log(message: any): void
  log(message: any, ...optionalParams: any[]): void

  @Logger.WrapBuffer
  log(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams)
  }

  error(message: any): void
  error(message: any, ...optionalParams: any[]): void

  @Logger.WrapBuffer
  error(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams)
  }

  warn(message: any): void
  warn(message: any, ...optionalParams: any[]): void

  @Logger.WrapBuffer
  warn(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams)
  }
  debug?(message: any): void
  debug?(message: any, ...optionalParams: any[]): void

  @Logger.WrapBuffer
  debug?(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams)
  }

  verbose?(message: any): void
  verbose?(message: any, ...optionalParams: any[]): void

  @Logger.WrapBuffer
  verbose?(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams)
  }

  constructor(...args: any) {}
}

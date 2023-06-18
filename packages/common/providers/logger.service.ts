import { Injectable } from '../decorators'
import chalk from 'chalk'

export declare type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose'
export interface LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]): any
  /**
   * Write an 'error' level log.
   */
  error(message: any, trace: string): any
  /**
   * Write a 'warn' level log.
   */
  warn(message: any): any
  /**
   * Write a 'debug' level log.
   */
  debug?(message: any): any
  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any): any
}
@Injectable()
export class Logger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log(
      `${chalk.blue('[LOG]')} ${chalk.white(message)} ${chalk.yellow(
        optionalParams.join(' ')
      )}`
    )
  }
  error(message: any, trace: string) {
    console.log(
      `${chalk.red('[ERROR]')} ${chalk.white(message)} ${chalk.red(trace)}`
    )
  }
  warn(message: any) {
    console.log(`${chalk.yellow('[WARN]')} ${chalk.white(message)}`)
  }
  debug?(message: any) {
    console.log(`${chalk.green('[DEBUG]')} ${chalk.white(message)}`)
  }
  verbose?(message: any) {
    console.log(`${chalk.magenta('[VERBOSE]')} ${chalk.white(message)}`)
  }
}

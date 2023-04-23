/**
 * @module Pipe
 * @method ParseBoolPipe
 * @auther kaichao.feng
 * @description transfer Data to Boolean
 */
export class ParseBoolPipe {
  transform(value: any): boolean {
    return Boolean(value)
  }
}

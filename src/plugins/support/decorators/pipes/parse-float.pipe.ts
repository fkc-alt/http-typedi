/**
 * @module Pipe
 * @method ParseFloatPipe
 * @auther kaichao.feng
 * @description transfer Data to Float
 */
export class ParseFloatPipe {
  transform(integer: any): number {
    return /^\d+$/g.test(integer) ? parseFloat(integer) : integer
  }
}

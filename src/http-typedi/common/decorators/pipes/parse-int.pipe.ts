/**
 * @module Pipe
 * @method ParseIntPipe
 * @auther kaichao.feng
 * @description transfer Data to Number
 */
export class ParseIntPipe<T = number> {
  transform(integer: any): T {
    return /^\d+$/g.test(integer) ? parseInt(integer) : integer
  }
}

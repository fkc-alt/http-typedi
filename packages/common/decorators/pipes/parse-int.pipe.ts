/**
 * @module Pipe
 * @method ParseIntPipe
 * @auther kaichao.feng
 * @description transfer Data to Number
 */
export class ParseIntPipe {
  transform(integer: any): number | string {
    return /^\d+$/g.test(integer) ? ~~integer : integer
  }
}

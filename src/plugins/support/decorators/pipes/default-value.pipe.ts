/**
 * @module Pipe
 * @method DefaultValuePipe
 * @auther kaichao.feng
 * @description transfer Data to DefaultValue
 */
export class DefaultValuePipe<T = any> {
  protected readonly defaultValue!: T
  constructor(defaultValue: T) {
    Object.assign(this, { defaultValue })
  }
}

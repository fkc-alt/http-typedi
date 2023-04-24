import { MetadataKey } from '../../enums'

/**
 * @module Controller
 * @param { string } prefix
 * @auther kaichao.feng
 * @description Request Controller
 */
export const Controller = (prefix = ''): ClassDecorator => {
  return function (target: any) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    target.prototype[`${target.name}-Prefix`] = prefix
      ? prefix.replace(/^\//g, '') + '/'
      : ''
    Reflect.defineMetadata(MetadataKey.INJECTABLE_WATERMARK, true, target)
  }
}

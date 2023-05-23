import { MetadataKey } from '../../enums'
import { CONNECTSTRING } from '../../helper/constant'

const optionsDefault = {
  version: ''
}

/**
 * @module Controller
 * @param { string } prefix
 * @auther kaichao.feng
 * @description Request Controller
 */
export const Controller = (
  prefix = '',
  options?: typeof optionsDefault
): ClassDecorator => {
  return function (target: any) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    target.prototype[`${target.name}${CONNECTSTRING}`] = prefix
      ? prefix.replace(/^\//g, '') + '/'
      : ''
    Reflect.defineMetadata(MetadataKey.INJECTABLE_WATERMARK, true, target)
    options?.version &&
      Reflect.defineMetadata(MetadataKey.VERSION, options.version, target)
  }
}

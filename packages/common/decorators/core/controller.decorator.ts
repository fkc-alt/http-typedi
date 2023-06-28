import { MetadataKey } from '../../enums'
import { CONNECTSTRING } from '../../helper/constant'

const optionsDefault = {
  version: ''
}

interface ControllerOptions {
  (prefix: string, options: typeof optionsDefault): ClassDecorator
  (prefix: string): ClassDecorator
}

/**
 * @module Controller
 * @param { string } [prefix=''] - The prefix of the request, default is empty
 * @param { typeof optionsDefault } [options] - Optional parameter
 * @auther kaichao.feng
 * @description Request Controller
 */
export const Controller: ControllerOptions = (
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

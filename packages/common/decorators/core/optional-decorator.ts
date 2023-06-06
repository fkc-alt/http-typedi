/* eslint-disable @typescript-eslint/no-unused-vars */
import { MetadataKey } from '../../enums'

/**
 *
 * For example:
 * `@Optional()`
 * @auther kaichao.feng
 * @publicApi
 */
export const Optional = (): MethodDecorator => {
  return function (target, propertyKey, _descriptor) {
    Reflect.defineMetadata(MetadataKey.OPTIONAL, true, target, propertyKey)
  }
}

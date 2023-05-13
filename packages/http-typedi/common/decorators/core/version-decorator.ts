/* eslint-disable @typescript-eslint/no-unused-vars */
import { MetadataKey } from '../../enums'

/**
 *
 * For example:
 * `@Version('1')`
 * @auther kaichao.feng
 * @publicApi
 */
export const Version = (version: string): MethodDecorator => {
  return function (target, propertyKey, _descriptor) {
    Reflect.defineMetadata(MetadataKey.VERSION, version, target, propertyKey)
  }
}

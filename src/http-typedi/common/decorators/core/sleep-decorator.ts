import { MetadataKey } from '../../enums'

/**
 * Request method Decorator.  Sets a sleep timer.
 *
 * For example:
 * `@Sleep(3000)`
 *
 * @param timer number to be used for sleep timer
 * @auther kaichao.feng
 * @publicApi
 */
export const Sleep = (timer = 0) => {
  return function (...args: any) {
    const [target, propertyKey] = args as Parameters<MethodDecorator>
    const metadataArgs: any = [
      MetadataKey.SLEEPTIMER,
      timer,
      target,
      propertyKey
    ].filter(Boolean)
    Reflect.defineMetadata.apply(null, metadataArgs)
  }
}

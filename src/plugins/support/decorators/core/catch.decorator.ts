/* eslint-disable @typescript-eslint/ban-types */
import { MetadataKey } from '../../interface/enums'

/**
 *
 * @param { (error: any) => void } catchCallback
 * @author kaichao.feng
 * @returns { MethodDecorator & ClassDecorator } Decorator
 */
export const Catch = (
  catchCallback: (error: any) => void
): MethodDecorator & ClassDecorator => {
  return function (...args: any) {
    const [target, propertyKey = ''] = args as Parameters<MethodDecorator>
    const metadataArgs: any = [
      MetadataKey.CATCH_METADATA,
      catchCallback,
      target,
      propertyKey
    ].filter(Boolean)
    Reflect.defineMetadata.apply(null, metadataArgs)
  }
}

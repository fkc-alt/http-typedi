/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/ban-types */
import { MetadataKey } from '../../enums'

/**
 * Request method Decorator.  Sets a request header.
 *
 * For example:
 * `@Header('Cache-Control', 'none')`
 *
 * @param name string to be used for header name
 * @param value string to be used for header value
 * @auther kaichao.feng
 * @returns { MethodDecorator } MethodDecorator
 * @publicApi
 */
export const Header = (
  name: string,
  value: string | Function
): MethodDecorator & ClassDecorator => {
  return function (...args: any[]) {
    const [target, propertyKey] = <Parameters<MethodDecorator>>args
    const metadataArgs: any = [
      MetadataKey.REQUEST_METADATA,
      target,
      propertyKey
    ].filter(Boolean)
    const headers: Record<string, any> =
      Reflect.getMetadata.apply(Reflect, metadataArgs) ?? {}
    Object.assign(headers, { [name]: value })
    metadataArgs.splice(1, 0, headers)
    Reflect.defineMetadata.apply(Reflect, metadataArgs)
  }
}

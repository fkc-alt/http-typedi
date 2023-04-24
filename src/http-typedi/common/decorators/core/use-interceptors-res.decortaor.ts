import { InterceptorRes } from '../../core'
import { MetadataKey } from '../../enums'

// eslint-disable-next-line @typescript-eslint/ban-types
export const UseInterceptorsRes = (...interceptors: InterceptorRes[]) => {
  return function (...args: any) {
    const [target, propertyKey] = args as Parameters<MethodDecorator>
    const metadataArgs: any = [
      MetadataKey.INTERCEPTORSRES_METADATA,
      interceptors || [],
      target,
      propertyKey
    ].filter(Boolean)
    Reflect.defineMetadata.apply(null, metadataArgs)
  }
}

import { InterceptorReq } from '../../core'
import { MetadataKey } from '../../interface/enums'

// eslint-disable-next-line @typescript-eslint/ban-types
export const UseInterceptorsReq = (...interceptors: InterceptorReq[]) => {
  return function (...args: any) {
    const [target, propertyKey] = args as Parameters<MethodDecorator>
    const metadataArgs: any = [
      MetadataKey.INTERCEPTORSREQ_METADATA,
      interceptors || [],
      target,
      propertyKey
    ].filter(Boolean)
    Reflect.defineMetadata.apply(null, metadataArgs)
  }
}

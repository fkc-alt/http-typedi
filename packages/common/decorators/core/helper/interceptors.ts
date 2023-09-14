import { InterceptorReq, InterceptorRes } from '../../../../common/core'
import { MetadataKey } from '../../../../common/enums'
import { HttpFactoryMap } from '../../../../common/http-factory-map'

export const factoryPropertyKey: Record<string, string> = {
  [MetadataKey.INTERCEPTORSREQ_METADATA]: 'globalInterceptorsReq',
  [MetadataKey.INTERCEPTORSRES_METADATA]: 'globalInterceptorsRes'
}

export const getInterceptors = (
  target: Object,
  propertyKey: string | symbol,
  metadataPropertyKey: MetadataKey
): Array<InterceptorReq | InterceptorRes> => {
  const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
  return (
    Reflect.getMetadata(metadataPropertyKey, target, propertyKey) ??
    Reflect.getMetadata(metadataPropertyKey, target.constructor) ??
    HttpFactoryMap.get(token)[factoryPropertyKey[metadataPropertyKey]] ??
    []
  )
}

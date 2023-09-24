/* eslint-disable @typescript-eslint/ban-types */
import { InterceptorReq, InterceptorRes } from '../../../core'
import { MetadataKey } from '../../../enums'
import { HttpFactoryMap } from '../../../http-factory-map'

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

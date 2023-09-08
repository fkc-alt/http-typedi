import { MetadataKey } from '../../../../common/enums'
import { HttpFactoryMap } from '../../../../common/http-factory-map'

export const getTimeout = (
  target: Object,
  propertyKey: string | symbol
): number => {
  const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
  return (
    Reflect.getMetadata(MetadataKey.TIMEOUT, target, propertyKey) ??
    Reflect.getMetadata(MetadataKey.TIMEOUT, target.constructor) ??
    HttpFactoryMap.get(token).globalTimeout
  )
}

export const getTimeoutCallback = (
  target: Object,
  propertyKey: string | symbol
): (() => any) => {
  const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
  return (
    Reflect.getMetadata(
      MetadataKey.TIMEOUTCALLBACK_METADATA,
      target,
      propertyKey
    ) ??
    Reflect.getMetadata(
      MetadataKey.TIMEOUTCALLBACK_METADATA,
      target.constructor
    ) ??
    HttpFactoryMap.get(token).globalTimeoutCallback
  )
}

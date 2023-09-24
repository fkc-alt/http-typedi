/* eslint-disable @typescript-eslint/ban-types */
import { MetadataKey } from '../../../enums'
import { HttpFactoryMap } from '../../../http-factory-map'

export const getSleepTimer = (
  target: Object,
  propertyKey: string | symbol
): number => {
  const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
  return (
    Reflect.getMetadata(MetadataKey.SLEEPTIMER, target, propertyKey) ??
    Reflect.getMetadata(MetadataKey.SLEEPTIMER, target.constructor) ??
    HttpFactoryMap.get(token).globalSleepTimer
  )
}

/* eslint-disable @typescript-eslint/ban-types */
import { MetadataKey } from '../../../enums'

export const getVersion = (
  target: Object,
  propertyKey?: string | symbol
): string => {
  const args: any = [MetadataKey.VERSION, target, propertyKey].filter(Boolean)
  return Reflect.getMetadata.apply(null, args) ?? ''
}

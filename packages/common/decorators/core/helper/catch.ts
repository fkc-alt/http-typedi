import { MetadataKey } from '../../../../common/enums'
import { HttpFactoryMap } from '../../../../common/http-factory-map'

export type CatchCallback = (err: any) => void

export const getCatchCallback = (
  target: Object,
  propertyKey: string | symbol
): CatchCallback => {
  const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
  return (
    Reflect.getMetadata(MetadataKey.CATCH_METADATA, target, propertyKey) ??
    Reflect.getMetadata(MetadataKey.CATCH_METADATA, target.constructor) ??
    HttpFactoryMap.get(token).globalCatchCallback
  )
}

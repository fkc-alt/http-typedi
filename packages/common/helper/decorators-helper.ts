import { MetadataKey } from '../enums'

export const createDecoratorBind = (
  key: MetadataKey,
  params: any
): MethodDecorator & ClassDecorator => {
  return function (...args: any) {
    const [target, propertyKey = ''] = args as Parameters<MethodDecorator>
    const _propertyKey = [propertyKey].filter(Boolean)
    const metadataArgs: any = [key, params, target, ..._propertyKey]
    Reflect.defineMetadata.apply(null, metadataArgs)
  }
}

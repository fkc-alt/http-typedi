import { MetadataKey } from '../enums'

export const createDecoratorBind = (
  key: MetadataKey,
  params: any
): MethodDecorator & ClassDecorator => {
  return function (...args: any) {
    const [target, propertyKey = ''] = args as Parameters<MethodDecorator>
    const metadataArgs: any = [key, params, target, propertyKey].filter(Boolean)
    Reflect.defineMetadata.apply(null, metadataArgs)
  }
}

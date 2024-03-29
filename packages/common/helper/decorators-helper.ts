import { MetadataKey } from '../enums'

export const createDecoratorBind = (
  key: MetadataKey,
  params: any
): MethodDecorator & ClassDecorator => {
  return function (...args: any) {
    const [target, propertyKey = ''] = <Parameters<MethodDecorator>>args
    const _propertyKey = [propertyKey].filter(Boolean)
    const metadataArgs: any = [key, params, target, ..._propertyKey]
    // eslint-disable-next-line prefer-spread
    Reflect.defineMetadata.apply(Reflect, metadataArgs)
  }
}

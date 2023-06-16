/* eslint-disable new-cap */
import { MetadataKey, ModuleMetadata } from '../../enums'
import { isString } from '../../helper'
import { Constructor } from '../../interfaces/core'

const registerDeepClass = (
  providers: Array<Constructor<any>>
): Array<Constructor<any>> => {
  try {
    return (
      providers?.map((provider: any) => {
        const isInject = Reflect.getMetadata(
          MetadataKey.INJECTABLE_WATERMARK,
          provider
        )
        if (!isInject)
          throw new Error(`Please use @Injectable() ${provider.name as string}`)
        const deepNeedProviders = Reflect.getMetadata(
          MetadataKey.PARAMTYPES_METADATA,
          provider
        )
        return !deepNeedProviders
          ? new provider()
          : new provider(...registerDeepClass(deepNeedProviders))
      }) ?? []
    )
  } catch (error) {
    console.log(error)
    return []
  }
}

export const Injection = (token?: string) => {
  return function (target: any, propertyName: string) {
    const propertyValue = Reflect.getMetadata(
      MetadataKey.TYPE_METADATA,
      target,
      propertyName
    )
    const injections: Array<{
      propertyName: string
      provide: Constructor<any>
    }> = Reflect.getMetadata(MetadataKey.INJECTIONS, target.constructor) || []
    if (isString(token)) {
      setTimeout(() => {
        const propertyValue = (
          Reflect.getMetadata(
            ModuleMetadata.PROVIDERS,
            target.constructor
          ) as any[]
        )?.filter(provider => provider.provide === token)[0]
        Reflect.defineMetadata(
          MetadataKey.INJECTIONS,
          [
            ...injections,
            {
              provide: propertyValue?.useFactory?.() ?? propertyValue?.useValue,
              propertyName
            }
          ],
          target.constructor
        )
        // target[propertyName] =
        //   propertyValue?.useFactory?.() ?? propertyValue?.useValue
      }, 0)
    } else {
      Reflect.defineMetadata(
        MetadataKey.INJECTIONS,
        [
          ...injections,
          {
            provide: propertyValue && registerDeepClass([propertyValue])[0],
            propertyName
          }
        ],
        target.constructor
      )
      // target[propertyName] =
      //   propertyValue && registerDeepClass([propertyValue])[0]
    }
  }
}

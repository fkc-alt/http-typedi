/* eslint-disable new-cap */
import { MetadataKey, ModuleMetadata } from '../../enums'
import { isString } from '../../helper'
import { Core } from '../../interface/core'

const registerDeepClass = (
  providers: Array<Core.Constructor<any>>
): Array<Core.Constructor<any>> => {
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

export const Injection = (provide?: string) => {
  return function (target: any, propertyName: string) {
    const propertyValue = Reflect.getMetadata(
      MetadataKey.TYPE_METADATA,
      target,
      propertyName
    )
    if (isString(provide)) {
      setTimeout(() => {
        const propertyValue = (
          Reflect.getMetadata(
            ModuleMetadata.PROVIDERS,
            target.constructor
          ) as any[]
        )?.filter(provider => provider.provide === provide)[0]
        target[propertyName] =
          propertyValue?.useFactory?.() ?? propertyValue?.useValue
      }, 0)
    } else {
      target[propertyName] =
        propertyValue && registerDeepClass([propertyValue])[0]
    }
  }
}

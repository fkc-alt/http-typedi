/* eslint-disable @typescript-eslint/ban-types */
import { ExecutionContext } from '../create-route-param-decorator'
import { CanActivate } from '../interfaces/can-activate.interface'
import { MetadataKey } from '../../../enums'
import { HttpFactoryMap } from '../../../http-factory-map'
import { Type } from '../../../interfaces/type.interface'
import { isFunction } from '../../../helper'
import { GuardContext } from '../../../interfaces/middleware/guard-context'
import { Constructor } from '../../../interfaces/core.interface'

export const getGuards = (
  target: Object,
  propertyKey: string | symbol
): (CanActivate | Function)[] => {
  const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
  return (
    Reflect.getMetadata(MetadataKey.GUARDS, target, propertyKey) ??
    Reflect.getMetadata(MetadataKey.GUARDS, target.constructor) ??
    HttpFactoryMap.get(token).globalGuard ??
    []
  )
}

const registerDeepClass = (
  providers: Array<Constructor<any>>
): Array<Constructor<any>> => {
  return (
    providers?.map((provider: any) => {
      const childrenProviders = Reflect.getMetadata(
        MetadataKey.PARAMTYPES_METADATA,
        provider
      )
      const isFactoryProvide = isFunction(provider)
      let instance
      if (!childrenProviders) {
        instance = isFactoryProvide ? new provider() : provider
      } else {
        instance = new provider(...registerDeepClass(childrenProviders))
      }
      registerPropertes(provider, instance)
      return instance
    }) ?? []
  )
}

/**
 * @param { Constructor<any> } target
 * @param { any } instance
 * @description Object register properties
 */
const registerPropertes = (target: Constructor<any>, instance: any) => {
  const properties: Array<{
    propertyName: string
    provide: Constructor<any>
  }> = Reflect.getMetadata(MetadataKey.INJECTIONS, target)
  properties?.forEach(
    ({ propertyName, provide }) => (instance[propertyName] = provide)
  )
}

export const transformGuards = (
  guards: Array<CanActivate | Function>
): Array<CanActivate | Function> => {
  return guards.map(guard => {
    const currentProviders = Reflect.getMetadata(
      MetadataKey.PARAMTYPES_METADATA,
      guard
    )
    return isFunction(guard)
      ? new (<CanActivate & Type>guard)(...registerDeepClass(currentProviders))
      : guard
  })
}

export const createGuardsResponseContext = (
  dispatchRequest: Function,
  dispatchResponse: Function
) => {
  const guardContext: GuardContext = {
    switchToHttp() {
      return {
        getRequest() {
          return dispatchRequest()
        },
        getResponse() {
          return dispatchResponse()
        }
      }
    },
    body: {},
    params: {},
    query: {},
    getClass: function <T = any>(): Type<T> {
      throw new Error('Function not implemented.')
    },
    getHandler: function (): Function {
      throw new Error('Function not implemented.')
    }
  }
  return guardContext
}

export async function guardsSelfCall<
  T extends (PromiseConstructor extends new (...args: infer R) => void
    ? R
    : never)[0] extends (Resolver: infer S, Rejecter: infer R) => void
    ? (resolver: (value: void | PromiseLike<void>) => void, rejecter: R) => void
    : never,
  U extends ReturnType<typeof transformGuards> extends Array<infer R>
    ? R
    : never
>(
  this: CanActivate | Function,
  guards: U[],
  step: number,
  guardReqProxy: Object,
  guardResProxy: ExecutionContext,
  resolver: T extends (Resolver: infer R, Rejecter: infer P) => void
    ? R
    : never,
  rejecter: T extends (Resolver: infer P, Rejecter: infer R) => void ? R : never
) {
  const callback = () =>
    guardsSelfCall.call(
      guards[step + 1],
      guards,
      step + 1,
      guardReqProxy,
      guardResProxy,
      resolver,
      rejecter
    )
  try {
    if (this) {
      if (
        !Reflect.getMetadata(MetadataKey.INJECTABLE_WATERMARK, this.constructor)
      ) {
        console.warn(
          `Http-Typedi: Please use @Injectable() ${this.constructor.name}`
        )
        callback()
        return
      }
      const validateSync = await (<CanActivate>this).canActivate(guardResProxy)
      validateSync
        ? callback()
        : rejecter({
            statusCode: 403,
            message: 'Forbidden resource',
            error: 'Forbidden'
          })
      return
    }
    resolver()
  } catch (error) {
    rejecter(error)
  }
}

export const GuardsPromise = (
  self: typeof guardsSelfCall,
  ...args: Parameters<typeof guardsSelfCall> extends [
    ...Rest: infer R,
    Resolver: infer E,
    Rejecter: infer T
  ]
    ? R
    : never
) => {
  return new Promise<void>((resolver, rejecter) => {
    self.call(args[0][args[1]], ...args, resolver, rejecter)
  })
}

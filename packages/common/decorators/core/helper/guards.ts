/* eslint-disable @typescript-eslint/ban-types */
import { ExecutionContext } from '../create-route-param-decorator'
import { CanActivate } from '../interfaces/can-activate.interface'
import { MetadataKey } from '../../../enums'
import { HttpFactoryMap } from '../../../http-factory-map'
import { Type } from '../../../interfaces/type.interface'
import { isFunction } from '../../../helper'
import { GuardContext } from '../../../interfaces/middleware/guard-context'
import { Reflector } from '../../../providers'

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

export const transformGuards = (
  guards: Array<CanActivate | Function>,
  reflector: Reflector
): Array<CanActivate | Function> => {
  return guards.map(guard =>
    isFunction(guard) ? new (<CanActivate & Type>guard)(reflector) : guard
  )
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
            error: 'canActivate'
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

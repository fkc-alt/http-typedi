/* eslint-disable @typescript-eslint/ban-types */
import { MiddlewareResponseContext } from '@/common/interfaces'
import { MetadataKey } from '../../../enums'
import { HttpFactoryMap } from '../../../http-factory-map'
import { CanActivate } from '../interfaces/can-activate.interface'
import { Type } from '@/common/interfaces/type.interface'
import { ExecutionContext } from '../create-route-param-decorator'

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
  guards: Array<CanActivate | Function>
): Array<CanActivate | Function> => {
  return guards.map(guard => new (<CanActivate & Type>guard)())
}

export const createGuardsResponseContext = (
  dispatchRequest: Function,
  dispatchResponse: Function
) => {
  const middlewareResponseContext: MiddlewareResponseContext = {
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
    query: {}
  }
  return middlewareResponseContext
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
  try {
    if (this) {
      const validateSync = await (<CanActivate>this).canActivate(guardResProxy)
      validateSync
        ? guardsSelfCall.call(
            guards[step + 1],
            guards,
            step + 1,
            guardReqProxy,
            guardResProxy,
            resolver,
            rejecter
          )
        : rejecter({
            error: 'canActivate'
          })
      console.log(validateSync, 'canActivate')
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

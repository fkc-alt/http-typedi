/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { RequestConfig } from '../../../providers'
import { MetadataKey } from '../../../enums'
import { HttpFactoryMap } from '../../../http-factory-map'
import {
  Middleware,
  MiddlewareConfigProxy,
  MiddlewareResponseContext,
  RouteInfo
} from '../../../interfaces'
import { Type } from '../../../interfaces/type.interface'

export const getMiddlewares = (target: Object): Array<Middleware & Type> => {
  const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
  return HttpFactoryMap.get(token).globalMiddleware ?? []
}

export const transformMiddleware = (middlewares: Array<Middleware & Type>) => {
  return middlewares.map(Middleware => {
    const instance: Middleware<any, any> = new Middleware()
    return {
      instance,
      config: {
        exclude: <
          Parameters<
            MiddlewareConfigProxy extends { exclude: infer E } ? E : never
          >
        >Reflect.getMetadata(
          MetadataKey.MIDDLEWARECONFIGPROXYEXCLUDE_METADATA,
          instance.constructor
        ),
        forRoutes: <
          Parameters<
            MiddlewareConfigProxy extends { forRoutes: infer E } ? E : never
          >
        >Reflect.getMetadata(
          MetadataKey.MIDDLEWARECONFIGPROXYFORROUTES_METADATA,
          instance.constructor
        )
      }
    }
  })
}

export const createMiddlewareProxy = <T extends Object>(target: T): T => {
  return new Proxy(target, {
    get(target, property, _receiver) {
      return Reflect.get(target, property)
    },
    set(target, property, newValue, _receiver) {
      return Reflect.set(target, property, newValue)
    }
  })
}

export const createMiddlewareResponseContext = (dispatchRequest: Function) => {
  const middlewareResponseContext: MiddlewareResponseContext = {
    switchToHttp() {
      return {
        getRequest() {
          return dispatchRequest()
        }
      }
    },
    body: {},
    params: {},
    query: {}
  }
  return middlewareResponseContext
}

export function middlewareSelfCall<
  T extends (PromiseConstructor extends new (...args: infer R) => void
    ? R
    : never)[0] extends (Resolver: infer S, Rejecter: infer R) => void
    ? (resolver: (value: void | PromiseLike<void>) => void, rejecter: R) => void
    : never,
  U extends ReturnType<typeof transformMiddleware> extends Array<infer R>
    ? R
    : never
>(
  this: U,
  middlewares: U[],
  step: number,
  middlewareReqProxy: Object,
  middlewareResProxy: Object,
  resolver: T extends (Resolver: infer R, Rejecter: infer P) => void
    ? R
    : never,
  rejecter: T extends (Resolver: infer P, Rejecter: infer R) => void ? R : never
) {
  try {
    if (this) {
      this.instance?.use(middlewareReqProxy, middlewareResProxy, () =>
        middlewareSelfCall.call(
          middlewares[step + 1],
          middlewares,
          step + 1,
          middlewareReqProxy,
          middlewareResProxy,
          resolver,
          rejecter
        )
      )
      return
    }
    resolver()
  } catch (error) {
    rejecter(error)
  }
}

export const switchExcludesRoute = (
  routes: (string | RouteInfo)[],
  reuqestConfig: RequestConfig
): (string | RouteInfo)[] => {
  return routes.filter(route => {
    if (typeof route === 'string') {
      return reuqestConfig.url!.indexOf(route) === -1
    }
    return (
      reuqestConfig.url!.indexOf((<RouteInfo>route).path) === -1 &&
      (<RouteInfo>route).method.toUpperCase() === reuqestConfig.method
    )
  })
}

export const MiddlewarePromise = (
  self: typeof middlewareSelfCall,
  ...args: Parameters<typeof middlewareSelfCall> extends [
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

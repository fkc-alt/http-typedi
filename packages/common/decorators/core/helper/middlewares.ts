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
    const instance = new Middleware()
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

export const middlewareSelfCall = (
  middlewares: { instance: Middleware }[],
  step: number,
  middlewareReqProxy: Object,
  middlewareResProxy: any,
  resolver: (value: void | PromiseLike<void>) => void,
  rejecter: (reason?: any) => void
) => {
  try {
    if (middlewares[step]) {
      middlewares[step].instance.use(
        middlewareReqProxy,
        middlewareResProxy,
        () =>
          middlewareSelfCall(
            middlewares,
            step + 1,
            middlewareReqProxy,
            middlewareResProxy,
            resolver,
            rejecter
          )
      )
    } else {
      resolver()
    }
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
  selfFn: typeof middlewareSelfCall,
  ...args: Parameters<typeof middlewareSelfCall> extends [
    ...Rest: infer R,
    Resolver: infer E,
    Rejecter: infer T
  ]
    ? R
    : never
) => {
  return new Promise<void>((resolver, rejecter) => {
    selfFn.call(null, ...args, resolver, rejecter)
  })
}

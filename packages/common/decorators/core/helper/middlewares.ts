import { MetadataKey } from '../../../../common/enums'
import { HttpFactoryMap } from '../../../../common/http-factory-map'
import {
  Middleware,
  MiddlewareResponseContext
} from '../../../../common/interfaces'
import { Type } from '../../../../common/interfaces/type.interface'

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
        exclude: Reflect.getMetadata(
          MetadataKey.MIDDLEWARECONFIGPROXYEXCLUDE_METADATA,
          instance.constructor
        ),
        forRoutes: Reflect.getMetadata(
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

// eslint-disable-next-line @typescript-eslint/ban-types
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
  middlewareResProxy: any
) => {
  middlewares[step] &&
    middlewares[step].instance.use(middlewareReqProxy, middlewareResProxy, () =>
      middlewareSelfCall(
        middlewares,
        step + 1,
        middlewareReqProxy,
        middlewareResProxy
      )
    )
}

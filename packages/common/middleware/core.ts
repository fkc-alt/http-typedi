import { MetadataKey } from '../../common/enums'
import { Middleware, RouteInfo } from '../../common/interfaces/middleware'
import { Type } from '../../common/interfaces/type.interface'
import { HttpFactoryMap } from '../http-factory-map'
import { HttpFactory } from '../core'

const middlewareConfigProxy = {
  exclude(...routes: (string | RouteInfo)[]) {
    middlewareConfigProxy.execution.apply(this, [
      routes,
      MetadataKey.MIDDLEWARECONFIGPROXYEXCLUDE_METADATA
    ])
    return this
  },
  forRoutes(...routes: (string | Type<any> | RouteInfo)[]) {
    middlewareConfigProxy.execution.apply(this, [
      routes,
      MetadataKey.MIDDLEWARECONFIGPROXYFORROUTES_METADATA
    ])
    return StaticMiddlewareConsumer.apply
  },
  execution<T extends (string | Type<any> | RouteInfo)[]>(
    routes: T,
    metadataKey: MetadataKey
  ) {
    /**
     * @class Middleware
     * @description Object.getPrototypeOf(this).__proto__.constructor  === this.__proto__.__proto__.constructor
     */
    const MiddlewareProxy =
      Object.getPrototypeOf?.(this) ??
      (<Middleware & { __proto__: any }>(<unknown>this)).__proto__
    const originalRoutes: T =
      Reflect.getMetadata(metadataKey, MiddlewareProxy.__proto__.constructor) ??
      []
    Reflect.defineMetadata(
      metadataKey,
      [...originalRoutes, ...routes],
      MiddlewareProxy.__proto__.constructor
    )
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { execution, ...MiddlewareConfigProxy } = middlewareConfigProxy

export class StaticMiddlewareConsumer {
  static __proto__: any
  /**
   * @description this is the current middleware
   * @returns { typeof MiddlewareConfigProxy } middlewareConfigProxy
   */
  static apply() {
    const IOC: HttpFactory = HttpFactoryMap.get(this.__proto__.token)
    IOC.useMiddleware(<Middleware>(<unknown>this))
    return new (class MiddlewareProxy extends this {
      constructor() {
        super()
        Object.assign(this, MiddlewareConfigProxy)
      }
    })()
  }
}

import { MetadataKey } from '../../common/enums'
import { Middleware, RouteInfo } from '../../common/interfaces/middleware'
import { Type } from '../../common/interfaces/type.interface'
import { HttpFactory } from '../core'
import { HttpFactoryMap } from '../http-factory-map'

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
    const originalRoutes =
      Reflect.getMetadata(metadataKey, this.constructor) ?? []
    Reflect.defineMetadata(
      metadataKey,
      [...originalRoutes, ...routes],
      this.constructor
    )
    console.log(
      [...originalRoutes, ...routes],
      'originalRoutes',
      this,
      this.constructor
    )
  }
}

export class StaticMiddlewareConsumer {
  static __proto__: any
  /**
   * @description this is the current middleware
   * @returns { MiddlewareConfigProxy } middlewareConfigProxy
   */
  static apply() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { execution, ...MiddlewareConfigProxy } = middlewareConfigProxy
    const IOC: HttpFactory = HttpFactoryMap.get(this.__proto__.token)
    IOC.useMiddleware(<Middleware>(<unknown>this))
    return Object.assign(new this(), MiddlewareConfigProxy)
  }
}

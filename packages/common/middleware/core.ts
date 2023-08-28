import { MetadataKey } from '../../common/enums'
import { RouteInfo } from '../../common/interfaces/middleware'
import { Type } from '../../common/interfaces/type.interface'

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
      'exclude',
      this,
      this.constructor
    )
  }
}

export class StaticMiddlewareConsumer {
  /**
   * @returns { MiddlewareConfigProxy } middlewareConfigProxy
   */
  static apply() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { execution, ...MiddlewareConfigProxy } = middlewareConfigProxy
    return Object.assign(new this(), MiddlewareConfigProxy)
  }
}

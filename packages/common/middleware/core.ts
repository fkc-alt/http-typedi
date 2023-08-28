import { MetadataKey } from '../../common/enums'
import {
  MiddlewareConfigProxy,
  RouteInfo
} from '../../common/interfaces/middleware'
import { Type } from '../../common/interfaces/type.interface'

const middlewareConfigProxy: MiddlewareConfigProxy = {
  exclude(...routes: (string | RouteInfo)[]) {
    const excluderoutes: (string | RouteInfo)[] =
      Reflect.getMetadata(
        MetadataKey.MIDDLEWARECONFIGPROXYEXCLUDE_METADATA,
        this.constructor
      ) ?? []
    Reflect.defineMetadata(
      MetadataKey.MIDDLEWARECONFIGPROXYEXCLUDE_METADATA,
      [...excluderoutes, ...routes],
      this.constructor
    )
    console.log(
      [...excluderoutes, ...routes],
      'exclude',
      this,
      this.constructor
    )
    return this
  },
  forRoutes(...routes: (string | Type<any> | RouteInfo)[]) {
    const includeRoutes: (string | Type<any> | RouteInfo)[] =
      Reflect.getMetadata(
        MetadataKey.MIDDLEWARECONFIGPROXYFORROUTES_METADATA,
        this.constructor
      ) ?? []
    Reflect.defineMetadata(
      MetadataKey.MIDDLEWARECONFIGPROXYFORROUTES_METADATA,
      [...includeRoutes, ...routes],
      this.constructor
    )
    return StaticMiddlewareConsumer.apply
  }
}

export class StaticMiddlewareConsumer {
  /**
   * @returns { MiddlewareConfigProxy } middlewareConfigProxy
   */
  static apply() {
    return Object.assign(new this(), middlewareConfigProxy)
  }
}

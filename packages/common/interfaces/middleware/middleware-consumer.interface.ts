import { Type } from '../type.interface'
import { MiddlewareConfigProxy } from './middleware-config-proxy.interface'

export interface MiddlewareConsumer {
  /**
   * @param {...(Type | Function)} middleware middleware class/function or array of classes/functions
   * to be attached to the passed routes.
   *
   * @returns {MiddlewareConfigProxy}
   */
  apply(...middleware: (Type<any> | Function)[]): MiddlewareConfigProxy
}

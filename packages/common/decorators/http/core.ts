/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { ValidationError } from 'class-validator'
import { Constructor, Middleware, RouteInfo } from '../../core'
import { RequestConfig } from '../../providers'
import { HttpFactoryMap } from '../../http-factory-map'
import { MetaDataTypes, MetadataKey, RequestMethod } from '../../enums'
import { isFunction } from '../../helper/utils'
import { CONNECTSTRING } from '../../helper/constant'
import {
  getVersion,
  getInterceptors,
  getMiddlewares,
  getCatchCallback,
  getDataTransferObject,
  getSleepTimer,
  getTimeout,
  getTimeoutCallback,
  DTOValidate,
  getErrorMessage,
  swtichMetadataTypeRelationValues,
  transformMiddleware,
  createMiddlewareProxy,
  middlewareSelfCall,
  createMiddlewareResponseContext,
  switchExcludesRoute,
  MiddlewarePromise
} from '../core/helper'
import {
  OverrideReqEffect,
  getInjectValues,
  getMetadataType
} from './route-params.decorator'

/**
 * @module RequestFactory
 * @method createRequestMapping
 * @param { string } path
 * @param { RequestMethod } method
 * @param { string | ((validationError: ValidationError[]) => any) } [message = void 0] message
 * @auther kaichao.feng
 * @returns { MethodDecorator } MethodDecorator
 * @description Request Factory
 */
export const createRequestMapping = (
  path: string,
  method: RequestMethod,
  message?: string | ((validationError: ValidationError[]) => any)
): MethodDecorator => {
  return function (target, key, descriptor: PropertyDescriptor) {
    const originalMethod: (params: any) => any = descriptor.value
    const dataTransferObject: Array<Constructor<any>> = getDataTransferObject(
      target,
      key
    )
    descriptor.value = async function (params: Record<string, any>) {
      const boundMethod = originalMethod.bind(this)
      const result = await requestContext.call(
        this,
        target,
        key,
        transformConfig(path, method, target, key, params),
        boundMethod
      )
      const errors: ValidationError[] = getErrorMessage(
        dataTransferObject,
        target,
        params
      )
      DTOValidate(errors, message)
      return result
    }
    return descriptor
  }
}

const transformConfig = (
  path: string,
  method: RequestMethod,
  target: Object,
  key: string | symbol,
  params: Record<string, any>
): Record<string, any> => {
  const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
  const timeout = getTimeout(target, key)
  const timeoutCallback = getTimeoutCallback(target, key)
  const isGet = [RequestMethod.GET, RequestMethod.get].includes(method)
  const globalPrefix: string = HttpFactoryMap.get(token).globalPrefix
  const controllerPrefix = (<any>target)[
    `${target.constructor.name}${CONNECTSTRING}`
  ]
  const requestPath: string = path.replace(/^\//g, '')
  const _controllerVersion = getVersion(target.constructor).replace(/^\//g, '')
  const controllerVersion = _controllerVersion ? `v${_controllerVersion}/` : ''
  const _routeVersion = getVersion(target, key).replace(/^\//g, '')
  const routeVersion = _routeVersion ? `v${_routeVersion}/` : ''
  const requestURL = `${globalPrefix}${controllerVersion}${controllerPrefix}${routeVersion}${requestPath}`
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prefixUrl, ...paramList] = requestURL.split('/:')
  const currentTargetHeaders: Record<string, any> =
    Reflect.getMetadata(MetadataKey.REQUEST_METADATA, target.constructor) ?? {}
  const currentHeaders: Record<string, any> =
    Reflect.getMetadata(MetadataKey.REQUEST_METADATA, target, key) ?? {}
  Object.assign(currentTargetHeaders, currentHeaders)
  const headers = Object.keys(currentTargetHeaders).reduce((prev, next) => {
    return {
      ...prev,
      [next]: isFunction(currentTargetHeaders[next])
        ? currentTargetHeaders[next]()
        : currentTargetHeaders[next]
    }
  }, {})
  const data = {
    [isGet ? 'params' : 'data']: params
  }
  const url = [
    RequestMethod.GET,
    RequestMethod.DELETE,
    RequestMethod.get,
    RequestMethod.delete
  ].includes(method)
    ? paramList
        .reduce(
          (prev, next) => prev.replace(new RegExp(next), params[next]),
          requestURL
        )
        .replace(/:/g, '')
    : requestURL
  const reqJson: Record<string, any> = {
    url,
    method,
    ...(paramList.length ? {} : data),
    headers
  }
  timeout && Object.assign(reqJson, { timeout, timeoutCallback })
  return reqJson
}

async function requestContext(
  this: any,
  target: Object,
  propertyKey: string | symbol,
  param: RequestConfig,
  fn: (params: any) => any
): Promise<any> {
  try {
    const middlewares = transformMiddleware(getMiddlewares(target))
    const interceptorsReq = getInterceptors(
      target,
      propertyKey,
      MetadataKey.INTERCEPTORSREQ_METADATA
    )
    const swtichHTTPMiddlewares = middlewares.filter(middleware => {
      if (middleware.config.forRoutes.length) {
        const shouldRoutes = middleware.config.forRoutes.filter(route => {
          if (typeof route === 'string') {
            return param.url!.indexOf(route) !== -1
          }
          return (
            param.url!.indexOf((<RouteInfo>route).path) !== -1 &&
            (<RouteInfo>route).method.toUpperCase() !== param.method
          )
        })
        if (shouldRoutes.length) {
          return switchExcludesRoute(middleware.config.exclude, param).length
        }
        return false
      }
      return switchExcludesRoute(middleware.config.exclude, param).length
    })
    const interceptorsRes = getInterceptors(
      target,
      propertyKey,
      MetadataKey.INTERCEPTORSRES_METADATA
    )
    const sleepTimer = getSleepTimer(target, propertyKey)
    const token = Reflect.getMetadata(MetadataKey.TOKEN, target.constructor)
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          let result: any = <unknown>void 0
          const values = getInjectValues(target, <string>propertyKey)
          const metaDataType =
            getMetadataType(target, <string>propertyKey) ||
            MetaDataTypes.REQUEST
          const middlewareRequestProxy = createMiddlewareProxy(param)
          const middlewareResponseProxy = createMiddlewareProxy(
            createMiddlewareResponseContext(
              async () =>
                await fn.apply<any, RequestConfig[], any>(this, [param])
            )
          )
          await MiddlewarePromise(
            middlewareSelfCall,
            <Middleware & { instance: Middleware }[]>(
              (<unknown>swtichHTTPMiddlewares)
            ),
            0,
            middlewareRequestProxy,
            middlewareResponseProxy
          )
          const _interceptorsReqValue: RequestConfig = interceptorsReq.reduce(
            (prev: any, next) => next(prev),
            param
          )
          const _param = swtichMetadataTypeRelationValues(
            _interceptorsReqValue,
            metaDataType,
            middlewareResponseProxy
          )
          const requestConfigs: RequestConfig[] = values.length
            ? OverrideReqEffect(values, [_param])
            : [_param]
          result = await fn.apply<any, RequestConfig[], any>(
            this,
            requestConfigs
          )
          console.log(result, 'result')
          HttpFactoryMap.get(token)?.logger?.log?.(requestConfigs[0])
          // eslint-disable-next-line @typescript-eslint/return-await
          const response = interceptorsRes.reduce(
            (prev, next) => next(prev),
            result
          )
          resolve(response)
        } catch (error) {
          const catchCallback = getCatchCallback(target, propertyKey)
          HttpFactoryMap.get(token)?.logger?.error?.(error)
          catchCallback?.(error)
          reject(error)
        }
      }, sleepTimer)
    })
  } catch (error) {
    const catchCallback = getCatchCallback(target, propertyKey)
    catchCallback?.(error)
    return await Promise.reject(error)
  }
}

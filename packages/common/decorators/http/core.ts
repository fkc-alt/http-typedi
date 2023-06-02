/* eslint-disable @typescript-eslint/ban-types */
import { plainToInstance } from 'class-transformer'
import { ValidationError, validateSync } from 'class-validator'
import { InterceptorReq, InterceptorRes, HttpFactory, Core } from '../../core'
import { MetaDataTypes, MetadataKey, Method } from '../../enums'
import { flattenErrorList } from '../../helper/param-error'
import { isFunction } from '../../helper/utils'
import { CONNECTSTRING } from '../../helper/constant'
import {
  OverrideReqEffect,
  getInjectValues,
  getMetadataType
} from './route-params.decorator'

export type CatchCallback = (err: any) => void

export const factoryPropertyKey: Record<string, string> = {
  [MetadataKey.INTERCEPTORSREQ_METADATA]: 'globalInterceptorsReq',
  [MetadataKey.INTERCEPTORSRES_METADATA]: 'globalInterceptorsRes'
}

const swtichMetadataTypeRelationValues = (
  Req: Core.RequestConfig,
  metadataType: MetaDataTypes
) => {
  switch (metadataType) {
    case MetaDataTypes.REQUEST:
      return Req
      break
    case MetaDataTypes.HEADERS:
      return Req.headers
      break
    case MetaDataTypes.BODY:
      return Req.data
      break
    case MetaDataTypes.PARAM:
      return Req.params
      break
    default:
      break
  }
}

/**
 * @module RequestFactory
 * @method RequestMapping
 * @param { string }
 * @auther kaichao.feng
 * @returns { MethodDecorator } MethodDecorator
 * @description Request Factory
 */
export const RequestMapping = (
  path: string,
  method: Method,
  message?: string | ((validationError: ValidationError[]) => any)
): MethodDecorator => {
  return function (target, key, descriptor: PropertyDescriptor) {
    const originalMethod: (params: any) => any = descriptor.value
    const dataTransferObject: Array<Core.Constructor<any>> =
      getDataTransferObject(target, key)
    descriptor.value = async function (params: Record<string, any>) {
      const boundMethod = originalMethod.bind(this)
      const result = await handlerResult.call(
        this,
        target,
        key,
        handelParam(path, method, target, key, params),
        boundMethod
      )
      const errors: ValidationError[] = getErrorMessage(
        dataTransferObject,
        target,
        params
      )
      callHander(errors, message)
      return result
    }
    return descriptor
  }
}

export const getVersion = (
  target: Object,
  propertyKey?: string | symbol
): string => {
  const args: any = [MetadataKey.VERSION, target, propertyKey].filter(Boolean)
  return Reflect.getMetadata.apply(null, args) ?? ''
}

export const getInterceptors = (
  target: Object,
  propertyKey: string | symbol,
  metadataPropertyKey: MetadataKey
): Array<InterceptorReq | InterceptorRes> => {
  return (
    Reflect.getMetadata(metadataPropertyKey, target, propertyKey) ??
    Reflect.getMetadata(metadataPropertyKey, target.constructor) ??
    (HttpFactory as any)[factoryPropertyKey[metadataPropertyKey]] ??
    []
  )
}

export const getCatchCallback = (
  target: Object,
  propertyKey: string | symbol
): CatchCallback => {
  return (
    Reflect.getMetadata(MetadataKey.CATCH_METADATA, target, propertyKey) ??
    Reflect.getMetadata(MetadataKey.CATCH_METADATA, target.constructor) ??
    (HttpFactory as any).globalCatchCallback
  )
}

export const getDataTransferObject = (
  target: Object,
  propertyKey: string | symbol
): Core.Constructor[] => {
  return (
    Reflect.getMetadata(
      MetadataKey.PARAMTYPES_METADATA,
      target,
      propertyKey
    )?.filter((target: any) => target.name !== 'Object') ?? []
  )
}

const getSleepTimer = (
  target: Object,
  propertyKey: string | symbol
): number => {
  return (
    Reflect.getMetadata(MetadataKey.SLEEPTIMER, target, propertyKey) ??
    Reflect.getMetadata(MetadataKey.SLEEPTIMER, target.constructor) ??
    (HttpFactory as any).globalSleepTimer
  )
}

const getTimeout = (target: Object, propertyKey: string | symbol): number => {
  return (
    Reflect.getMetadata(MetadataKey.TIMEOUT, target, propertyKey) ??
    Reflect.getMetadata(MetadataKey.TIMEOUT, target.constructor) ??
    (HttpFactory as any).globalTimeout
  )
}

const getTimeoutCallback = (
  target: Object,
  propertyKey: string | symbol
): (() => any) => {
  return (
    Reflect.getMetadata(
      MetadataKey.TIMEOUTCALLBACK_METADATA,
      target,
      propertyKey
    ) ??
    Reflect.getMetadata(
      MetadataKey.TIMEOUTCALLBACK_METADATA,
      target.constructor
    ) ??
    (HttpFactory as any).globalTimeoutCallback
  )
}

export async function handlerResult(
  this: any,
  target: Object,
  propertyKey: string | symbol,
  param: Record<string, any>,
  fn: (params: any) => any
): Promise<any> {
  try {
    const interceptorsReq = getInterceptors(
      target,
      propertyKey,
      MetadataKey.INTERCEPTORSREQ_METADATA
    )
    const interceptorsRes = getInterceptors(
      target,
      propertyKey,
      MetadataKey.INTERCEPTORSRES_METADATA
    )
    const sleepTimer = getSleepTimer(target, propertyKey)
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          let result: Record<string, any> = <Record<string, any>>(
            (<unknown>void 0)
          )
          const values = getInjectValues(target, <string>propertyKey)
          const metaDataType =
            getMetadataType(target, <string>propertyKey) ||
            MetaDataTypes.REQUEST
          const _param = swtichMetadataTypeRelationValues(
            interceptorsReq.reduce((prev, next) => next(prev), param),
            metaDataType
          )
          console.log(_param, '_param')
          const injectValue: any = values.length
            ? OverrideReqEffect(values, [_param])
            : [_param]
          result = await fn.apply(this, injectValue)
          // eslint-disable-next-line @typescript-eslint/return-await
          const response = interceptorsRes.reduce(
            (prev, next) => next(prev),
            result
          )
          const timeout = getTimeout(target, propertyKey)
          if (timeout) {
            setTimeout(() => {
              if (!result) {
                getTimeoutCallback(target, propertyKey)?.()
                reject({
                  code: 'ECONNABORTED',
                  data: null,
                  msg: 'timeout'
                })
              }
            }, timeout)
          } else {
            resolve(response)
          }
        } catch (error) {
          const catchCallback = getCatchCallback(target, propertyKey)
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

export const handelParam = (
  path: string,
  method: Method,
  target: Object,
  key: string | symbol,
  params: Record<string, any>
): Record<string, any> => {
  const hasGet = [Method.GET, Method.get].includes(method)
  const globalPrefix: string = (HttpFactory as any).globalPrefix
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
    [hasGet ? 'params' : 'data']: params
  }
  const url = paramList
    .reduce(
      (prev, next) => prev.replace(new RegExp(next), params[next]),
      requestURL
    )
    .replace(/:/g, '')
  const reqJson: Record<string, any> = {
    url,
    method,
    ...(paramList.length ? {} : data),
    headers
  }
  return reqJson
}

export const getErrorMessage = (
  daaataTransferObject: Array<Core.Constructor<any>>,
  target: Object,
  params: Record<string, any>
): ValidationError[] => {
  return daaataTransferObject.reduce((prev: ValidationError[], target) => {
    return [...prev, ...validateSync(plainToInstance(target, params))]
  }, [])
}

export const callHander = (
  errors: ValidationError[],
  message?: string | ((validationError: ValidationError[]) => any)
) => {
  if (errors.length) {
    if (!message) {
      const messages: string[] = flattenErrorList(errors)
      console.error(messages)
    } else if (typeof message === 'string') {
      console.error(message)
    } else {
      console.error(message?.(errors) ?? errors)
    }
  }
}

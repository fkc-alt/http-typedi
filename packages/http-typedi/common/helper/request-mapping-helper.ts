/* eslint-disable @typescript-eslint/ban-types */
import { plainToInstance } from 'class-transformer'
import { ValidationError, validateSync } from 'class-validator'
import { InterceptorReq, InterceptorRes, HttpFactory, Core } from '../core'
import { MetadataKey, Method } from '../enums'
import { flattenErrorList } from './param-error'
import { isFunction } from './utils'
import { CONNECTSTRING } from './constant'

export type CatchCallback = (err: any) => void

export const factoryPropertyKey: Record<string, string> = {
  [MetadataKey.INTERCEPTORSREQ_METADATA]: 'globalInterceptorsReq',
  [MetadataKey.INTERCEPTORSRES_METADATA]: 'globalInterceptorsRes'
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
    return new Promise(resolve => {
      setTimeout(async () => {
        const result: Record<string, any> = await fn.call(
          this,
          interceptorsReq.reduce((prev, next) => next(prev), param)
        )
        // eslint-disable-next-line @typescript-eslint/return-await
        const response = interceptorsRes.reduce(
          (prev, next) => next(prev),
          result
        )
        resolve(response)
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

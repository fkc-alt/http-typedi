/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { plainToInstance } from 'class-transformer'
import { ValidationError, validateSync } from 'class-validator'
import { InterceptorReq, InterceptorRes, HttpFactory } from '../../core'
import { MetadataKey, Method } from '../../enums'
import { flattenErrorList } from '../../helper/param-error'
import { isFunction } from '../../helper'
import { Core } from '../../interface/core'

type CatchCallback = (err: any) => void

const factoryPropertyKey: Record<string, string> = {
  [MetadataKey.INTERCEPTORSREQ_METADATA]: 'globalInterceptorsReq',
  [MetadataKey.INTERCEPTORSRES_METADATA]: 'globalInterceptorsRes'
}

const getInterceptors = (
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

const getCatchCallback = (
  target: Object,
  propertyKey: string | symbol
): CatchCallback => {
  return (
    Reflect.getMetadata(MetadataKey.CATCH_METADATA, target, propertyKey) ??
    Reflect.getMetadata(MetadataKey.CATCH_METADATA, target.constructor) ??
    (HttpFactory as any).globalCatchCallback
  )
}

const getDataTransferObject = (
  target: Object,
  key: string | symbol
): Core.Constructor[] => {
  return (
    Reflect.getMetadata(MetadataKey.PARAMTYPES_METADATA, target, key)?.filter(
      (target: any) => target.name !== 'Object'
    ) ?? []
  )
}

async function handlerResult(
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
    const result: Record<string, any> = await fn.call(
      this,
      interceptorsReq.reduce((prev, next) => next(prev), param)
    )
    const response = interceptorsRes.reduce((prev, next) => next(prev), result)
    // eslint-disable-next-line @typescript-eslint/return-await
    return await response
  } catch (error) {
    const catchCallback = getCatchCallback(target, propertyKey)
    catchCallback?.(error)
    return await Promise.reject(error)
  }
}

const handelParam = (
  path: string,
  method: Method,
  target: Object,
  key: string | symbol,
  params: Record<string, any>
): Record<string, any> => {
  const hasGet = [Method.GET, Method.get].includes(method)
  const globalPrefix: string = (HttpFactory as any).globalPrefix
  const currentPrefix = (<any>target)[`${target.constructor.name}-Prefix`]
  const requestPath: string = path.replace(/^\//g, '')
  const requestURL = `${globalPrefix}${currentPrefix}${requestPath}`
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prefixUrl, ...paramList] = requestURL.split('/:')
  const currentTargetHeaders: Record<string, any> =
    Reflect.getMetadata(MetadataKey.REQUEST_METADATA, target.constructor) ?? {}
  const currentHeaders: Record<string, any> =
    Reflect.getMetadata(MetadataKey.REQUEST_METADATA, target, key) ?? {}
  Object.assign(currentTargetHeaders, currentHeaders)
  for (const key in currentTargetHeaders) {
    if (isFunction(currentTargetHeaders[key])) {
      currentTargetHeaders[key] = currentTargetHeaders[key]()
    }
  }
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
    headers: currentTargetHeaders
  }
  return reqJson
}

const getErrorMessage = (
  daaataTransferObject: Array<Core.Constructor<any>>,
  target: Object,
  params: Record<string, any>
): ValidationError[] => {
  return daaataTransferObject.reduce((prev: ValidationError[], target) => {
    return [...prev, ...validateSync(plainToInstance(target, params))]
  }, [])
}

const callHander = (
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
    Reflect.defineMetadata('CustomRequest', true, target, key)
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

/**
 * @module Request
 * @method Get
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => any) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Get = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => any)
): MethodDecorator => RequestMapping(path, Method.GET, message)

/**
 * @module Request
 * @method Post
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => any) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Post = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => any)
): MethodDecorator => RequestMapping(path, Method.POST, message)

/**
 * @module Request
 * @method Delete
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => any) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Delete = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => any)
): MethodDecorator => RequestMapping(path, Method.DELETE, message)

/**
 * @module Request
 * @method Patch
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => any) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Patch = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => any)
): MethodDecorator => RequestMapping(path, Method.PATCH, message)

/**
 * @module Request
 * @method Options
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => any) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Options = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => any)
): MethodDecorator => RequestMapping(path, Method.OPTIONS, message)

/**
 * @module Request
 * @method Head
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => any) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Head = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => any)
): MethodDecorator => RequestMapping(path, Method.HEAD, message)

/**
 * @module Request
 * @method Put
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => any) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Put = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => any)
): MethodDecorator => RequestMapping(path, Method.PUT, message)

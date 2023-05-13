/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { ValidationError } from 'class-validator'
import { Method } from '../../enums'
import {
  callHander,
  getDataTransferObject,
  getErrorMessage,
  handelParam,
  handlerResult
} from '../../helper'
import { Core } from '../../interface/core'

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

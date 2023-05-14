/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { ValidationError } from 'class-validator'
import { Method } from '../../enums'
import { RequestMapping } from '../../helper'

/**
 * @module Request
 * @method Get
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => void) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Get = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
): MethodDecorator => RequestMapping(path, Method.GET, message)

/**
 * @module Request
 * @method Post
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => void) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Post = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
): MethodDecorator => RequestMapping(path, Method.POST, message)

/**
 * @module Request
 * @method Delete
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => void) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Delete = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
): MethodDecorator => RequestMapping(path, Method.DELETE, message)

/**
 * @module Request
 * @method Patch
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => void) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Patch = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
): MethodDecorator => RequestMapping(path, Method.PATCH, message)

/**
 * @module Request
 * @method Options
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => void) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Options = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
): MethodDecorator => RequestMapping(path, Method.OPTIONS, message)

/**
 * @module Request
 * @method Head
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => void) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Head = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
): MethodDecorator => RequestMapping(path, Method.HEAD, message)

/**
 * @module Request
 * @method Put
 * @param { string } path
 * @param { string | ((validationArguments: ValidationError[]) => void) } message
 * @auther kaichao.feng
 * @description Request Method
 */
export const Put = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
): MethodDecorator => RequestMapping(path, Method.PUT, message)

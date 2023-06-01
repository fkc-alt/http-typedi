/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { ValidationError } from 'class-validator'
import { Method } from '../../enums'
import { RequestMapping } from './core'
import { applyDecorators } from '../core'
import { Override } from './route-params.decorator'

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
): MethodDecorator =>
  applyDecorators(RequestMapping(path, Method.GET, message), Override())

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
): MethodDecorator =>
  applyDecorators(RequestMapping(path, Method.POST, message), Override())

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
): MethodDecorator =>
  applyDecorators(RequestMapping(path, Method.DELETE, message), Override())

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
): MethodDecorator =>
  applyDecorators(RequestMapping(path, Method.PATCH, message), Override())

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
): MethodDecorator =>
  applyDecorators(RequestMapping(path, Method.OPTIONS, message), Override())

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
): MethodDecorator =>
  applyDecorators(RequestMapping(path, Method.HEAD, message), Override())

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
): MethodDecorator =>
  applyDecorators(RequestMapping(path, Method.PUT, message), Override())

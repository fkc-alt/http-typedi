/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { ValidationError } from 'class-validator'
import { Method } from '../../enums'
import { capitalizeFirstLetter } from '../../helper'
import { RequestMapping } from './core'

const HttpStaticMethod = (
  [
    Method.get,
    Method.post,
    Method.delete,
    Method.put,
    Method.head,
    Method.options,
    Method.patch
  ] as const
).map(capitalizeFirstLetter)

type HttpMethoMethodDecorator = (
  path: string,
  method: Uppercase<(typeof HttpStaticMethod)[number]>,
  message?: string | ((validationArguments: ValidationError[]) => void)
) => MethodDecorator

type RequestMappingStaticMethod = {
  [K in (typeof HttpStaticMethod)[number]]: HttpMethoMethodDecorator
}

class RequestMappingStatic implements RequestMappingStaticMethod {
  static methods = HttpStaticMethod.map(capitalizeFirstLetter)
  constructor() {
    this.registerRequestMapping()
  }
  Get!: HttpMethoMethodDecorator
  Post!: HttpMethoMethodDecorator
  Delete!: HttpMethoMethodDecorator
  Put!: HttpMethoMethodDecorator
  Head!: HttpMethoMethodDecorator
  Options!: HttpMethoMethodDecorator
  Patch!: HttpMethoMethodDecorator
  registerRequestMapping() {
    RequestMappingStatic.methods.forEach(method => {
      this[method] = (
        path: string,
        message?: string | ((validationArguments: ValidationError[]) => void)
      ): MethodDecorator => RequestMapping(path, method as any, message)
    })
  }
}

export const { Get, Delete, Head, Options, Patch, Post, Put } =
  new RequestMappingStatic()

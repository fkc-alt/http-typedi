import { ValidationError } from 'class-validator'
import { Method } from '../../enums'
import { capitalizeFirstLetter, capitalizeUpperCaseLetter } from '../../helper'
import { createRequestMapping } from './core'

type HttpMethoMethodDecorator = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
) => MethodDecorator

type RequestMappingStaticMethod = {
  [K in (typeof RequestMappingFactoryStatic.HttpStaticMethod)[number]]: HttpMethoMethodDecorator
}

class RequestMappingFactoryStatic implements RequestMappingStaticMethod {
  static HttpStaticMethod = (
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

  static HttpStaticMethodUpperCase =
    RequestMappingFactoryStatic.HttpStaticMethod.map(capitalizeUpperCaseLetter)

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
    RequestMappingFactoryStatic.HttpStaticMethod.forEach((method, token) => {
      this[method] = (path, message) =>
        createRequestMapping(
          path,
          Method[RequestMappingFactoryStatic.HttpStaticMethodUpperCase[token]],
          message
        )
    })
  }
}

export const { Get, Delete, Head, Options, Patch, Post, Put } =
  new RequestMappingFactoryStatic()

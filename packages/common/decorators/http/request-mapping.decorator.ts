import { ValidationError } from 'class-validator'
import { Method, MethodMapping } from '../../enums'
import { createRequestMapping } from './core'

type HttpMethodDecorator = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
) => MethodDecorator

type RequestMappingStaticMethod = {
  [K in (typeof RequestMappingFactoryStatic.HttpStaticMethodsMapping)[number]]: HttpMethodDecorator
}

class RequestMappingFactoryStatic implements RequestMappingStaticMethod {
  static HttpStaticMethodsMapping = [
    MethodMapping.GET,
    MethodMapping.POST,
    MethodMapping.DELETE,
    MethodMapping.PUT,
    MethodMapping.HEAD,
    MethodMapping.OPTIONS,
    MethodMapping.PATCH
  ]

  static HttpStaticMethod = [
    Method.GET,
    Method.POST,
    Method.DELETE,
    Method.PUT,
    Method.HEAD,
    Method.OPTIONS,
    Method.PATCH
  ]

  constructor() {
    this.registerRequestMapping()
  }

  GetMapping!: HttpMethodDecorator
  PostMapping!: HttpMethodDecorator
  DeleteMapping!: HttpMethodDecorator
  HeadMapping!: HttpMethodDecorator
  OptionsMapping!: HttpMethodDecorator
  PutMapping!: HttpMethodDecorator
  PatchMapping!: HttpMethodDecorator

  registerRequestMapping() {
    RequestMappingFactoryStatic.HttpStaticMethodsMapping.forEach(
      (methodMapping, token) => {
        this[methodMapping] = (path, message) =>
          createRequestMapping(
            path,
            Method[RequestMappingFactoryStatic.HttpStaticMethod[token]],
            message
          )
      }
    )
  }
}

export const {
  GetMapping,
  PostMapping,
  DeleteMapping,
  HeadMapping,
  OptionsMapping,
  PatchMapping,
  PutMapping
} = new RequestMappingFactoryStatic()

import { ValidationError } from 'class-validator'
import { Method, MethodMapping } from '../../enums'
import { createRequestMapping } from './core'

type HttpMethodDecorator = (
  path: string,
  message?: string | ((validationArguments: ValidationError[]) => void)
) => MethodDecorator

type RequestMappingStaticMethod = {
  [K in MethodMapping]: HttpMethodDecorator
}

class RequestMappingFactoryStatic implements RequestMappingStaticMethod {
  private static readonly HttpStaticMethodsMappingMap = new Map<
    MethodMapping,
    Method
  >([
    [MethodMapping.GET, Method.GET],
    [MethodMapping.POST, Method.POST],
    [MethodMapping.DELETE, Method.DELETE],
    [MethodMapping.PUT, Method.PUT],
    [MethodMapping.HEAD, Method.HEAD],
    [MethodMapping.OPTIONS, Method.OPTIONS],
    [MethodMapping.PATCH, Method.PATCH]
  ])

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

  private registerRequestMapping() {
    RequestMappingFactoryStatic.HttpStaticMethodsMappingMap.forEach(
      (method, methodMapping) => {
        this[methodMapping] = (path, message) =>
          createRequestMapping(path, method, message)
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

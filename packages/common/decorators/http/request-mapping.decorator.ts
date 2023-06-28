import { ValidationError } from 'class-validator'
import { Method, MethodMapping } from '../../enums'
import { createRequestMapping } from './core'

interface HttpMethodDecorator {
  (
    path: string,
    message?: string | ((validationArguments: ValidationError[]) => void)
  ): MethodDecorator
}

type RequestMappingStaticMethod = {
  readonly [K in MethodMapping]-?: HttpMethodDecorator
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
  DeleteMapping!: HttpMethodDecorator
  OptionsMapping!: HttpMethodDecorator
  PostMapping!: HttpMethodDecorator
  PutMapping!: HttpMethodDecorator
  PatchMapping!: HttpMethodDecorator
  HeadMapping!: HttpMethodDecorator

  private registerRequestMapping() {
    RequestMappingFactoryStatic.HttpStaticMethodsMappingMap.forEach(
      this.setupMapped.bind(this)
    )
  }

  private setupMapped(method: Method, methodMapping: MethodMapping) {
    this[methodMapping] = (path, message) =>
      createRequestMapping(path, method, message)
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

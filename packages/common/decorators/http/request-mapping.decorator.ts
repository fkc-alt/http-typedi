import { ValidationError } from 'class-validator'
import { RequestMethod, MethodMapping } from '../../enums'
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
    RequestMethod
  >([
    [MethodMapping.GET, RequestMethod.GET],
    [MethodMapping.POST, RequestMethod.POST],
    [MethodMapping.DELETE, RequestMethod.DELETE],
    [MethodMapping.PUT, RequestMethod.PUT],
    [MethodMapping.HEAD, RequestMethod.HEAD],
    [MethodMapping.OPTIONS, RequestMethod.OPTIONS],
    [MethodMapping.PATCH, RequestMethod.PATCH]
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

  private setupMapped(method: RequestMethod, methodMapping: MethodMapping) {
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

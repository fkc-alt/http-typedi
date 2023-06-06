// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Core {
  type Providers = Array<
    | Constructor<any>
    | {
        provide: string
        useFactory: () => any
      }
    | {
        provide: string
        useValue: any
      }
  >
  interface ModuleMetadata {
    imports?: Array<Constructor<any>>
    controllers?: Array<Constructor<any>>
    providers?: Providers
    exports?: Providers
  }

  type Constructor<T = any> = new (...args: any[]) => T
  interface ClassProvider<T> {
    provide: Constructor<T>
    useClass: Constructor<T>
  }
  type ParamData = object | string | number
  interface RouteParamMetadata {
    index: number
    data?: ParamData
    pipes?: Array<Constructor<any> | Record<string, any>>
    factory?: import('../decorators/core/interfaces/create-route-param-decorator.interface').CustomParamFactory
  }
  interface PipeTransform<T = any, R = any> {
    /**
     * Method to implement a custom pipe.  Called with two parameters
     *
     * @param value argument before it is received by route handler method
     */
    transform(value: T): R
  }
  interface RequestConfig<D = unknown> {
    url?: string
    method?: import('../enums').Method
    headers?: Record<string, string | number | boolean>
    params?: any
    data?: D
  }
}

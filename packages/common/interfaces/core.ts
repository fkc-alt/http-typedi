export type Providers = Array<
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

export interface ModuleMetadataType {
  imports?: Array<Constructor<any>>
  controllers?: Array<Constructor<any>>
  providers?: Providers
  exports?: Providers
}

export type Constructor<T = any> = new (...args: any[]) => T

export interface ClassProvider<T> {
  provide: Constructor<T>
  useClass: Constructor<T>
}

export type ParamData = object | string | number

export interface RouteParamMetadata {
  index: number
  data?: ParamData
  pipes?: Array<Constructor<any> | Record<string, any>>
  factory?: import('../decorators/core/interfaces/create-route-param-decorator.interface').CustomParamFactory
}

export interface PipeTransform<T = any, R = any> {
  /**
   * RequestMethod to implement a custom pipe.  Called with two parameters
   *
   * @param value argument before it is received by route handler method
   */
  transform(value: T): R
}

export type HttpFactoryPropertieKeys =
  | 'logger'
  | 'timeout'
  | 'sleepTimer'
  | 'globalCatchCallback'
  | 'globalTimeoutCallback'
  | 'globalInterceptorsReq'
  | 'globalInterceptorsRes'
  | 'globalPrefix'
  | 'globalTimeout'
  | 'globalSleepTimer'
  | 'module'
  | 'prefix'

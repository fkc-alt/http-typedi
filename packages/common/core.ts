/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from 'uuid'
import { RequestConfig } from '..'
import {
  ModuleMetadata,
  MetadataKey,
  HttpStatus,
  Method,
  RouteParamtypes,
  ContentType
} from './enums'
import {
  deepRegisterModulesAllProvider,
  isFunction,
  flattenErrorList
} from './helper'
import { HttpFactoryMap } from './http-factory-map'
import type {
  ClassProvider,
  Constructor,
  ModuleMetadataType,
  ParamData,
  PipeTransform,
  Providers,
  RouteParamMetadata
} from './interfaces/core'
import type { ResponseConfig, LoggerService } from './providers'
export * from './decorators'
export {
  MetadataKey,
  HttpStatus,
  Method,
  RouteParamtypes,
  flattenErrorList,
  ContentType
}
export type { ModuleMetadataType }
export type {
  ClassProvider,
  Constructor,
  ModuleMetadata,
  ParamData,
  PipeTransform,
  Providers,
  RouteParamMetadata
}

/**
 * @module Container
 * @class Container
 * @param { ClassProvider<T> }
 * @auther kaichao.feng
 * @description 依赖容器
 */
class Container {
  providers = new Map<Constructor<any>, ClassProvider<any> | any>()
  /**
   * register
   */
  addProvider<T>(provider: ClassProvider<T>): void {
    this.providers.set(provider.provide, provider)
  }

  /**
   * get
   */
  inject(token: Constructor<any>): Constructor<any> {
    return this.providers.get(token)?.useClass as Constructor<any>
  }
}

type HttpServicesApplication<T = any> = HttpFactory & T

export type InterceptorReq = (requestConfig: RequestConfig) => RequestConfig

export type InterceptorRes = (response: ResponseConfig<any>) => any

interface CreateOptions {
  /**
   *  @description expose target properties
   */
  expose: boolean
}

/**
 * @publicApi
 */
export class HttpFactory {
  private logger!: Constructor<any>

  private globalPrefix = ''

  private globalTimeout = 0

  private globalSleepTimer = 0

  private globalModule!: Array<Constructor<any>>

  private globalInterceptorsReq: InterceptorReq[] = []

  private globalInterceptorsRes: InterceptorRes[] = []

  private globalCatchCallback!: (cb: (error: any) => any) => any

  private globalTimeoutCallback!: (cb: () => any) => any

  private static UseLoggerAutomaticInstantiation: MethodDecorator = (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalFn = descriptor.value
    descriptor.value = function (logger: any) {
      return originalFn.call(
        this,
        logger instanceof Function ? new logger() : logger
      )
    }
  }

  create<T>(
    target: Constructor<T>
    // options?: CreateOptions
  ): HttpServicesApplication<T> {
    const imports: Array<Constructor<any>> =
      Reflect.getMetadata(ModuleMetadata.IMPORTS, target) ?? []
    const deepGlobalModule = (
      modules: Array<Constructor<any>>
    ): Array<Constructor<any>> => {
      // return modules.reduce((prev: Array<Constructor<any>>, target) => {
      //   const isGlobal = Reflect.getMetadata(MetadataKey.GLOBAL, target)
      //   if (isGlobal) {
      //     const isDeepModule: Array<Constructor<any>> =
      //       Reflect.getMetadata(ModuleMetadata.IMPORTS, target) || []
      //     return isDeepModule.length
      //       ? [...prev, target, ...deepGlobalModule(isDeepModule)]
      //       : [...prev, target]
      //   }
      //   return prev
      // }, [])
      const globalModules = Array.from(
        new Set(
          modules.filter(constructor =>
            Reflect.getMetadata(MetadataKey.GLOBAL, constructor)
          )
        )
      )
      const deepModules = globalModules.flatMap(constructor => {
        const deepModuleImports =
          Reflect.getMetadata(ModuleMetadata.IMPORTS, constructor) || []
        return deepModuleImports.length
          ? [constructor, ...deepGlobalModule(deepModuleImports)]
          : [constructor]
      })
      return [...globalModules, ...deepModules]
    }
    this.globalModule = Array.from(new Set(deepGlobalModule(imports)))
    const exposeProperties: this = <this>{} //options?.expose ? this : <this>{}
    const HTTPClient = {
      ...exposeProperties,
      setGlobalCatchCallback: this.setGlobalCatchCallback.bind(this),
      setGlobalPrefix: this.setGlobalPrefix.bind(this),
      setGlobalTimeout: this.setGlobalTimeout.bind(this),
      setGlobalSleepTimer: this.setGlobalSleepTimer.bind(this),
      useInterceptorsReq: this.useInterceptorsReq.bind(this),
      useInterceptorsRes: this.useInterceptorsRes.bind(this),
      useLogger: this.useLogger.bind(this)
    }
    const token = uuidv4()
    HttpFactoryMap.set(token, this)
    return Object.assign(HTTPClient, Factory(target, token))
  }

  /**
   *
   * @param { string } prefix
   * @memberof HttpFactory
   * @description set global request prefix
   */
  public setGlobalPrefix(prefix: string) {
    this.globalPrefix = prefix ? prefix.replace(/^\//g, '') + '/' : ''
  }

  /**
   *
   * @param { number } timer
   * @memberof HttpFactory
   * @description set global timeout
   */
  public setGlobalTimeout(timer: number) {
    this.globalTimeout = timer
  }

  /**
   *
   * @param { number } timer
   * @memberof HttpFactory
   * @description set global sleepTimer
   */
  public setGlobalSleepTimer(timer: number) {
    this.globalSleepTimer = timer
  }

  /**
   *
   * @param { Array<InterceptorReq> } interceptors
   * @memberof HttpFactory
   * @description set global request interceptorsReq
   */
  public useInterceptorsReq(...interceptors: InterceptorReq[]) {
    this.globalInterceptorsReq = interceptors
  }

  /**
   *
   * @param { Array<InterceptorRes> } interceptors
   * @memberof HttpFactory
   * @description set global request interceptorsRes
   */
  public useInterceptorsRes(...interceptors: InterceptorRes[]) {
    this.globalInterceptorsRes = interceptors
  }

  /**
   *
   *
   * @param {(error: any) => any} catchCallback
   * @memberof HttpFactory
   * @description set global error callback
   */
  public setGlobalCatchCallback(catchCallback: (error: any) => any) {
    this.globalCatchCallback = catchCallback
  }

  /**
   *
   *
   * @param {() => any} timeoutCallback
   * @memberof HttpFactory
   * @description set global timeout callback
   */
  public setGlobalTimeoutCallback(timeoutCallback: () => any) {
    this.globalTimeoutCallback = timeoutCallback
  }

  /**
   *
   *
   * @param {() => any} timeoutCallback
   * @memberof HttpFactory
   * @description use Logger
   */
  @HttpFactory.UseLoggerAutomaticInstantiation
  public useLogger(Logger: Constructor<any>) {
    this.logger = Logger
  }
}

/**
 * @module SupportFactory
 * @param { Constructor<T> } Constructor<T>
 * @returns { T } Function
 * @auther kaichao.feng
 * @description 依赖注入工厂函数
 * */
// const HttpFactory = new HttpFactory()

const registerDeepClass = (
  container: Container,
  providers: Array<Constructor<any>>
): Array<Constructor<any>> => {
  return (
    providers?.map((provider: any) => {
      const currentProvide: Constructor<any> = container.inject(provider)
      if (!currentProvide) {
        console.log(provider, currentProvide, 'currentProvide')
        throw new Error(`Please use exports Service ${provider.name as string}`)
      }
      const childrenProviders = Reflect.getMetadata(
        MetadataKey.PARAMTYPES_METADATA,
        provider
      )
      const isFactoryProvide = isFunction(currentProvide)
      let instance
      if (!childrenProviders) {
        instance = isFactoryProvide ? new currentProvide() : currentProvide
      } else {
        instance = new currentProvide(
          ...registerDeepClass(container, childrenProviders)
        )
      }
      registerPropertes(currentProvide, instance)
      return instance
      // return !childrenProviders
      //   ? isFactoryProvide
      //     ? new currentProvide()
      //     : currentProvide
      //   : new currentProvide(...registerDeepClass(container, childrenProviders))
    }) ?? []
  )
}

/**
 * @param { Constructor<any> } target
 * @param { any } instance
 * @description Object register properties
 */
const registerPropertes = (target: Constructor<any>, instance: any) => {
  const properties: Array<{
    propertyName: string
    provide: Constructor<any>
  }> = Reflect.getMetadata(MetadataKey.INJECTIONS, target)
  properties?.forEach(
    ({ propertyName, provide }) => (instance[propertyName] = provide)
  )
}

/**
 * @method initContainer
 * @param { Container } container
 * @param { Array<Constructor<any>> } providers
 * @author kaichao.feng
 * @description Init Container
 */
const initContainer = (
  container: Container,
  providers: Array<Constructor<any>>
) => {
  providers.forEach((provide: any) => {
    const isInject = Reflect.getMetadata(
      MetadataKey.INJECTABLE_WATERMARK,
      provide
    )
    const isFactoryProvide = isFunction(provide)
    if (!isInject && isFactoryProvide)
      throw new Error(`Please use @Injectable() ${provide.name as string}`)
    container.addProvider({
      provide: isFactoryProvide ? provide : provide.provide,
      useClass: isFactoryProvide
        ? provide
        : provide?.useFactory?.() ?? provide.useValue
    })
  })
}

/**
 * @method initFactory
 * @param { Constructor<T> } target
 * @param { Container } container
 * @param { Array<Constructor<any>> } constructorProviders
 * @author kaichao.feng
 * @description Init Factory
 */
const initFactory = <T>(
  target: Constructor<T>,
  container: Container,
  constructorProviders: Array<Constructor<any>>
) => {
  const params: Array<Constructor<any>> = constructorProviders.map(target => {
    const currentProviders = Reflect.getMetadata(
      MetadataKey.PARAMTYPES_METADATA,
      target
    )
    if (
      !container.inject(target) &&
      Reflect.getMetadata(MetadataKey.INJECTABLE_WATERMARK, target)
    ) {
      throw new Error(`Please use exports Service ${target.name}`)
    }
    return new target(...registerDeepClass(container, currentProviders))
  })
  const instance = new target(...params)
  registerPropertes(target, instance)
  return instance
}

type GetAllModuleAndProviders = <T>(
  target: Constructor<T>,
  token: string
) => {
  providers: Set<Constructor<any>>
  constructorProviders: Array<Constructor<any>>
  deepAllProvider: Array<Constructor<any>>
}

/**
 * @method getAllModuleAndProviders
 * @param { Constructor<T> } target
 * @param { string } token
 * @author kaichao.feng
 * @returns { ReturnType<GetAllModuleAndProviders> } providers
 * @description getAllModuleAndProviders
 */
const getAllModuleAndProviders: GetAllModuleAndProviders = (target, token) => {
  const modules = new Set<Constructor<any>>([
    ...(Reflect.getMetadata(ModuleMetadata.IMPORTS, target) ?? []),
    ...(HttpFactoryMap.get(token).globalModule || [])
  ])
  const providers =
    new Set<Constructor<any>>(
      Reflect.getMetadata(ModuleMetadata.PROVIDERS, target)
    ) ?? []
  const constructorProviders: Array<Constructor<any>> =
    Reflect.getMetadata(MetadataKey.PARAMTYPES_METADATA, target) ?? []
  const deepAllProvider = Array.from(
    new Set(deepRegisterModulesAllProvider(Array.from(modules)))
  )
  return { providers, constructorProviders, deepAllProvider }
}

/**
 * @module Factory
 * @param { Constructor<T> } target
 * @param { string } token
 * @returns { T } application
 * @auther kaichao.feng
 * @description 依赖注入工厂函数
 */
const Factory = <T>(target: Constructor<T>, token: string): T => {
  const { providers, constructorProviders, deepAllProvider } =
    getAllModuleAndProviders<T>(target, token)
  deepAllProvider.forEach(target => {
    Reflect.defineMetadata(MetadataKey.TOKEN, token, target)
    providers.add(target)
  })
  Reflect.defineMetadata(ModuleMetadata.PROVIDERS, deepAllProvider, target)
  const container = new Container()
  try {
    initContainer(container, Array.from(providers))
  } catch (error) {
    console.log('Container Init Error: ', error)
  }
  try {
    return initFactory<T>(target, container, constructorProviders)
  } catch (error) {
    console.log('Factory Init Error: ', error)
    return new target()
  }
}

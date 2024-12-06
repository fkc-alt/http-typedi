/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from 'uuid'
import { CanActivate, Middleware, Reflector, RequestConfig } from '..'
import { StaticMiddlewareConsumer } from './middleware'
import {
  ModuleMetadata,
  MetadataKey,
  HttpStatus,
  RequestMethod,
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
  HttpFactoryPropertieKeys,
  ModuleMetadataType,
  ParamData,
  PipeTransform,
  Providers,
  RouteParamMetadata,
  DynamicModule
} from './interfaces/core.interface'
export * from './interfaces/middleware'
export * from './interfaces'
import type { ResponseConfig } from './providers'
export * from './decorators'
export * from './schedule'
export {
  MetadataKey,
  HttpStatus,
  RequestMethod,
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
  RouteParamMetadata,
  DynamicModule
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
    return <Constructor<any>>this.providers.get(token)?.useClass
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

  private uniqueCache = { token: '' }

  private globalPrefix = ''

  private globalTimeout = 0

  private globalSleepTimer = 0

  private globalModule!: Array<Constructor<any>>

  private globalInterceptorsReq: InterceptorReq[] = []

  private globalInterceptorsRes: InterceptorRes[] = []

  private globalMiddleware: Middleware[] = []

  private globalGuard: (CanActivate | Function)[] = []

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

  static create<T>(
    target: Constructor<T>,
    options?: CreateOptions
  ): HttpServicesApplication<T> {
    return new this().factory(target, options)
  }

  factory<T>(
    target: Constructor<T>,
    options?: CreateOptions
  ): HttpServicesApplication<T> {
    const imports: Array<Constructor<any>> =
      Reflect.getMetadata(ModuleMetadata.IMPORTS, target) ?? []
    imports.forEach(target => {
      Reflect.defineMetadata(MetadataKey.REFLECTOR, Reflector, target)
    })
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
    const exposeProperties: this = options?.expose ? this : <this>{}
    const HTTPClient = {
      ...exposeProperties,
      setGlobalCatchCallback: this.setGlobalCatchCallback.bind(this),
      setGlobalPrefix: this.setGlobalPrefix.bind(this),
      setGlobalTimeout: this.setGlobalTimeout.bind(this),
      setGlobalSleepTimer: this.setGlobalSleepTimer.bind(this),
      useInterceptorsReq: this.useInterceptorsReq.bind(this),
      useInterceptorsRes: this.useInterceptorsRes.bind(this),
      useMiddleware: this.useMiddleware.bind(this),
      useLogger: this.useLogger.bind(this),
      useGlobalGuards: this.useGlobalGuards.bind(this)
    }
    this.uniqueCache.token = uuidv4()
    HttpFactoryMap.set(this.uniqueCache.token, this)
    return { ...HTTPClient, ...Factory(target, this.uniqueCache.token) }
  }

  private SetHttpFactoryInstanceValue(
    token: string,
    key: HttpFactoryPropertieKeys,
    value: any
  ) {
    const Instance = HttpFactoryMap.get(token)
    Instance[key] = value
    HttpFactoryMap.set(token, Instance)
  }

  /**
   *
   * @param { string } prefix
   * @memberof HttpFactory
   * @description set global request prefix
   */
  public setGlobalPrefix(prefix: string) {
    this.globalPrefix = prefix ? prefix.replace(/^\//g, '') + '/' : ''
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalPrefix',
      this.globalPrefix
    )
  }

  /**
   *
   * @param { number } timer
   * @memberof HttpFactory
   * @description set global timeout
   */
  public setGlobalTimeout(timer: number) {
    this.globalTimeout = timer
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalTimeout',
      this.globalTimeout
    )
  }

  /**
   *
   * @param { number } timer
   * @memberof HttpFactory
   * @description set global sleepTimer
   */
  public setGlobalSleepTimer(timer: number) {
    this.globalSleepTimer = timer
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalSleepTimer',
      this.globalSleepTimer
    )
  }

  /**
   *
   * @param { Array<InterceptorReq> } interceptors
   * @memberof HttpFactory
   * @description set global request interceptorsReq
   */
  public useInterceptorsReq(...interceptors: InterceptorReq[]) {
    this.globalInterceptorsReq = interceptors
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalInterceptorsReq',
      this.globalInterceptorsReq
    )
  }

  /**
   *
   * @param { Array<InterceptorRes> } interceptors
   * @memberof HttpFactory
   * @description set global request interceptorsRes
   */
  public useInterceptorsRes(...interceptors: InterceptorRes[]) {
    this.globalInterceptorsRes = interceptors
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalInterceptorsRes',
      this.globalInterceptorsRes
    )
  }

  public useMiddleware(...middlewares: Middleware[]) {
    this.globalMiddleware = Array.from(
      new Set([...this.globalMiddleware, ...middlewares])
    )
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalMiddleware',
      this.globalMiddleware
    )
  }

  public useGlobalGuards(...guards: (CanActivate | Function)[]) {
    this.globalGuard = Array.from(new Set([...this.globalGuard, ...guards]))
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalGuard',
      this.globalGuard
    )
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
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalCatchCallback',
      this.globalCatchCallback
    )
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
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'globalTimeoutCallback',
      this.globalTimeoutCallback
    )
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
    this.SetHttpFactoryInstanceValue(
      this.uniqueCache.token,
      'logger',
      this.logger
    )
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
      console.log(provider, 'registerDeepClass')
      const currentProvide: Constructor<any> = container.inject(provider)
      if (!currentProvide) {
        throw new Error(`Please use exports Service ${<string>provider.name}`)
      }
      const childrenProviders = Reflect.getMetadata(
        MetadataKey.PARAMTYPES_METADATA,
        provider
      )
      const isFactoryProvide = isFunction(currentProvide)
      console.log(isFactoryProvide, 'isFactoryProvide', currentProvide)
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
  const prototype = Object.getPrototypeOf(instance)
  const methodNames = Object.getOwnPropertyNames(prototype).filter(
    name => name !== 'constructor' && typeof prototype[name] === 'function'
  )
  /**
   * @override
   * @description Resolve this pointing issue(解决解构后this指向问题)
   */
  methodNames.forEach(
    propertyKey =>
      (instance[propertyKey] = instance[propertyKey].bind(instance))
  )
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
      throw new Error(`Please use @Injectable() ${<string>provide.name}`)
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
    const instance = new target(
      ...registerDeepClass(container, currentProviders)
    )
    registerPropertes(target, instance)
    return instance
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
  // Http-Typedi 自动注入Reflector内置类
  deepAllProvider.push(Reflector)
  deepAllProvider.forEach(target => {
    Reflect.defineMetadata(MetadataKey.TOKEN, token, target)
    Reflect.defineMetadata(MetadataKey.REFLECTOR, Reflector, target)
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
    const HTTPClient = initFactory<T>(
      target,
      container,
      constructorProviders
    ) as T & { configure: Function }
    if (HTTPClient?.configure) {
      ;(
        StaticMiddlewareConsumer.apply as unknown as { __proto__: any }
      ).__proto__.token = token
      HTTPClient?.configure?.(StaticMiddlewareConsumer.apply)
    }
    return HTTPClient
  } catch (error) {
    console.log('Factory Init Error: ', error)
    return new target()
  }
}

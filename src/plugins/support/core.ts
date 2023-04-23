/* eslint-disable @typescript-eslint/no-dupe-class-members */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/ban-types */
import { ModuleMetadata, MetadataKey } from './interface/enums'
import {
  deepRegisterModulesAllProvider,
  isFunction,
  flattenErrorList
} from './helper'
import { Core } from './interface/core'
export * from './interface/core'
export * from './decorators'
export { flattenErrorList }
/**
 * @module Container
 * @class Container
 * @param { ClassProvider<T> }
 * @auther kaichao.feng
 * @description 依赖容器
 */
class Container {
  providers = new Map<Core.Constructor<any>, Core.ClassProvider<any>>()
  /**
   * 注册
   */
  addProvider<T>(provider: Core.ClassProvider<T>): void {
    this.providers.set(provider.provide, provider)
  }

  /**
   * 获取
   */
  inject(token: Core.Constructor<any>): Core.Constructor<any> {
    return this.providers.get(token)?.useClass as Core.Constructor<any>
  }
}

type HttpServicesApplication<T = any> = HttpFactoryStatic & T

export type InterceptorReq = (
  requestConfig: Core.RequestConfig
) => Core.RequestConfig

export type InterceptorRes = (response: {
  code?: number
  data?: Record<string, any>
  status?: number
  statusText?: string
}) => any

interface CreateOptions {
  /**
   *  @description expose target properties
   */
  expose: boolean
}

/**
 * @publicApi
 */
export class HttpFactoryStatic {
  private globalModule!: Array<Core.Constructor<any>>

  private globalCatchCallback!: (...args: any[]) => any

  private globalPrefix = ''

  private globalInterceptorsReq: InterceptorReq[] = []

  private globalInterceptorsRes: InterceptorRes[] = []

  create<T>(
    target: Core.Constructor<T>,
    options?: CreateOptions
  ): HttpServicesApplication<T> {
    const imports: Array<Core.Constructor<any>> =
      Reflect.getMetadata(ModuleMetadata.IMPORTS, target) ?? []
    const deepGlobalModule = (
      modules: Array<Core.Constructor<any>>
    ): Array<Core.Constructor<any>> => {
      // return modules.reduce((prev: Array<Core.Constructor<any>>, target) => {
      //   const isGlobal = Reflect.getMetadata(MetadataKey.GLOBAL, target)
      //   if (isGlobal) {
      //     const isDeepModule: Array<Core.Constructor<any>> =
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
    return <HttpServicesApplication<T>>(<unknown>Object.assign(
      <Object>Factory(target),
      {
        ...exposeProperties,
        setGlobalCatchCallback: this.setGlobalCatchCallback.bind(this),
        setGlobalPrefix: this.setGlobalPrefix.bind(this),
        useInterceptorsReq: this.useInterceptorsReq.bind(this),
        useInterceptorsRes: this.useInterceptorsRes.bind(this)
      }
    ))
  }

  /**
   *
   *
   * @param {(error: any) => any} catchCallback
   * @memberof HttpFactoryStatic
   * @description set global error callback
   */
  public setGlobalCatchCallback(catchCallback: (error: any) => any) {
    this.globalCatchCallback = catchCallback
  }

  /**
   *
   * @param { string } prefix
   * @memberof HttpFactoryStatic
   * @description set global request prefix
   */
  public setGlobalPrefix(prefix: string) {
    this.globalPrefix = prefix ? prefix.replace(/^\//g, '') + '/' : ''
  }

  /**
   *
   * @param { Array<InterceptorReq> } interceptors
   * @memberof HttpFactoryStatic
   * @description set global request interceptorsReq
   */
  public useInterceptorsReq(...interceptors: InterceptorReq[]) {
    this.globalInterceptorsReq = interceptors
  }

  /**
   *
   * @param { Array<InterceptorRes> } interceptors
   * @memberof HttpFactoryStatic
   * @description set global request interceptorsRes
   */
  public useInterceptorsRes(...interceptors: InterceptorRes[]) {
    this.globalInterceptorsRes = interceptors
  }
}

/**
 * @module SupportFactory
 * @param { Core.Constructor<T> } Core.Constructor<T>
 * @returns { T } Function
 * @auther kaichao.feng
 * @description 依赖注入工厂函数
 * */
export const HttpFactory = new HttpFactoryStatic()

const registerDeepClass = (
  container: Container,
  providers: Array<Core.Constructor<any>>
): Array<Core.Constructor<any>> => {
  return (
    providers?.map((provider: any) => {
      const currentProvide: Core.Constructor<any> = container.inject(provider)
      if (!currentProvide) {
        throw new Error(`Please use exports Service ${provider.name as string}`)
      }
      const childrenProviders = Reflect.getMetadata(
        MetadataKey.PARAMTYPES_METADATA,
        provider
      )
      const isFactoryProvide = isFunction(currentProvide)
      return !childrenProviders
        ? isFactoryProvide
          ? new currentProvide()
          : currentProvide
        : new currentProvide(...registerDeepClass(container, childrenProviders))
    }) ?? []
  )
}

/**
 * @method initContainer
 * @param { Container } container
 * @param { Array<Core.Constructor<any>> } providers
 * @author kaichao.feng
 * @description Init Container
 */
const initContainer = (
  container: Container,
  providers: Array<Core.Constructor<any>>
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
 * @param { Core.Constructor<T> } target
 * @param { Container } container
 * @param { Array<Core.Constructor<any>> } constructorProviders
 * @author kaichao.feng
 * @description Init Factory
 */
const initFactory = <T>(
  target: Core.Constructor<T>,
  container: Container,
  constructorProviders: Array<Core.Constructor<any>>
) => {
  const params: Array<Core.Constructor<any>> = constructorProviders.map(
    target => {
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
    }
  )
  return new target(...params)
}

type GetAllModuleAndProviders = <T>(target: Core.Constructor<T>) => {
  providers: Set<Core.Constructor<any>>
  constructorProviders: Array<Core.Constructor<any>>
  deepAllProvider: Array<Core.Constructor<any>>
}

/**
 * @method getAllModuleAndProviders
 * @param { Core.Constructor<T> } target
 * @author kaichao.feng
 * @returns { ReturnType<GetAllModuleAndProviders> } providers
 * @description getAllModuleAndProviders
 */
const getAllModuleAndProviders: GetAllModuleAndProviders = target => {
  const modules = new Set<Core.Constructor<any>>([
    ...(Reflect.getMetadata(ModuleMetadata.IMPORTS, target) ?? []),
    ...((<any>HttpFactory).globalModule || [])
  ])
  const providers =
    new Set<Core.Constructor<any>>(
      Reflect.getMetadata(ModuleMetadata.PROVIDERS, target)
    ) ?? []
  const constructorProviders: Array<Core.Constructor<any>> =
    Reflect.getMetadata(MetadataKey.PARAMTYPES_METADATA, target) ?? []
  const deepAllProvider = Array.from(
    new Set(deepRegisterModulesAllProvider(Array.from(modules)))
  )
  return { providers, constructorProviders, deepAllProvider }
}

/**
 * @module Factory
 * @param { Constructor<T> } target
 * @returns { T } application
 * @auther kaichao.feng
 * @description 依赖注入工厂函数
 */
export const Factory = <T>(target: Core.Constructor<T>): T => {
  const { providers, constructorProviders, deepAllProvider } =
    getAllModuleAndProviders<T>(target)
  deepAllProvider.forEach(target => providers.add(target))
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

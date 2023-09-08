import { Constructor } from '../interfaces/core.interface'
import { MetadataKey, ModuleMetadata } from '../enums'

/**
 *
 * @param { Constructor<any> } constructor
 * @author kaichao.feng
 * @description Get Global Module Providers
 * @returns { Array<Constructor<any>>  } providers
 */
const getGlobalProviders = (constructor: Constructor<any>) => {
  const isGlobalModule = Reflect.getMetadata(MetadataKey.GLOBAL, constructor)
  return isGlobalModule
    ? [
        ...(Reflect.getMetadata(ModuleMetadata.PROVIDERS, constructor) ?? []),
        ...(Reflect.getMetadata(ModuleMetadata.CONTROLLERS, constructor) ?? [])
      ]
    : []
}

/**
 *
 * @param { Constructor<any> } constructor
 * @author kaichao.feng
 * @description Get the provider for the module
 * @returns { Array<Constructor<any>>  } providers
 */
const getExports = (constructor: Constructor<any>) => {
  return Reflect.getMetadata(ModuleMetadata.EXPORTS, constructor) ?? []
}

/**
 *
 * @param { Constructor<any> } constructor
 * @author kaichao.feng
 * @description Get the IMPORTS for the module
 * @returns { Array<Constructor<any>>  } providers
 */
const getModuleImports = (constructor: Constructor<any>) => {
  return Reflect.getMetadata(ModuleMetadata.IMPORTS, constructor) ?? []
}

/**
 *
 * @param { Constructor<any> } constructor
 * @author kaichao.feng
 * @description Get providers that are not global modules
 * @returns { Array<Constructor<any>>  } providers
 */
const getProviderReduce = (modules: Array<Constructor<any>>) => {
  return modules
    .filter(
      constructor => !Reflect.getMetadata(MetadataKey.GLOBAL, constructor)
    )
    .reduce((prev: Array<Constructor<any>>, constructor) => {
      return [
        ...prev,
        ...(Reflect.getMetadata(ModuleMetadata.EXPORTS, constructor) ?? [])
      ]
    }, [])
}

/**
 *
 * @param { Constructor<any> } constructor
 * @author kaichao.feng
 * @description Recursively obtain providers for all modules
 * @returns { Array<Constructor<any>>  } providers
 */
export const deepRegisterModulesAllProvider = (
  modules: Array<Constructor<any>>
): Array<Constructor<any>> => {
  return modules.reduce((prev: Array<Constructor<any>>, constructor) => {
    const currentImportModules: Array<Constructor<any>> =
      getModuleImports(constructor)
    const globalProviders = getGlobalProviders(constructor)
    const providers = deepRegisterModulesAllProvider(
      currentImportModules.filter(constructor =>
        Reflect.getMetadata(MetadataKey.GLOBAL, constructor)
      )
    )
    const exports = getExports(constructor)
    const providerReduce = getProviderReduce(currentImportModules)
    return [
      ...prev,
      ...providers,
      ...exports,
      ...globalProviders,
      ...providerReduce
    ]
  }, [])
}

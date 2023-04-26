import { Core } from '../../interface/core'

/**
 * @module Module
 * @param { ModuleMetadata }
 * @auther kaichao.feng
 * @description 模块管理函数
 */
export const Module = (metadata: Core.ModuleMetadata): ClassDecorator => {
  //   const propsKeys = Object.keys(metadata)
  return (target: any) => {
    for (const property in metadata) {
      if (metadata[property as keyof Core.ModuleMetadata]) {
        Reflect.defineMetadata(
          property,
          metadata[property as keyof Core.ModuleMetadata],
          target
        )
      }
    }
  }
}

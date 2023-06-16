import { ModuleMetadataType } from '../../interfaces/core'

/**
 * @module Module
 * @param { ModuleMetadata }
 * @auther kaichao.feng
 * @description 模块管理函数
 */
export const Module = (metadata: ModuleMetadataType): ClassDecorator => {
  //   const propsKeys = Object.keys(metadata)
  return (target: any) => {
    for (const property in metadata) {
      if (metadata[property as keyof ModuleMetadataType]) {
        Reflect.defineMetadata(
          property,
          metadata[property as keyof ModuleMetadataType],
          target
        )
      }
    }
  }
}

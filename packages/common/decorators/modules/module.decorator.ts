import { ModuleMetadataType } from '../../interfaces/core.interface'

type ModuleMetadataTypeKeys = keyof ModuleMetadataType

/**
 * @module Module
 * @param { ModuleMetadata }
 * @auther kaichao.feng
 * @description 模块管理函数
 */
export const Module = (metadata: ModuleMetadataType = {}): ClassDecorator => {
  //   const propsKeys = Object.keys(metadata)
  return (target: any) => {
    for (const property in metadata) {
      if (metadata[<ModuleMetadataTypeKeys>property]) {
        Reflect.defineMetadata(
          property,
          metadata[<ModuleMetadataTypeKeys>property],
          target
        )
      }
    }
  }
}

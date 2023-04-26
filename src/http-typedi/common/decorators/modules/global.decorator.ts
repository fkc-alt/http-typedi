import { Core } from '../../interface/core'
import { MetadataKey } from '../../enums'

/**
 * @module Global
 * @auther kaichao.feng
 * @description 全局模块
 */
export const Global = () => {
  return (target: Core.Constructor<any>) => {
    Reflect.defineMetadata(MetadataKey.GLOBAL, true, target)
  }
}

import { Constructor } from '../../interfaces/core.interface'
import { MetadataKey } from '../../enums'

/**
 * @module Global
 * @auther kaichao.feng
 * @description 全局模块
 */
export const Global = () => {
  return (target: Constructor<any>) => {
    Reflect.defineMetadata(MetadataKey.GLOBAL, true, target)
  }
}

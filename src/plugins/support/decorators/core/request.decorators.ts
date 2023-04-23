import { MetadataKey } from '../../interface/enums'

/**
 * @module Request
 * @auther kaichao.feng
 * @description 标注是否为请求依赖
 * @returns { ClassDecorator } ClassDecorator
 */
export const Request = (): ClassDecorator => (target: object) =>
  Reflect.defineMetadata(MetadataKey.REQUEST_SERVICE, true, target)

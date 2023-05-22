/* eslint-disable @typescript-eslint/no-unused-vars */
import { MetadataKey } from '../../enums'

/**
 *
 * For example:
 * `@Version('1')`
 * @auther kaichao.feng
 * @publicApi
 */
export const Version = (version: string): MethodDecorator =>
  createDecoratorBind(MetadataKey.VERSION, version)

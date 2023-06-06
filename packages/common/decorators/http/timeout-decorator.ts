/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MetadataKey } from '../../enums'
import { createDecoratorBind } from '../../helper'
import { applyDecorators } from '../core'

/**
 *
 * For example:
 * `@Timeout(10000)`
 * @param {number} timeout ms
 * @param {Function} callback
 * @auther kaichao.feng
 * @publicApi
 */
export const Timeout = (
  timer: number,
  cb?: Function
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    createDecoratorBind(MetadataKey.TIMEOUT, timer),
    createDecoratorBind(MetadataKey.TIMEOUTCALLBACK_METADATA, cb)
  )

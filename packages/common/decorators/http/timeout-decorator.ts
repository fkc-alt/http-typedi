import { RequestConfig } from '../../providers/interfaces/request.service.interface'
import { MetadataKey } from '../../enums'
import { createDecoratorBind } from '../../helper'
import { applyDecorators } from '../core'

type TimeoutCallback = Required<RequestConfig> extends {
  timeoutCallback: infer R
}
  ? R
  : never

/**
 *
 * For example:
 * `@Timeout(10000)`
 * @param { number } timeout ms
 * @param { TimeoutCallback } callback
 * @auther kaichao.feng
 * @publicApi
 */
export const SendTimeout = (
  timer: number,
  callback?: TimeoutCallback
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    createDecoratorBind(MetadataKey.TIMEOUT, timer),
    createDecoratorBind(MetadataKey.TIMEOUTCALLBACK_METADATA, callback)
  )

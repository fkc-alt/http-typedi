import { MetadataKey } from '../../enums'
import { createDecoratorBind } from '../../helper'

/**
 * Request method Decorator.  Sets a sleep timer.
 *
 * For example:
 * `@Sleep(3000)`
 *
 * @param timer number to be used for sleep timer
 * @auther kaichao.feng
 * @publicApi
 */
export const Sleep = (timer = 0): MethodDecorator & ClassDecorator =>
  createDecoratorBind(MetadataKey.SLEEPTIMER, timer)

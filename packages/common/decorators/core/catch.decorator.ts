import { MetadataKey } from '../../enums'
import { createDecoratorBind } from '../../helper'

/**
 *
 * @param { (error: any) => void } catchCallback
 * @author kaichao.feng
 * @returns { MethodDecorator & ClassDecorator } Decorator
 */
export const Catch = (
  catchCallback: (error: any) => void
): MethodDecorator & ClassDecorator =>
  createDecoratorBind(MetadataKey.CATCH_METADATA, catchCallback)

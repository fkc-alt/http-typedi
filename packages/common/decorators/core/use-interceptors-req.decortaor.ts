import { InterceptorReq } from '../../core'
import { MetadataKey } from '../../enums'
import { createDecoratorBind } from '../../helper'

export const UseInterceptorsReq = (
  ...interceptors: InterceptorReq[]
): MethodDecorator & ClassDecorator =>
  createDecoratorBind(MetadataKey.INTERCEPTORSREQ_METADATA, interceptors)

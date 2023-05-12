import { InterceptorRes } from '../../core'
import { MetadataKey } from '../../enums'
import { createDecoratorBind } from '../../helper'

export const UseInterceptorsRes = (
  ...interceptors: InterceptorRes[]
): MethodDecorator & ClassDecorator =>
  createDecoratorBind(MetadataKey.INTERCEPTORSRES_METADATA, interceptors)

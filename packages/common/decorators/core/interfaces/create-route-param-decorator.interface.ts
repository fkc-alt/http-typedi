/* eslint-disable @typescript-eslint/ban-types */
import { Type } from '@/common/interfaces/type.interface'

export interface ExecutionContext {
  switchToHttp(): HttpArgumentsHost
  /**
   * Returns the *type* of the controller class which the current handler belongs to.
   */
  getClass<T = any>(): Type<T>
  /**
   * Returns a reference to the handler (method) that will be invoked next in the
   * request pipeline.
   */
  getHandler(): Function
}
export interface HttpArgumentsHost {
  /**
   * Returns the in-flight `request` object.
   */
  getRequest<T = any>(): T
  getResponse<T = any>(): T
}
export type CustomParamFactory<TData = any, TInput = any, TOutput = any> = (
  data: TData,
  input: TInput
) => TOutput

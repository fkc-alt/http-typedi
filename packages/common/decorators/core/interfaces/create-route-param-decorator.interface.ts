export interface ExecutionContext {
  switchToHttp(): HttpArgumentsHost
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

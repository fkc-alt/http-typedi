export interface ExecutionContext {
  switchToHttp(): HttpArgumentsHost
}
export interface HttpArgumentsHost {
  /**
   * Returns the in-flight `request` object.
   */
  getRequest<T = any>(): T
  /**
   * Returns the in-flight `response` object.
   */
  getResponse<T = any>(): T
}
export type CustomParamFactory<TData = any, TInput = any, TOutput = any> = (
  data: TData,
  input: TInput
) => TOutput

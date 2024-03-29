export interface Middleware<TRequest = any, TResponse = any> {
  use(req: TRequest, res: TResponse, next: (error?: Error | any) => void): any
}

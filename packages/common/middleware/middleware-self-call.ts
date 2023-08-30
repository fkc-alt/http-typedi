import { Middleware } from '../interfaces/middleware/middleware.interface'

export const middlewareSelfCall = (
  middlewares: Middleware[],
  token: number,
  middlewareProxy: Object,
  result: any
) => {
  middlewares[token] &&
    middlewares[token].use(middlewareProxy, result, () =>
      middlewareSelfCall(middlewares, token + 1, middlewareProxy, result)
    )
}

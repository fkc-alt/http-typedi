import { Middleware } from '../interfaces/middleware/middleware.interface'

export const middlewareSelfCall = (
  middlewares: Middleware[],
  token: number,
  middlewareReqProxy: Object,
  middlewareResProxy: any
) => {
  middlewares[token] &&
    middlewares[token].use(middlewareReqProxy, middlewareResProxy, () =>
      middlewareSelfCall(
        middlewares,
        token + 1,
        middlewareReqProxy,
        middlewareResProxy
      )
    )
}

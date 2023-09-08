import { Middleware } from '../interfaces/middleware/middleware.interface'

export const middlewareSelfCall = (
  middlewares: Middleware[],
  step: number,
  middlewareReqProxy: Object,
  middlewareResProxy: any
) => {
  middlewares[step] &&
    middlewares[step].use(middlewareReqProxy, middlewareResProxy, () =>
      middlewareSelfCall(
        middlewares,
        step + 1,
        middlewareReqProxy,
        middlewareResProxy
      )
    )
}

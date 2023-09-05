import { MiddlewareResponseContext } from '../interfaces/middleware'

// eslint-disable-next-line @typescript-eslint/ban-types
export const createMiddlewareResponseContext = (dispatchRequest: Function) => {
  const middlewareResponseContext: MiddlewareResponseContext = {
    switchToHttp() {
      return {
        getRequest() {
          return dispatchRequest()
        }
      }
    },
    body: {},
    params: {},
    query: {}
  }
  return middlewareResponseContext
}

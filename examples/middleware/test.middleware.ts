import {
  Injectable,
  Middleware,
  RequestConfig,
  NextFunction,
  MiddlewareResponseContext
} from '@/index'

@Injectable()
export class TestMiddleware implements Middleware {
  use(req: RequestConfig, res: MiddlewareResponseContext, next: NextFunction) {
    console.log(req, res, 'Middleware...', this)
    req.headers!.logger2 = true
    req.headers!.file = false
    req.headers!.ack = false
    // next()
    setTimeout(() => {
      next()
    }, 5000)
  }
}

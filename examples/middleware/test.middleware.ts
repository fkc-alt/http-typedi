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
    console.log(req, 'Request...')
    req.headers!.file = false
    req.headers!.ack = false
    next()
  }
}

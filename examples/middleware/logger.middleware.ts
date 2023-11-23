import {
  Injectable,
  Middleware,
  RequestConfig,
  NextFunction,
  MiddlewareResponseContext
} from '@/index'

@Injectable()
export class LoggerMiddleware implements Middleware {
  use(req: RequestConfig, res: MiddlewareResponseContext, next: NextFunction) {
    console.log(req, res, 'Middleware...', res.switchToHttp().getRequest())
    req.headers!.file = true
    res.body.total = 100
    next()
  }
}

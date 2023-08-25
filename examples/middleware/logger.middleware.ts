import { Injectable, Middleware, RequestConfig, NextFunction } from '@/index'

@Injectable()
export class LoggerMiddleware implements Middleware {
  use(req: RequestConfig, res: XMLHttpRequest['response'], next: NextFunction) {
    console.log('Request...')
    next()
  }
}

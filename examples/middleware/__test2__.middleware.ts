import { Injectable, Middleware, RequestConfig, NextFunction } from '@/index'

@Injectable()
export class Test2Middleware implements Middleware {
  use(req: RequestConfig, res: XMLHttpRequest['response'], next: NextFunction) {
    console.log('Request...')
    next()
  }
}

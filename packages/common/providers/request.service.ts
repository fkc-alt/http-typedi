import { Injectable } from '../decorators'
import { ContentType, HttpStatus, RequestMethod } from '../enums'
import { RequestConfig } from './interfaces/request.service.interface'
import { ObjectToURLParameter, GR } from './utils'

@Injectable()
export class RequestService {
  private static readonly timeoutResponse = {
    code: XMLHttpRequest.UNSENT,
    data: null,
    message: 'ECONNABORTED'
  }

  private dispatchRequest<P, R>(rc: RequestConfig<P>): Promise<R> {
    const XHR = new XMLHttpRequest()

    return new Promise<R>((r, j) => {
      const isGet = [RequestMethod.GET, RequestMethod.get].includes(rc.method!)
      const URLParameter = ObjectToURLParameter(rc.params!)
      const URL = isGet
        ? `${rc.url}${URLParameter ? `?${URLParameter}` : ''}}`
        : rc.url

      XHR.timeout = rc.timeout! || 0
      XHR.ontimeout = function () {
        rc.timeoutCallback?.(
          Object.assign(GR.call(this), {
            data: RequestService.timeoutResponse
          })
        )
        XHR.abort()
      }
      XHR.open(rc.method!, URL!)

      for (const key in rc.headers) {
        XHR.setRequestHeader(key, rc.headers![key])
      }
      !Object.hasOwn(rc.headers || {}, 'Content-Type') &&
        XHR.setRequestHeader('Content-Type', ContentType.JSON)

      XHR.onreadystatechange = function () {
        if (XHR.readyState === XHR.DONE) {
          const response = GR.call(this)
          switch (XHR.status) {
            case HttpStatus.OK:
              r(<R>response)
              break
            case XHR.UNSENT:
              j(Object.assign(response, RequestService.timeoutResponse))
              break
            default:
              j(response)
          }
        }
      }

      switch (rc.method) {
        case RequestMethod.GET:
        case RequestMethod.get:
        case RequestMethod.DELETE:
        case RequestMethod.delete:
          XHR.send()
          break
        case RequestMethod.POST:
        case RequestMethod.post:
        case RequestMethod.PUT:
        case RequestMethod.put:
          XHR.send(JSON.stringify(rc.data))
          break
        default:
          XHR.send()
      }
    })
  }

  request<P, R>(config: RequestConfig<P>): Promise<R> {
    return this.dispatchRequest(config)
  }
}

import { Injectable } from '../decorators'
import { HttpStatus, Method } from '../enums'
import { RequestConfig } from './interfaces/request.service.interface'
import { ObjectToURLParameter, getResponse } from './utils'

@Injectable()
export class RequestService {
  private static readonly timeoutResponse = {
    code: XMLHttpRequest.UNSENT,
    data: null,
    message: 'ECONNABORTED'
  }

  request<P, R>(requestConfig: RequestConfig<P>): Promise<R> {
    const XHR = new XMLHttpRequest()

    return new Promise<R>((resolve, reject) => {
      const isGet = [Method.GET, Method.get].includes(requestConfig.method!)
      const URLParameter = ObjectToURLParameter(requestConfig.params!)
      const URL = isGet
        ? `${requestConfig.url}${URLParameter ? `?${URLParameter}` : ''}}`
        : requestConfig.url

      XHR.timeout = requestConfig.timeout! || 0
      XHR.ontimeout = function () {
        requestConfig.timeoutCallback?.(
          Object.assign(getResponse.call(this), {
            data: RequestService.timeoutResponse
          })
        )
        XHR.abort()
      }

      XHR.open(requestConfig.method!, URL!)

      for (const key in requestConfig.headers || {}) {
        XHR.setRequestHeader(key, requestConfig.headers![key])
      }

      XHR.onreadystatechange = function () {
        if (XHR.readyState === XHR.DONE) {
          const response = getResponse.call(this)
          switch (XHR.status) {
            case HttpStatus.OK:
              resolve(<R>response)
              break
            case XHR.UNSENT:
              reject(Object.assign(response, RequestService.timeoutResponse))
              break
            default:
              reject(response)
          }
        }
      }

      switch (requestConfig.method) {
        case Method.GET:
        case Method.get:
        case Method.DELETE:
        case Method.delete:
          XHR.send()
          break
        case Method.POST:
        case Method.post:
        case Method.PUT:
        case Method.put:
          XHR.send(JSON.stringify(requestConfig.data))
          break
        default:
          XHR.send()
      }
    })
  }
}

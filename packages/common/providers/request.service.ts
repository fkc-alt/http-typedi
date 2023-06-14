import { Injectable } from '../decorators'
import { HttpStatus, Method } from '../enums'
import { RequestConfig } from './interfaces/request.service.interface'
import { ObjectToURLParameter } from './utils'

@Injectable()
export class RequestService {
  request<P, R>(requestConfig: RequestConfig<P>): Promise<R> {
    const XHR = new XMLHttpRequest()
    return new Promise<R>((resolve, reject) => {
      const isGet = [Method.GET, Method.get].includes(requestConfig.method!)
      const URLParameter = ObjectToURLParameter(requestConfig.params)
      const URL = isGet
        ? `${requestConfig.url}${URLParameter ? `?${URLParameter}` : ''}}`
        : requestConfig.url
      if (requestConfig.timeout) {
        XHR.timeout = requestConfig.timeout
        XHR.ontimeout = function () {
          requestConfig.timeoutCallback?.()
          XHR.abort()
        }
      }

      XHR.open(requestConfig.method!, URL!)
      if (requestConfig.headers) {
        for (const key in requestConfig.headers || {}) {
          XHR.setRequestHeader(key, requestConfig.headers[key])
        }
      }
      XHR.onreadystatechange = function () {
        if (XHR.readyState === XHR.DONE) {
          const { status, statusText, responseText, responseType, timeout } =
            XHR
          const response = {
            status,
            statusText,
            responseText,
            responseType,
            timeout,
            data: XHR.response ? JSON.parse(XHR.response) : ''
          }
          if (XHR.status === HttpStatus.OK) {
            resolve(<R>response)
          } else if (XHR.status === XHR.UNSENT) {
            reject({
              code: 'ECONNABORTED',
              data: null,
              message: 'timeout'
            })
          } else {
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

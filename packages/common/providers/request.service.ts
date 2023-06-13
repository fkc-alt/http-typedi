import { Injectable } from '../decorators'
import { HttpStatus, Method } from '../enums'
import { RequestConfig } from './interfaces/request.service.interface'
import { ObjectToURLParameter } from './utils'

@Injectable()
export class RequestService {
  request<P, R>(requestConfig: RequestConfig<P>): Promise<R> {
    const XHR = new XMLHttpRequest()
    return new Promise<R>((resolve, reject) => {
      const isGet = requestConfig.method === Method.GET
      const URL = isGet
        ? `${requestConfig.url}?${ObjectToURLParameter(requestConfig.params)}`
        : requestConfig.url
      XHR.open(requestConfig.method!, URL!)
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
          } else {
            reject(response)
          }
        }
      }
      isGet ? XHR.send() : XHR.send(JSON.stringify(requestConfig.data))
    })
  }
}

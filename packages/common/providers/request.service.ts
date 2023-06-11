import { RequestConfig, Response } from './interfaces/request.service.interface'

export class RequestService {
  request<P, R>(requestConfig: RequestConfig<P>): Promise<Response<string>> {
    const XHR = new XMLHttpRequest()
    return new Promise((resolve, reject) => {
      XHR.open(requestConfig.method!, requestConfig.url!)
      XHR.onreadystatechange = function () {
        if (XHR.readyState === 4) {
          resolve(XHR.response)
        }
      }
    })
  }
}

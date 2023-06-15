export interface RequestConfig<R = unknown> {
  url?: string
  method?: import('../../enums').Method
  headers?: Record<string, any>
  params?: R
  data?: R
  timeout?: number
  timeoutCallback?(response: ResponseConfig): void
}

export interface ResponseConfig<R = unknown>
  extends Pick<
    XMLHttpRequest,
    'status' | 'statusText' | 'responseText' | 'responseType' | 'timeout'
  > {
  data: R
}

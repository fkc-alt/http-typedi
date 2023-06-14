export interface RequestConfig<P = unknown> {
  url?: string
  method?: import('../../enums').Method
  headers?: Record<string, any>
  params?: any
  data?: P
  timeout?: number
  timeoutCallback?: () => void
}

export interface Response<R = unknown> {
  readonly code?: number
  readonly message?: string
  data: R
}

export interface ResponseConfig<R = unknown>
  extends Pick<
    XMLHttpRequest,
    'status' | 'statusText' | 'responseText' | 'responseType' | 'timeout'
  > {
  data: R
}

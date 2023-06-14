export interface RequestConfig<R = unknown> {
  url?: string
  method?: import('../../enums').Method
  headers?: Record<string, any>
  params?: R
  data?: R
  timeout?: number
  timeoutCallback?(): void
}

export interface Response<R = unknown> {
  readonly code?: number
  readonly message?: string
  data: R
}

export type ResponseConfig<R = unknown> = Pick<
  XMLHttpRequest & Response<R>,
  'status' | 'statusText' | 'responseText' | 'responseType' | 'timeout' | 'data'
>

export interface RequestConfig<P = unknown> {
  url?: string
  method?: import('../../enums').Method
  headers?: Record<string, string | number | boolean>
  params?: any
  data?: P
}

export interface Response<R = unknown> {
  readonly code: number
  readonly message: string
  data: R
}

declare namespace Services {
  namespace Common {
    /**
     * @method Response
     * @descrption 请求返回类型
     */
    interface Response<T = unknown> {
      readonly code: number
      readonly message: string
      data: T
    }
    interface UplaodReq {
      file: import('element-plus').UploadFile
    }
    interface UplaodRes {
      url: string
    }
    interface UplaodFileReq {
      file: FormDataEntryValue
    }
    interface UplaodBase64Req extends Partial<UplaodReq> {
      ext: string
      base64: string
    }
    interface Pagination {
      currentPage: number
      pageSize: number
    }
  }
}

declare type Application = import('@/service/app.module').default

declare type ServerRes<T, U = Promise> = U extends Promise
  ? Promise<Services.Common.Response<T>>
  : Services.Common.Response<T>

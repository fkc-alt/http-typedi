import { AxiosRequestConfig } from 'axios'
import { Injectable } from '../../../http-typedi'
import RequestService from './request.service'
import ContentTypeService, { ContentType } from './contentType.service'

@Injectable()
export default class UploadService {
  constructor(
    private readonly requestService: RequestService,
    private readonly contenTypeService: ContentTypeService
  ) {}

  public async uploadFile<
    T extends AxiosRequestConfig<Services.Common.UplaodReq>,
    U = Services.Common.UplaodRes
  >(configure: T): ServerRes<U> {
    const {
      data: { file, ...params } = {},
      headers = {},
      ...requestConfig
    } = configure
    const fileLoder = new FormData()
    Object.assign(
      headers,
      this.contenTypeService.GetContentType(ContentType.FORM_DATA)
    )
    fileLoder.append('file', <Blob>file?.raw)
    return await this.requestService.request<Services.Common.UplaodFileReq, U>({
      ...requestConfig,
      headers,
      data: {
        file: <FormDataEntryValue>fileLoder.get('file'),
        ...(params || {})
      }
    })
  }

  public async uploadBase64<
    T extends AxiosRequestConfig<Services.Common.UplaodReq>,
    U = Services.Common.UplaodRes
  >(configure: T): ServerRes<U> {
    type UploadFile = Services.Common.UplaodReq extends { file: infer U }
      ? U
      : never
    return await new Promise((resolve, reject) => {
      try {
        const { data: { file, ...params } = {}, ...requestConfig } = configure
        const render = new FileReader()
        render.onload = (e: ProgressEvent<FileReader>) => {
          const base64 = (<string>e.target?.result)?.split(',').pop() ?? ''
          const ext = `.${<string>(<UploadFile>file).name.split('.').pop()}`
          resolve(
            this.requestService.request<Services.Common.UplaodBase64Req, U>({
              ...requestConfig,
              data: { base64, ext, ...(params || {}) }
            })
          )
        }
        render.readAsDataURL(<Blob>(<UploadFile>file).raw)
      } catch (error) {
        reject(error)
      } finally {
        console.log('upload success')
      }
    })
  }
}

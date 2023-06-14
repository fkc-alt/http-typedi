import { Injectable } from '../core'
import { RequestService } from './request.service'
import { RequestConfig } from './interfaces/request.service.interface'
import { ContentType } from '../enums'

@Injectable()
export class UploadService {
  constructor(private readonly requestService: RequestService) {}

  public async uploadFile<T extends { file: any }, U = unknown>(
    configure: RequestConfig<T>
  ): Promise<U> {
    const {
      data: { file, ...params } = {},
      headers = {},
      ...requestConfig
    } = configure
    const fileLoder = new FormData()
    Object.assign(headers, { 'Conent-Type': ContentType.FORM_DATA })
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

  public async uploadBase64<T extends { file: any }, U = unknown>(
    configure: RequestConfig<T>
  ): Promise<U> {
    return await new Promise((resolve, reject) => {
      try {
        const { data: { file, ...params } = {}, ...requestConfig } = configure
        const render = new FileReader()
        render.onload = (e: ProgressEvent<FileReader>) => {
          const base64 = (<string>e.target?.result)?.split(',').pop() ?? ''
          const ext = `.${<string>(<any>file).name.split('.').pop()}`
          resolve(
            this.requestService.request<Services.Common.UplaodBase64Req, U>({
              ...requestConfig,
              data: { base64, ext, ...(params || {}) }
            })
          )
        }
        render.readAsDataURL(<Blob>(<any>file).raw)
      } catch (error) {
        reject(error)
      } finally {
        console.log('upload success')
      }
    })
  }
}

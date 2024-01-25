import { Injectable } from '../core'
import { RequestService } from './request.service'
import { RequestConfig } from './interfaces/request.service.interface'
import { ContentType } from '../enums'

/**
 *
 * @export
 * @class UploadService
 */
@Injectable()
export class UploadService {
  constructor(private readonly requestService: RequestService) {}

  /**
   *
   * @template T
   * @template U
   * @param {RequestConfig<T>} configure
   * @return {*}  {Promise<U>}
   * @memberof UploadService
   */
  public async uploadFile<T extends { file: any }, U = unknown>(
    configure: RequestConfig<T>
  ): Promise<U> {
    const {
      data: { file, ...params } = {},
      customActions,
      headers = {},
      ...requestConfig
    } = configure
    const fileLoder = new FormData()
    Object.assign(headers, { 'Conent-Type': ContentType.FORM_DATA })
    fileLoder.append('file', <Blob>file?.raw)
    const _config = {
      ...requestConfig,
      headers,
      data: <T>{
        file: fileLoder.get('file'),
        ...(params || {})
      }
    }
    return customActions
      ? <U>_config
      : await this.requestService.request<T, U>(_config)
  }

  /**
   *
   * @template T
   * @template U
   * @param {RequestConfig<T>} configure
   * @return {*}  {Promise<U>}
   * @memberof UploadService
   */
  public async uploadBase64<T extends { file: any }, U = unknown>(
    configure: RequestConfig<T>
  ): Promise<U> {
    return await new Promise((resolve, reject) => {
      try {
        const {
          data: { file, ...params } = {},
          customActions,
          ...requestConfig
        } = configure
        const render = new FileReader()
        render.onload = (e: ProgressEvent<FileReader>) => {
          const base64 = (<string>e.target?.result)?.split(',').pop() ?? ''
          const ext = `.${file.name.split('.').pop()}`
          const _config = {
            ...requestConfig,
            data: <T>(<unknown>{ base64, ext, ...(params || {}) })
          }
          resolve(
            customActions
              ? <U>_config
              : this.requestService.request<T, U>(_config)
          )
        }
        render.readAsDataURL(<Blob>file.raw)
      } catch (error) {
        reject(error)
      } finally {
        console.log('upload success')
      }
    })
  }
}

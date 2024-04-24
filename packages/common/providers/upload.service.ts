/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from 'uuid'
import { Injectable } from '../core'
import { ContentType } from '../enums'
import { RequestService } from './request.service'
import { RequestConfig } from './interfaces/request.service.interface'
import { hexStringToMD5, uint8ArrayToHexString } from './utils'
import {
  ChunkItem,
  ChunkUploadOptions,
  CreateChunksOptions,
  TaskChunksItem
} from './interfaces/upload.service.interface'

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
    Object.assign(headers, { 'Content-Type': ContentType.FORM_DATA })
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

  public async chunkUpload<R>(
    options: ChunkUploadOptions,
    configure: RequestConfig<R>
  ) {
    const { chooseFiles, chunkSizeLimit } = options
    const _chooseFiles = Array.from(chooseFiles)
    const fileTransformerUint8ArrayAndToChunkTransformerMD5 = _chooseFiles.map<
      Promise<ChunkItem>
    >(async (file, fileIndex) => {
      const mb = file.size / 1024 / 1024
      const fileRender = new FileReader()
      return new Promise((resolve, reject) => {
        fileRender.onload = async result => {
          const fileItem = {
            mb,
            fileName: file.name,
            filetype: file.type,
            chunk: Math.ceil(mb / chunkSizeLimit),
            uint8Array: new Uint8Array(result.target!.result as ArrayBuffer),
            taskChunks: <Function[]>[]
          }
          fileItem.taskChunks = this.createChunks(
            {
              fileItem,
              fileIndex,
              chunkSizeLimit
            },
            configure
          )
          resolve(fileItem)
        }
        fileRender.onerror = function (error) {
          console.log('File to ArrayBuffer Error', error)
          reject(error)
        }
        fileRender.readAsArrayBuffer(file)
      })
    })
    const uploadFileTasks = await Promise.allSettled(
      fileTransformerUint8ArrayAndToChunkTransformerMD5
    )
    const _uploadFileTasks = uploadFileTasks
      .filter(task => task.status === 'fulfilled')
      .map(task => <ChunkItem>(<any>task).value)
    const results = await Promise.allSettled(
      _uploadFileTasks.map(async item => {
        const chunkResults = await Promise.allSettled(
          item.taskChunks.map(run => run())
        )
        return chunkResults
      })
    )
    console.log(results, '分片上传完返回的数据')
    return results
  }

  private createChunks(options: CreateChunksOptions, configure: RequestConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fileItem, chunkSizeLimit, fileIndex } = options
    const taskChunks = new Array(fileItem.chunk)
      .fill(void 0)
      .map((_, chunk) => {
        const start = chunkSizeLimit * chunk * 1024 * 1024
        const end = Math.min(
          chunkSizeLimit * (chunk + 1) * 1024 * 1024,
          fileItem.uint8Array.length
        )
        const chunkItem = fileItem.uint8Array.slice(start, end)
        const hexString = uint8ArrayToHexString(chunkItem)
        const md5 = hexStringToMD5(hexString)
        const blob = new Blob([chunkItem], { type: fileItem.filetype })
        const file = new File([blob], fileItem.fileName, {
          type: fileItem.filetype
        })
        return async () =>
          await this.uploadPartFile(
            {
              progress: 0,
              md5,
              file,
              chunkItem: chunkItem.buffer,
              chunkIndex: chunk,
              ...options
            },
            configure
          )
      })
    return taskChunks
  }

  private uploadPartFile(
    options: TaskChunksItem,
    configure: RequestConfig
  ): Promise<TaskChunksItem> {
    return new Promise(async (resolve, reject) => {
      const { headers = {}, ...config } = configure
      const fileLoder = new FormData()
      Object.assign(headers!, {
        'Content-Type': `${
          ContentType.FORM_DATA
        }; boundary=----WebKitFormBoundary${uuidv4().replace(/-/g, '')}`
      })
      fileLoder.append('file', options.file)
      fileLoder.append('md5', options.md5)
      const _config: RequestConfig<any> = {
        ...config,
        headers,
        data: fileLoder
      }
      try {
        const data = await this.requestService.request<
          RequestConfig<any>,
          Record<string, any>
        >(_config)
        const progress =
          ((options.chunkIndex + 1) / options.fileItem.chunk) * 100
        // 每次分片上传完应该执行回调函数，并把progress暴露提示给用户上传进度
        resolve({
          ...options,
          progress,
          result: data.data
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

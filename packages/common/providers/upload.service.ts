/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '../core'
import { ContentType } from '../enums'
import { RequestService } from './request.service'
import { RequestConfig } from './interfaces/request.service.interface'
import { hexStringToMD5, uint8ArrayToHexString } from './utils'

interface ChunkUploadOptions {
  /**
   * @description 需要上传的文件
   */
  chooseFiles: File[]
  /**
   * @description 每个分片的大小 单位为MB
   */
  chunkSizeLimit: number
  /**
   * @description 当前文件分片上传完毕回调
   */
  chunkItemComplate?: (...args: any[]) => void
}

interface CustomFile {
  mb: number
  fileName: string
  filetype: string
  chunk: number
  uint8Array: Uint8Array
}

interface TaskChunksItem extends CreateChunksOptions {
  progress: number
  md5: string
  chunkItem: File
}

interface CreateChunksOptions
  extends Pick<ChunkUploadOptions, 'chunkSizeLimit'> {
  fileItem: CustomFile
  fileIndex: number
}

interface ChunkItem extends CustomFile {
  taskChunks: Promise<TaskChunksItem>[]
}

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
            taskChunks: <Promise<TaskChunksItem>[]>[]
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
    const files = await Promise.allSettled(
      fileTransformerUint8ArrayAndToChunkTransformerMD5
    )
    console.log(files, 'tempFiles')
    return files
  }

  private createChunks(options: CreateChunksOptions, configure: RequestConfig) {
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
        return new Promise<TaskChunksItem>((resolve, reject) => {
          try {
            resolve(
              this.uploadPartFile(
                {
                  progress: 0,
                  md5,
                  chunkItem: file,
                  ...options
                },
                configure
              )
            )
          } catch (error) {
            reject(error)
          }
        })
      })
    return taskChunks
  }

  private uploadPartFile(
    options: TaskChunksItem,
    configure: RequestConfig
  ): Promise<TaskChunksItem> {
    const { headers = {}, ...config } = configure
    const fileLoder = new FormData()
    Object.assign(headers!, { 'Conent-Type': ContentType.FORM_DATA })
    fileLoder.append('file', options.chunkItem)
    fileLoder.append('md5', options.md5)
    const _config = {
      ...config,
      headers,
      data: fileLoder
    }
    console.log(_config, '_config')
    return this.requestService.request(_config)
  }
}

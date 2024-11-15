/* eslint-disable @typescript-eslint/ban-types */
export interface ChunkUploadOptions {
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

export interface CustomFile {
  mb: number
  fileName: string
  filetype: string
  chunk: number
  uint8Array: Uint8Array
}

export interface TaskChunksItem extends CreateChunksOptions {
  progress: number
  md5: string
  chunkItem: ArrayBuffer
  chunkIndex: number
  file: File
  result?: Record<string, any>
}

export interface CreateChunksOptions
  extends Pick<ChunkUploadOptions, 'chunkSizeLimit' | 'chunkItemComplate'> {
  fileItem: CustomFile
  fileIndex: number
}

export interface ChunkItem extends CustomFile {
  taskChunks: Array<Function>
}

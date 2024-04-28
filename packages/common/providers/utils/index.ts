import CryptoJS from 'crypto-js'

export const ObjectToURLParameter = (
  object: Record<string, any> = {}
): string => {
  const params = new URLSearchParams()
  for (const key in object) {
    params.append(key, object[key])
  }
  const queryString = params.toString()
  return queryString
}

// eslint-disable-next-line @typescript-eslint/ban-types
const getHeaders = (plainTextHeaders: string): Object => {
  const result: any = {}
  const headersArray = plainTextHeaders.split(/\n/)
  headersArray.forEach(item => {
    // 每个键值对是由 冒号 隔开
    const [key, value] = item.split(':')
    // 使用trim将前后的空格去除
    const shouldKey = key.trim()
    if (shouldKey) result[shouldKey] = value?.trim?.() ?? ''
  })
  return result
}

export function GR(this: XMLHttpRequest) {
  const { status, statusText, responseText, responseType, timeout } = this
  const response = {
    status,
    statusText,
    responseText,
    responseType,
    timeout,
    responseHeaders: getHeaders(this.getAllResponseHeaders()),
    data: this.response && JSON.parse(this.response)
  }
  return response
}

// 将Uint8Array转换为十六进制字符串
export function uint8ArrayToHexString(uint8Array: Uint8Array) {
  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

// 将十六进制字符串转换为MD5
export function hexStringToMD5(hexString: string) {
  return CryptoJS.MD5(hexString).toString()
}

/**
 *
 * @deprecated
 */
export function generateBoundary() {
  return `boundary=----WebKitFormBoundary${Math.random().toString(16).slice(2)}`
}

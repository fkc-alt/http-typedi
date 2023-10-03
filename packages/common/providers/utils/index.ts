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

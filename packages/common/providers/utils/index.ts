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

export function GR(this: XMLHttpRequest) {
  const { status, statusText, responseText, responseType, timeout } = this
  const response = {
    status,
    statusText,
    responseText,
    responseType,
    timeout,
    responseHeaders: this.getAllResponseHeaders(),
    data: this.response && JSON.parse(this.response)
  }
  return response
}

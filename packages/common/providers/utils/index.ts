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

export function getResponse(this: XMLHttpRequest) {
  const { status, statusText, responseText, responseType, timeout } = this
  const response = {
    status,
    statusText,
    responseText,
    responseType,
    timeout,
    data: this.response && JSON.parse(this.response)
  }
  return response
}

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

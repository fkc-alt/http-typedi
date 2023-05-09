export const create = <T>(
  count: number,
  callback: (data: Record<string, unknown>) => T
): T[] => {
  return [...new Array(count).fill({})].map(v => callback(v))
}

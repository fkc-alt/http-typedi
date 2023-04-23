import { ValidationError } from 'class-validator'

const deepError = (errors: ValidationError[]): any[] => {
  return errors.map(error => {
    if (error.children?.length) return deepError(error.children)
    return Object.values(<{ [type: string]: string }>error.constraints)
      .join()
      .split('<br/>')
  })
}
const deepReduce = (arr: any[]): any[] => {
  return arr.reduce(
    (prev, next) =>
      Array.isArray(next) ? [...prev, ...deepReduce(next)] : [...prev, next],
    []
  )
}

export const flattenErrorList = (errors: ValidationError[]): string[] =>
  deepReduce(deepError(errors))

import { ARRAY, FUNCTION, NUMBER, OBJECT, STRING, SYMBOL } from './constant'

export const isString = (target: any): boolean => {
  return Object.prototype.toString.call(target) === STRING
}

export const isNumber = (target: any): boolean => {
  return Object.prototype.toString.call(target) === NUMBER
}

export const isObject = (target: any): boolean => {
  return Object.prototype.toString.call(target) === OBJECT
}

export const isArray = (target: any): boolean => {
  return Object.prototype.toString.call(target) === ARRAY
}

export const isFunction = (target: any): boolean => {
  return Object.prototype.toString.call(target) === FUNCTION
}

export const isSymbol = (target: any): boolean => {
  return Object.prototype.toString.call(target) === SYMBOL
}

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined'

export const isNil = (val: any): val is null | undefined =>
  isUndefined(val) || val === null

export const isPromise = (obj: any): obj is Promise<any> => {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

type InferCapitalize<T extends string> = T extends `${infer U}${infer R}`
  ? `${Uppercase<U>}${R}`
  : T
  
type InferCapitalizeUpperCaseLetter<T extends string> = T extends `${infer U}`
  ? `${Uppercase<U>}`
  : T

export const capitalizeFirstLetter = <T extends string>(
  string: T
): InferCapitalize<T> => {
  return (string.charAt(0).toUpperCase() +
    string.slice(1)) as InferCapitalize<T>
}

export const capitalizeUpperCaseLetter = <T extends string>(
  string: T
): InferCapitalizeUpperCaseLetter<T> => {
  return string.toUpperCase() as InferCapitalizeUpperCaseLetter<T>
}

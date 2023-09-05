/* eslint-disable @typescript-eslint/no-unused-vars */
export const createMiddlewareProxy = <T extends Object>(target: T): T => {
  return new Proxy(target, {
    get(target, property, _receiver) {
      return Reflect.get(target, property)
    },
    set(target, property, newValue, _receiver) {
      return Reflect.set(target, property, newValue)
    }
  })
}

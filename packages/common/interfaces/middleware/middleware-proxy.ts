export const createMiddlewareProxy = (target: Object): Object => {
  return new Proxy(target, {
    get(target, property, _receiver) {
      return Reflect.get(target, property)
    },
    set(target, property, newValue, _receiver) {
      return Reflect.set(target, property, newValue)
    }
  })
}

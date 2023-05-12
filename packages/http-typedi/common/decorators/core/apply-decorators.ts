/* eslint-disable @typescript-eslint/ban-types */

/**
 *
 * For example:
 * `@applyDecorators(Post('example'), Header('Content-Type', 'application/json'))`
 *
 * @param { Array<ClassDecorator | MethodDecorator | PropertyDecorator } decorators
 * @author kaichao.feng
 * @publicApi
 */
export const applyDecorators = (
  ...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
): (<TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>
) => void) => {
  return function (
    target: Object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    for (const decorator of decorators) {
      if (target instanceof Function && !descriptor) {
        ;(decorator as ClassDecorator)(target)
        continue
      }
      ;(decorator as MethodDecorator | PropertyDecorator)(
        target,
        propertyKey!,
        descriptor!
      )
    }
  }
}

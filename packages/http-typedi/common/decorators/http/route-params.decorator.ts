/* eslint-disable @typescript-eslint/ban-types */
import { MetadataKey, RouteParamtypes } from '../../enums'
import { isArray, isFunction, isString } from '../../helper'
import { Core } from '../../interface/core'
/**
 * @module Override
 * @auther kaichao.feng
 * @description 搭配Param使用
 * @returns { MethodDecorator } MethodDecorator
 */
export const Override = (): MethodDecorator => {
  return function (target, propertyName, descriptor: PropertyDescriptor) {
    const originalMethod: (...params: any[]) => any = descriptor.value
    const data: Record<string, any> =
      Reflect.getMetadata(
        MetadataKey.ROUTE_ARGS_METADATA,
        target.constructor,
        propertyName
      ) || {}
    descriptor.value = function (...args: any[]) {
      const values: Core.RouteParamMetadata[] = (
        Object.values(data) || []
      ).sort((a, b) => a.index - b.index)
      if (values.length) {
        return originalMethod.apply(
          this,
          args.map((param, index) => {
            const item = values.find(_ => _.index === index)
            if (item?.data) {
              const registerClasses = item?.pipe?.map((target: any) =>
                isFunction(target)
                  ? new (target as Core.Constructor<any>)()
                  : target
              )
              if (isArray(item.data)) {
                return (<string[]>item.data).reduce((prev, next) => {
                  const paramObj = <Record<string, any>>{}
                  if (registerClasses?.length) {
                    registerClasses.forEach(target => {
                      paramObj[next] =
                        target?.transform?.(paramObj[next]) ??
                        (param[next] || target.defaultValue)
                    })
                  } else {
                    paramObj[next] = param[next]
                  }
                  return { ...prev, ...paramObj }
                }, {})
              }
              registerClasses?.forEach(target => {
                param[item.data as string] =
                  target?.transform?.(param[item.data as string]) ??
                  (param[item.data as string] || target.defaultValue)
              })
              return param[item.data as string]
            }
            return param
          })
        )
      }
      return originalMethod.apply(this, args)
    }
  }
}

/**
 * @module assignMetadata
 * @auther kaichao.feng
 * @returns { Record<string, any> } Record<string, any>
 */
const assignMetadata = <TParamtype = any, TArgs = any>(
  args: TArgs,
  paramtype: TParamtype,
  index: number,
  data?: any,
  pipe?: Array<Core.Constructor<any> | Object>
): Record<string, any> => {
  return {
    ...args,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    [`${paramtype}:${index}`]: {
      index,
      data,
      pipe
    }
  }
}

/**
 * @method createParamDecorator
 * @auther kaichao.feng
 * @description this is @Param Helper Function
 */
const createParamDecorator =
  (paramtype: RouteParamtypes) =>
  (data?: any, pipe?: Array<Core.Constructor<any> | Object>) =>
  (target: Object, propertyKey: string | symbol, index: number): void => {
    const args =
      Reflect.getMetadata(
        MetadataKey.ROUTE_ARGS_METADATA,
        target.constructor,
        propertyKey
      ) || {}
    const hasParamData = isString(data) || isArray(data)
    const paramData = hasParamData ? data : void 0
    Reflect.defineMetadata(
      MetadataKey.ROUTE_ARGS_METADATA,
      assignMetadata(args, paramtype, index, paramData, pipe),
      target.constructor,
      propertyKey
    )
  }

/**
 * @method Param
 * @auther kaichao.feng
 * @description 搭配Override使用
 */
export const Param = (
  property?: string | string[],
  ...pipe: Array<Core.Constructor<any> | Object>
) => createParamDecorator(RouteParamtypes.PARAM)(property, pipe)

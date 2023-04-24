/* eslint-disable @typescript-eslint/ban-types */
import { MetadataKey, RouteParamtypes } from '../../enums'
import { isArray, isFunction, isString } from '../../helper'
import { Core } from '../../interface/core'
/**
 * @module Inject
 * @auther kaichao.feng
 * @description 具名依赖注入 搭配Param使用
 * @returns { MethodDecorator } MethodDecorator
 */
export const Inject = (): MethodDecorator => {
  return function (target, propertyName, descriptor: PropertyDescriptor) {
    const method: (...params: any[]) => any = descriptor.value
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
        return method.apply(
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
      return method.apply(this, args)
    }
  }
}

/**
 * @module assignMetadata
 * @auther kaichao.feng
 * @returns { Record<string, any> } Record<string, any>
 */
export const assignMetadata = <TParamtype = any, TArgs = any>(
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
export const createParamDecorator =
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
    const paramData = hasParamData ? data : undefined
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
 * @description 搭配Inject使用，Param传递的property会通过Inject读取原始参数并返回指定的key对应的value，并返回到当前装饰器形参位置
 */
export const Param = (
  property?: string | string[],
  ...pipe: Array<Core.Constructor<any> | Object>
) => createParamDecorator(RouteParamtypes.PARAM)(property, pipe)

/* eslint-disable @typescript-eslint/ban-types */
import { MetaDataTypes, MetadataKey, RouteParamtypes } from '../../enums'
import { isArray, isFunction, isString } from '../../helper'
import { Core } from '../../interface/core'

/**
 * @param { Object } target
 * @param { string } propertyName
 * @returns { Core.RouteParamMetadata[] }
 * @author kaichao.feng
 */
export const getInjectValues = (
  target: Object,
  propertyName: string
): Core.RouteParamMetadata[] => {
  const data: Record<string, any> =
    Reflect.getMetadata(
      MetadataKey.ROUTE_ARGS_METADATA,
      target.constructor,
      propertyName
    ) || {}
  const values: Core.RouteParamMetadata[] = (Object.values(data) || []).sort(
    (a, b) => a.index - b.index
  )
  return values
}

export const getMetadataType = (
  target: Object,
  propertyName: string
): MetaDataTypes => {
  return Reflect.getMetadata(
    MetadataKey.METADATATYPE,
    target.constructor,
    propertyName
  )
}

/**
 * @type { MethodDecorator }
 * @param target
 * @param propertyName
 * @param descriptor
 * @author kaichao.feng
 */
const OverrideEffect: MethodDecorator = (
  target,
  propertyName,
  descriptor: PropertyDescriptor
) => {
  const originalMethod: (...params: any[]) => any = descriptor.value
  const values = getInjectValues(target, <string>propertyName)
  descriptor.value = function (...args: any[]) {
    return originalMethod.apply(
      this,
      values.length ? OverrideReqEffect(values, args) : args
    )
  }
}

/**
 *
 * @param { Core.RouteParamMetadata[] } values
 * @param { any[] } args
 * @returns { any[] }
 * @author kaichao.feng
 */
export const OverrideReqEffect = (
  values: Core.RouteParamMetadata[],
  args: any[]
) => {
  return args.map((param, index) => {
    const item = values.find(_ => _.index === index)
    if (item?.data) {
      const registerClasses = item?.pipes?.map((target: any) =>
        isFunction(target) ? new (target as Core.Constructor<any>)() : target
      )
      if (isArray(item.data)) {
        const _param = (<string[]>item.data).reduce((prev, next) => {
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
        return item?.factory?.(item.data, param) ?? _param
      }
      registerClasses?.forEach(target => {
        param[item.data as string] =
          target?.transform?.(param[item.data as string]) ??
          (param[item.data as string] || target.defaultValue)
      })
      return (
        item?.factory?.(item.data, param) ??
        param?.[item.data as string] ??
        void 0
      )
    }
    return item?.factory?.(void 0, param) ?? param
  })
}

/**
 * @module Override
 * @auther kaichao.feng
 * @description 搭配Param使用
 * @returns { MethodDecorator }
 * @author kaichao.feng
 */
export const Override = (): MethodDecorator => {
  return function (target, propertyName, descriptor: PropertyDescriptor) {
    OverrideEffect(target, propertyName, descriptor)
  }
}

/**
 * @module assignMetadata
 * @auther kaichao.feng
 * @returns { Record<string, any> }
 * @author kaichao.feng
 */
const assignMetadata = <TParamtype = any, TArgs = any>(
  args: TArgs,
  paramtype: TParamtype,
  index: number,
  data?: any,
  pipes?: Array<Core.Constructor<any> | Object>
): Record<string, any> => {
  return {
    ...args,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    [`${paramtype}:${index}`]: {
      index,
      data,
      pipes
    }
  }
}

/**
 * @method createParamDecorator
 * @auther kaichao.feng
 * @description this is @Param Helper Function
 */
const createParamDecorator =
  (paramtype: RouteParamtypes, metaDataType: MetaDataTypes) =>
  (data?: any, pipes?: Array<Core.Constructor<any> | Object>) =>
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
      MetadataKey.METADATATYPE,
      metaDataType,
      target.constructor,
      propertyKey
    )
    Reflect.defineMetadata(
      MetadataKey.ROUTE_ARGS_METADATA,
      assignMetadata(args, paramtype, index, paramData, pipes),
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
  ...pipes: Array<Core.Constructor<any> | Object>
) =>
  createParamDecorator(RouteParamtypes.PARAM, MetaDataTypes.PARAM)(
    property,
    pipes
  )

/**
 * @method Req
 * @auther kaichao.feng
 */
export const Req = (
  property?: string | string[],
  ...pipes: Array<Core.Constructor<any> | Object>
) =>
  createParamDecorator(RouteParamtypes.REQUEST, MetaDataTypes.REQUEST)(
    property,
    pipes
  )

export const Request = Req

/**
 * @method Body
 * @auther kaichao.feng
 */
export const Body = (
  property?: string | string[],
  ...pipes: Array<Core.Constructor<any> | Object>
) =>
  createParamDecorator(RouteParamtypes.BODY, MetaDataTypes.BODY)(
    property,
    pipes
  )

/**
 * @method Headers
 * @auther kaichao.feng
 */
export const Headers = (
  property?: string | string[],
  ...pipes: Array<Core.Constructor<any> | Object>
) =>
  createParamDecorator(RouteParamtypes.HEADERS, MetaDataTypes.HEADERS)(
    property,
    pipes
  )

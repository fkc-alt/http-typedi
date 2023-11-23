/* eslint-disable @typescript-eslint/ban-types */
import { MetaDataTypes, MetadataKey, RouteParamtypes } from '../../enums'
import { isArray, isFunction, isString } from '../../helper'
import {
  Constructor,
  RouteParamMetadata
} from '../../interfaces/core.interface'
import { HttpArgumentsHost } from '../core/interfaces/create-route-param-decorator.interface'

/**
 * @param { Object } target
 * @param { string } propertyName
 * @returns { RouteParamMetadata[] }
 * @author kaichao.feng
 */
export const getInjectValues = (
  target: Object,
  propertyName: string
): RouteParamMetadata[] => {
  const data: Record<string, any> =
    Reflect.getMetadata(
      MetadataKey.ROUTE_ARGS_METADATA,
      target.constructor,
      propertyName
    ) || {}
  const values: RouteParamMetadata[] = (Object.values(data) || []).sort(
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
 * @param { RouteParamMetadata[] } values
 * @param { any[] } args
 * @returns { any[] }
 * @author kaichao.feng
 */
export const OverrideReqEffect = (
  values: RouteParamMetadata[],
  args: any[]
) => {
  const executionContext: {
    switchToHttp(): Pick<HttpArgumentsHost, 'getRequest'>
  } = {
    switchToHttp() {
      return {
        getRequest() {
          return args[0]
        }
      }
    }
  }

  return args.map((param, index) => {
    const item = values.find(_ => _.index === index)
    if (item?.data) {
      const registerClasses = item?.pipes?.map((target: any) =>
        isFunction(target) ? new (<Constructor<any>>target)() : target
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
        return item?.factory?.(item.data, executionContext) ?? _param
      }
      registerClasses?.forEach(target => {
        param[<string>item.data] =
          target?.transform?.(param[<string>item.data]) ??
          (param[<string>item.data] || target.defaultValue)
      })
      return (
        item?.factory?.(item.data, executionContext) ??
        param?.[<string>item.data] ??
        void 0
      )
    }
    return item?.factory?.(void 0, executionContext) ?? param
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
  pipes?: Array<Constructor<any> | Object>
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
  (data?: any, pipes?: Array<Constructor<any> | Object>) =>
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
  ...pipes: Array<Constructor<any> | Object>
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
  ...pipes: Array<Constructor<any> | Object>
) =>
  createParamDecorator(RouteParamtypes.REQUEST, MetaDataTypes.REQUEST)(
    property,
    pipes
  )

export const Request = Req

/**
 * @method Res
 * @auther kaichao.feng
 */
export const Res = (
  property?: string | string[],
  ...pipes: Array<Constructor<any> | Object>
) =>
  createParamDecorator(RouteParamtypes.RESPONSE, MetaDataTypes.RESPONSE)(
    property,
    pipes
  )

export const Response = Res

/**
 * @method Body
 * @auther kaichao.feng
 */
export const Body = (
  property?: string | string[],
  ...pipes: Array<Constructor<any> | Object>
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
  ...pipes: Array<Constructor<any> | Object>
) =>
  createParamDecorator(RouteParamtypes.HEADERS, MetaDataTypes.HEADERS)(
    property,
    pipes
  )

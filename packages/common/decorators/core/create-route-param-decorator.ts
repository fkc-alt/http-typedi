/* eslint-disable @typescript-eslint/ban-types */
import { MetaDataTypes, MetadataKey, RouteParamtypes } from '../../enums'
import { isArray, isString } from '../../helper'
import { Constructor } from '../../interfaces/core'
import {
  CustomParamFactory,
  ExecutionContext
} from './interfaces/create-route-param-decorator.interface'
export type { CustomParamFactory, ExecutionContext }

const assignCustomParameterMetadata = <TParamtype = any, TArgs = any>(
  args: TArgs,
  paramtype: TParamtype,
  index: number,
  factory: CustomParamFactory,
  data?: any,
  ...pipes: Array<Constructor<any> | Object>
) => {
  return {
    ...args,
    [`${paramtype}${MetadataKey.CUSTOM_ROUTE_ARGS_METADATA}:${index}`]: {
      index,
      factory,
      data,
      pipes
    }
  }
}

export const createParamDecorator = (factory: CustomParamFactory) => {
  return (
    data?: any,
    ...pipes: Array<Constructor<any> | Object>
  ): ParameterDecorator => {
    return (target, propertyKey, index) => {
      const args =
        Reflect.getMetadata(
          MetadataKey.ROUTE_ARGS_METADATA,
          target.constructor,
          propertyKey!
        ) || {}
      const hasParamData = isString(data) || isArray(data)
      const paramData = hasParamData ? data : void 0
      Reflect.defineMetadata(
        MetadataKey.METADATATYPE,
        MetaDataTypes.CUSTOMARGS,
        target.constructor,
        propertyKey!
      )
      Reflect.defineMetadata(
        MetadataKey.ROUTE_ARGS_METADATA,
        assignCustomParameterMetadata(
          args,
          RouteParamtypes.CUSTOMPARAM,
          index,
          factory,
          paramData,
          ...pipes
        ),
        target.constructor,
        propertyKey!
      )
    }
  }
}

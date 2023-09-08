import { ValidationError, validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { Constructor, flattenErrorList } from '../../../core'
import { MetadataKey } from '../../../enums'

export const getDataTransferObject = (
  target: Object,
  propertyKey: string | symbol
): Constructor[] => {
  return (
    Reflect.getMetadata(
      MetadataKey.PARAMTYPES_METADATA,
      target,
      propertyKey
    )?.filter((target: any) => target.name !== 'Object') ?? []
  )
}

export const getErrorMessage = (
  dataTransferObject: Array<Constructor<any>>,
  target: Object,
  params: Record<string, any>
): ValidationError[] => {
  return dataTransferObject.reduce(
    (prev: ValidationError[], target) => [
      ...prev,
      ...validateSync(plainToInstance(target, params))
    ],
    []
  )
}

export const DTOValidate = (
  errors: ValidationError[],
  message?: string | ((validationError: ValidationError[]) => any)
) => {
  if (errors.length) {
    if (!message) {
      const messages = flattenErrorList(errors)
      console.error(messages)
    } else if (typeof message === 'string') {
      console.error(message)
    } else {
      console.error(message?.(errors) ?? errors)
    }
  }
}

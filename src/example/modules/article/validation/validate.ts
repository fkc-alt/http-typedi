/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { flattenErrorList } from '../../../../http-typedi'
import { ValidationError } from 'class-validator'

export const validationErrorMessage = (validationError: ValidationError[]) => {
  const messages = flattenErrorList(validationError)
  console.error(validationError, 'validationError', messages)
  return validationError
}

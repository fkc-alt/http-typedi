/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator
} from 'class-validator'

@ValidatorConstraint({ name: 'validate', async: false })
export class ContentLength implements ValidatorConstraintInterface {
  validate(
    text: string,
    validationArguments: ValidationArguments
  ): Promise<boolean> | boolean {
    return (
      text.length > validationArguments.constraints[0] &&
      text.length < validationArguments.constraints[1]
    ) // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!<br/>test class validator Custom Valid RequestMethod decorator'
  }
}

export function IsLongerThan(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log(value, args)
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value.length > relatedValue.length
          ) // you can return a Promise<boolean> here as well, if you want to make async validation
        },
        defaultMessage(validationArguments) {
          return 'Text must be longer than the title'
        }
      }
    })
  }
}

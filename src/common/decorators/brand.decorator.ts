/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function AtLeastOne(
  RequiredFields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (constructor: Function) {
    registerDecorator({
      target: constructor,
      propertyName: '',
      options: validationOptions,
      constraints: RequiredFields,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return RequiredFields.some((field) => args.object[field]);
        },
        defaultMessage(args: ValidationArguments) {
          return `At least one of the required fields ${RequiredFields.join(', ')} is missing`;
        },
      },
    });
  };
}

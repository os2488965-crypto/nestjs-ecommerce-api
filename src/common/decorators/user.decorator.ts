import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'matchFields', async: false })
export class MatchFields implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    console.log({ value, args });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return value === args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} not match with ${args.constraints[0]}`;
  }
}
export function IsMatch(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,

      options: validationOptions,
      constraints: constraints,
      validator: MatchFields,
    });
  };
}

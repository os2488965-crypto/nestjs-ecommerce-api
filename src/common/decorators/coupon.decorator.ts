/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'couponValidator', async: false })
export class CouponValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as any;
    const fromDate = new Date(obj.fromDate);
    const toDate = new Date(obj.toDate);
    const now = new Date();

    return fromDate >= now && fromDate < toDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'fromDate should be greater than or equal to now and less than toDate';
  }
}

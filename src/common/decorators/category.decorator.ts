/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'IdsMongo', async: false })
export class IdsMongo implements ValidatorConstraintInterface {
  validate(ids: string[], args: ValidationArguments) {
    return ids.filter((id) => Types.ObjectId.isValid(id)).length == ids.length;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Ids not valid';
  }
}

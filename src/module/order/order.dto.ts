import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { PaymentMethodEnum } from 'src/common/enums/order.enum';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsString()
  @IsOptional()
  couponCode?: string;
}

export class paramDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: Types.ObjectId;
}

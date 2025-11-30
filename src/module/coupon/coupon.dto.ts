import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { CouponValidator } from 'src/common/decorators/coupon.decorator';

export class createCouponDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @Validate(CouponValidator)
  fromDate: Date;

  @IsDateString()
  @IsNotEmpty()
  toDate: Date;
}

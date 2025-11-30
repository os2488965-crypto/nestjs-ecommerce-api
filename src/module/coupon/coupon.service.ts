import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CouponRepo, HUserDocument } from 'src/DB';
import { createCouponDto } from './coupon.dto';
// import { S3Service } from '../../common/service/s3.service';

@Injectable()
export class CouponService {
  constructor(private readonly CouponRepo: CouponRepo) {}

  async createCoupon(body: createCouponDto, user: HUserDocument) {
    const { code, amount, fromDate, toDate } = body;

    const couponExist = await this.CouponRepo.findOne({
      filter: { code: code.toLowerCase() },
    });
    if (couponExist) {
      throw new ConflictException('coupon already exist');
    }

    const Coupon = await this.CouponRepo.create({
      code,
      amount,
      fromDate,
      toDate,
      createdBy: user._id,
    });
    if (!Coupon) {
      throw new InternalServerErrorException('coupon not created');
    }
    return Coupon;
  }
}

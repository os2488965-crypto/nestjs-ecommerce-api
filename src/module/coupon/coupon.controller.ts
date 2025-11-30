import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators';

import type { HUserDocument } from 'src/DB';
import { createCouponDto } from './coupon.dto';
import { RoleEnum, TokenTypeEnum } from 'src/common/enums';
import { CouponService } from './coupon.service';

@Controller('coupon')
export class CouponController {
  constructor(private readonly CouponService: CouponService) {}

  @Auth({
    role: [RoleEnum.ADMIN],
    typeToken: TokenTypeEnum.access,
  })
  @Post()
  async createCoupon(
    @Body() createCoupon: createCouponDto,
    user: HUserDocument,
  ) {
    const Coupon = await this.CouponService.createCoupon(createCoupon, user);
    return { message: 'done', Coupon };
  }
}

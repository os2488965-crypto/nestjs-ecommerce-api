import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service';
import { JwtService } from '@nestjs/jwt';
import {
  Coupon,
  CouponRepo,
  CouponSchema,
  User,
  UserRepo,
  UserSchema,
} from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Coupon.name, schema: CouponSchema },
    ]),
  ],
  controllers: [CouponController],
  providers: [CouponService, TokenService, JwtService, UserRepo, CouponRepo],
})
export class couponModule {}

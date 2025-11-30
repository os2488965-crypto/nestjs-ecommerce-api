import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DBRepo } from './db.repo';
import { Model } from 'mongoose';
import { Coupon } from '../models';

@Injectable()
export class CouponRepo extends DBRepo<Coupon> {
  constructor(
    @InjectModel(Coupon.name) protected readonly model: Model<Coupon>,
  ) {
    super(model);
  }
}

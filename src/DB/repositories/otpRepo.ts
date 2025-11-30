import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DBRepo } from './db.repo';
import { Otp } from '../models';

@Injectable()
export class otpRepo extends DBRepo<Otp> {
  constructor(
    @InjectModel(Otp.name)
    protected readonly model: Model<Otp>,
  ) {
    super(model);
  }

  deleteOne() {
    throw new Error('Method not implemented.');
  }
}

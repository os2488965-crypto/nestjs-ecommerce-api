import { Injectable } from '@nestjs/common';
import { DBRepo } from './db.repo';
import { Otp } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OtpRepo extends DBRepo<Otp> {
  deleteOne() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Otp.name)
    protected readonly model: Model<Otp>,
  ) {
    super(model);
  }
}

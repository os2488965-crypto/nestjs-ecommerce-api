import { Injectable } from '@nestjs/common';
import { DBRepo } from './db.repo';
import { HUserDocument, User } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepo extends DBRepo<HUserDocument> {
  constructor(
    @InjectModel(User.name)
    protected readonly model: Model<HUserDocument>,
  ) {
    super(model);
  }
}

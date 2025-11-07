import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { DBRepo } from '../repositories';
import { HUserDocument, User } from '../models/user.model';
@Injectable()
export class UserRepo extends DBRepo<HUserDocument> {
  constructor(
    @InjectModel(User.name)
    protected readonly model: Model<HUserDocument>,
  ) {
    super(model);
  }
}

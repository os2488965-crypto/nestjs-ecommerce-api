import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DBRepo } from './db.repo';
import { Model } from 'mongoose';
import { Category } from '../models';

@Injectable()
export class categoryRepo extends DBRepo<Category> {
  constructor(
    @InjectModel(Category.name) protected readonly model: Model<Category>,
  ) {
    super(model);
  }
}

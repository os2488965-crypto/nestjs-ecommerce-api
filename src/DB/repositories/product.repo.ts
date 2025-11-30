import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DBRepo } from './db.repo';
import { Model } from 'mongoose';
import { product } from '../models';

@Injectable()
export class productRepo extends DBRepo<product> {
  constructor(
    @InjectModel(product.name) protected readonly model: Model<product>,
  ) {
    super(model);
  }
}

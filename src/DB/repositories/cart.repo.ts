import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DBRepo } from './db.repo';
import { Model } from 'mongoose';
import { Cart } from '../models';

@Injectable()
export class CartRepo extends DBRepo<Cart> {
  constructor(@InjectModel(Cart.name) protected readonly model: Model<Cart>) {
    super(model);
  }
}

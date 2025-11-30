import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { DBRepo } from './db.repo';
import { Order } from '../models';

@Injectable()
export class OrderRepo extends DBRepo<Order> {
  constructor(@InjectModel(Order.name) protected readonly model: Model<Order>) {
    super(model);
  }
}

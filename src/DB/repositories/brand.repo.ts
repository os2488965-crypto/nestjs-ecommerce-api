import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DBRepo } from './db.repo';
import { Model } from 'mongoose';
import { Brand } from '../models';

@Injectable()
export class BrandRepo extends DBRepo<Brand> {
  constructor(@InjectModel(Brand.name) protected readonly model: Model<Brand>) {
    super(model);
  }
}

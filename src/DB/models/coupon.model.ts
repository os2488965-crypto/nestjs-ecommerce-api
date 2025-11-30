/* eslint-disable @typescript-eslint/require-await */

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Coupon {
  @Prop({
    required: true,
    unique: true,
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 20,
    lowercase: true,
  })
  code: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Date })
  fromDate: Date;

  @Prop({ required: true, type: Date })
  toDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User', required: true }] })
  usedBy: Types.ObjectId[];

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;
  static amount: number;
  static _id: unknown | ObjectId;
  static id: string | undefined;
}
export type HCouponDocument = HydratedDocument<Coupon>;
export const CouponSchema = SchemaFactory.createForClass(Coupon);
CouponSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  const update = this.getUpdate() as UpdateQuery<Coupon>;
  if (update.name) {
    update.slug = slugify(update.name as string, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
  next();
});

export const CouponModel1 = MongooseModule.forFeature([
  {
    name: Coupon.name,
    schema: CouponSchema,
  },
]);

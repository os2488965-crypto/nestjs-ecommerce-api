/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
import { string } from 'zod';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class product {
  @Prop({
    required: true,
    type: String,
    minlength: 3,
    maxlength: 500,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, { replacement: '-', lower: true, trim: true });
    },
  })
  slug: string;

  @Prop({
    required: true,
    type: String,
    minlength: 10,
    maxlength: 100000,
    trim: true,
  })
  description: string;

  @Prop({ required: true, type: String })
  mainImage: string;
  @Prop({ type: [string] })
  subImages: string[];
  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: Number, min: 1, max: 100 })
  discount: number;
  @Prop({ type: Number, min: 1 })
  quantity: number;

  @Prop({ type: Number })
  stock: number;
  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brand: Types.ObjectId;
  @Prop({ type: Number })
  rateNum: number;
  @Prop({ type: Number })
  rateAvg: number;
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;
}
export type HproductDocument = HydratedDocument<product>;
export const productSchema = SchemaFactory.createForClass(product);
productSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  const update = this.getUpdate() as UpdateQuery<product>;
  if (update.name) {
    update.slug = slugify(update.name as string, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
  next();
});

export const productModel1 = MongooseModule.forFeature([
  {
    name: product.name,
    schema: productSchema,
  },
]);

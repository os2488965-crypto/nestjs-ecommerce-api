/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import slugify from 'slugify';
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Brand {
  @Prop({
    required: true,
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
    unique: true,
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
    minlength: 3,
    maxlength: 10,
    trim: true,
  })
  slogan: string;

  @Prop({ required: true, type: String })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;
}
export type HBrandDocument = HydratedDocument<Brand>;
export const BrandSchema = SchemaFactory.createForClass(Brand);
BrandSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
  const update = this.getUpdate() as UpdateQuery<Brand>;
  if (update.name) {
    update.slug = slugify(update.name as string, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
  next();
});

export const BrandModel1 = MongooseModule.forFeature([
  {
    name: Brand.name,
    schema: BrandSchema,
  },
]);

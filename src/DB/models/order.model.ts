import { Schema, Prop, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  OrderStatusEnum,
  PaymentMethodEnum,
} from 'src/common/enums/order.enum';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cart: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Coupon' })
  coupon?: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, enum: PaymentMethodEnum, required: true })
  paymentMethod: PaymentMethodEnum;

  @Prop({ type: String, enum: OrderStatusEnum, required: true })
  status: OrderStatusEnum;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  })
  arrivesAt: Date;

  @Prop({ type: String })
  paymentIntent: string;

  @Prop({
    type: {
      paidAt: Date,
      deliveredAt: Date,
      deliveredBy: { type: Types.ObjectId, ref: 'User' },
      canceledAt: Date,
      canceledBy: { type: Types.ObjectId, ref: 'User' },
      refundedAt: Date,
      refundedBy: { type: Types.ObjectId, ref: 'User' },
    },
  })
  orderChanges?: Record<string, any>;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: OrderSchema,
  },
]);

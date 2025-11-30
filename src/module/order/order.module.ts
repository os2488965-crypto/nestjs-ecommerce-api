import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service';
import { JwtService } from '@nestjs/jwt';
import {
  Cart,
  CartRepo,
  CartSchema,
  Coupon,
  CouponRepo,
  CouponSchema,
  OrderRepo,
  OrderSchema,
  product,
  productRepo,
  productSchema,
  User,
  UserRepo,
  UserSchema,
} from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from '../../DB/models/order.model';
import { StripeService } from 'src/common/service/stripe.service';
// import { S3Service } from '../../common/service/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: product.name, schema: productSchema },
      { name: Coupon.name, schema: CouponSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    TokenService,
    JwtService,
    UserRepo,
    OrderRepo,
    CartRepo,
    productRepo,
    CouponRepo,
    StripeService,
  ],
})
export class orderModule {}

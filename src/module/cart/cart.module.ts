import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TokenService } from 'src/common/service';
import {
  Brand,
  BrandRepo,
  BrandSchema,
  Cart,
  CartRepo,
  CartSchema,
  product,
  productRepo,
  productSchema,
  User,
  UserRepo,
  UserSchema,
} from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: product.name, schema: productSchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    TokenService,
    UserRepo,
    CartRepo,
    productRepo,
    BrandRepo,
    JwtService,
  ],
})
export class CartModule {}

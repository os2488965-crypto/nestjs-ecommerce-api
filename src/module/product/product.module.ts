import { Module } from '@nestjs/common';
import { productController } from './product.controller';
import { productService } from './product.service';
import { TokenService } from 'src/common/service';
import { JwtService } from '@nestjs/jwt';
import { Brand, BrandSchema } from 'src/DB/models/brand.model';
import {
  Category,
  CategorySchema,
  product,
  productRepo,
  productSchema,
  User,
  UserRepo,
  UserSchema,
} from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { categoryRepo } from '../../DB/repositories/category.repo';
import { BrandRepo } from '../../DB/repositories/brand.repo';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: product.name, schema: productSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
  ],
  controllers: [productController],
  providers: [
    productService,
    TokenService,
    JwtService,
    UserRepo,
    categoryRepo,
    BrandRepo,
    productRepo,
  ],
})
export class productModule {}

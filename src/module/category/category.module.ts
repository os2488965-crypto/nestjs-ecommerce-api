import { Module } from '@nestjs/common';
import { categoryController } from './category.controller';
import { categoryService } from './category.service';
import { TokenService } from 'src/common/service';
import { JwtService } from '@nestjs/jwt';
import {
  Brand,
  BrandRepo,
  BrandSchema,
  Category,
  categoryRepo,
  CategorySchema,
  User,
  UserRepo,
  UserSchema,
} from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [categoryController],
  providers: [
    categoryService,
    TokenService,
    JwtService,
    UserRepo,
    categoryRepo,
    BrandRepo,
  ],
})
export class categoryModule {}

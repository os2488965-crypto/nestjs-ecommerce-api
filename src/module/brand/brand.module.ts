import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TokenService } from 'src/common/service';
import { JwtService } from '@nestjs/jwt';
import {
  Brand,
  BrandRepo,
  BrandSchema,
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
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService, TokenService, JwtService, UserRepo, BrandRepo],
})
export class BrandModule {}

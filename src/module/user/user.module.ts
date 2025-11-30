import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from '../user.controller';
import { TokenService } from 'src/common/service/token.service';
import { OtpModule } from '../otp.module';
import { User, UserRepo, UserSchema } from 'src/DB';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OtpModule,
  ],
  controllers: [UserController],
  providers: [UserService, TokenService, JwtService, UserRepo],
  exports: [UserService, UserRepo],
})
export class UserModule {}

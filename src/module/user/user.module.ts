import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { OtpRepo, UserRepo, OtpModel, UserModel } from 'src/DB';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/service/token.service';
import { UserController } from '../user.controller';
// import { AuthenticationMiddleware, tokenType } from 'src/common/middleware';

@Module({
  imports: [UserModel, OtpModel],
  controllers: [UserController],
  providers: [UserRepo, OtpRepo, JwtService, UserService, TokenService],
  exports: [],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(tokenType(), AuthenticationMiddleware)
  //     // .exclude(
  //     //   { path: "users/login", method: RequestMethod.POST },
  //     // )
  //     .forRoutes({ path: 'users/*demo', method: RequestMethod.ALL });
  // }
}

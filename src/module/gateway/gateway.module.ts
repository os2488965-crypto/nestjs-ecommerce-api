import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRepo, UserSchema } from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketGateway } from './socket.gateway';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [SocketGateway, TokenService, JwtService, UserRepo],
  exports: [],
})
export class GatewayModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './module/user/user.module';
import { BrandModule } from './module/brand/brand.module';
import { categoryModule } from './module/category/category.module';
import { productModule } from './module/product/product.module';
import { CartModule } from './module/cart/cart.module';
import { couponModule } from './module/coupon/coupon.module';
import { orderModule } from './module/order/order.module';
import { GatewayModule } from './module/gateway/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),
    CacheModule.register(
      isGlobal: true,
    ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUrl = configService.get<string>('MONGO_URL');
        console.log('MONGO_URL from ConfigService:', mongoUrl);
        return {
          uri: mongoUrl,
        };
      },
    }),
    UserModule,
    BrandModule,
    categoryModule,
    productModule,
    CartModule,
    couponModule,
    orderModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

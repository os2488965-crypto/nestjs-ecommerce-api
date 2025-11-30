import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { otpRepo } from 'src/DB';
import { Otp, OtpSchema } from 'src/DB/models/otp.model';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    BrandModule,
  ],
  providers: [otpRepo],
  exports: [otpRepo],
})
export class OtpModule {}

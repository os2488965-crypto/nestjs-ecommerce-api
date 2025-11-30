/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OtpTypeEnum } from 'src/common/enums';
import { eventEmitter } from 'src/common/utils';
import GenerateHash from 'src/common/utils/generate-hash';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, type: String, trim: true })
  code: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ required: true, type: String, trim: true, enum: OtpTypeEnum })
  type: OtpTypeEnum;

  @Prop({ type: Date, required: true })
  expireAt: Date;
}

export type HOtpDocument = HydratedDocument<Otp>;
export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

OtpSchema.pre(
  'save',
  async function (
    this: HOtpDocument & { is_new: boolean; plainCode: string },
    next,
  ) {
    if (this.isModified('code')) {
      this.plainCode = this.code;
      this.is_new = this.isNew;
      this.code = GenerateHash({ plainText: this.code });
      await this.populate([{ path: 'createdBy', select: 'email' }]);
    }
    next();
  },
);

OtpSchema.post('save', function (doc, next) {
  const that = this as HOtpDocument & { is_new: boolean; plainCode: string };
  if (that.is_new) {
    eventEmitter.emit(doc.type, {
      otp: that.plainCode,
      email: (doc.createdBy as any).email,
    });
  }
  next();
});
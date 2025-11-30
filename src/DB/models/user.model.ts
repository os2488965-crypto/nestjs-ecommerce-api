/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { RoleEnum } from 'src/common/enums/role.enum';
import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserGender, UserProvider } from 'src/common/enums';
import { HOtpDocument } from './otp.model';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  })
  fName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  })
  lName: string;

  @Prop({ type: String, unique: true, trim: true })
  userName: string;

  @Virtual({
    get() {
      return `${this.fName} ${this.lName}`;
    },
  })
  fullName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  password: string;

  @Prop({ type: Number, min: 18, max: 60, required: true })
  age: number;

  @Prop({ type: Boolean, default: false })
  confirmed: boolean;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Prop({ type: String, enum: UserGender, default: UserGender.MALE })
  gender: UserGender;

  @Prop({ type: String, enum: UserProvider, default: UserProvider.LOCAL })
  provider: UserProvider;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  wishList: Types.ObjectId[];
  @Prop({ type: Date, default: Date.now })
  changeCredentialAt: Date;

  @Virtual()
  Otp: HOtpDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('Otp', {
  ref: 'Otp',
  localField: '_id',
  foreignField: 'createdBy',
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.changeCredentialAt = new Date();
  next();
});

export type HUserDocument = HydratedDocument<User>;
export type userDocument = HydratedDocument<User>;

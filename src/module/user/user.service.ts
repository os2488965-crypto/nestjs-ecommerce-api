/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Options,
} from '@nestjs/common';
import { OtpTypeEnum, RoleEnum, UserGender } from 'src/common/enums';
import { OtpRepo, UserRepo } from 'src/DB';
import { confirmEmailDto, loginDto, reSendOtpDto, signupDto } from './user.dto';
import { emailTemplate, generateOTP, sendEmail } from 'src/common/service';
import { Types } from 'mongoose';
import { CompareHash } from 'src/common/utils/generate-hash';
import { TokenService } from 'src/common/service/token.service';

@Injectable()
export class UserService {
  [x: string]: any;
  // confirmEmail(body: confirmEmailDto) {
  //   throw new Error('Method not implemented.');
  // }
  constructor(
    private readonly userRepo: UserRepo,
    private readonly otpRepo: OtpRepo,
    private tokenService: TokenService,
  ) {}
  private async sendOtp(userId: Types.ObjectId) {
    const otp = generateOTP();
    await this.otpRepo.create({
      code: otp.toString(),

      createdBy: userId,
      type: OtpTypeEnum.CONFIRM_EMAIL,
      expireAt: new Date(Date.now() + 60 * 1000),
    });
  }
  async signUp(body: signupDto) {
    const { email, password, age, fName, lName, userName, gender } = body;
    const userExist = await this.userRepo.findOne({ email });

    if (userExist) {
      throw new ConflictException('User already exist');
    }

    const user = await this.userRepo.create({
      email,
      password,
      age,
      fName,
      lName,
      userName,
      gender: gender ? (gender as UserGender) : UserGender.MALE,
    });

    if (!user) {
      throw new ForbiddenException('User not created');
    }
    await sendEmail({
      to: email,
      subject: 'confirm email',
      html: emailTemplate('12345', 'confirmEmail'),
    });
    await this.otpRepo.create({
      code: '12345',
      type: OtpTypeEnum.CONFIRM_EMAIL,
      createdBy: user._id,
      expireAt: new Date(Date.now() + 60 * 1000),
    });
    await this.sendOtp(user._id);
    return user;
  }
  async reSendOtp(body: reSendOtpDto) {
    const { email } = body;
    const user = await this.userRepo.findOne({
      filter: {
        email,
        confirmed: { $exists: false },
      },
      options: {
        populate: {
          path: 'otp',
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not exist');
    }
    // if ((user.Otp as any).length > 0) {
    //   throw new BadRequestException('Otp already sent');
    // }

    await this.sendOtp(user._id);

    return { message: 'Otp sent successfully' };
    // return user;
  }
  async confirmEmail(body: confirmEmailDto) {
    const { email, code } = body;
    const user = await this.userRepo.findOne({
      filter: {
        email,
        confirmed: { $exists: false },
      },
      options: {
        populate: {
          path: 'otp',
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not exist');
    }

    // if ( await!CompareHash({ plainText: code, hash: (user.otp as any)[0].code })) {
    //   throw new BadRequestException('Invalid Otp');
    // }

    user.confirmed = true;
    await user.save();
    // this.otpRepo.deleteOne({ filter: { createdBy: user._id } });

    return { message: 'Email confirmed successfully' };
  }

  async login(body: loginDto) {
    const { email, password } = body;
    const user = await this.userRepo.findOne({
      filter: {
        email,
        confirmed: { $exists: true },
      },
    });

    if (!user) {
      throw new BadRequestException('User not exist');
    }

    if (!(await CompareHash({ plainText: password, hash: user.password }))) {
      throw new BadRequestException('Invalid password');
    }

    const access_token = await this.tokenService.GenerateToken({
      payload: { email, userId: user._id },
      options: {
        secret:
          user.role === RoleEnum.USER
            ? process.env.SIGNATURE_USER_TOKEN!
            : process.env.SIGNATURE_ADMIN_TOKEN!,
        expiresIn: '1d',
      },
    });

    const refresh_token = await this.JwtService.signAsync(
      { userId: user._id },
      {
        secret:
          user.role === RoleEnum.USER
            ? process.env.REFRESH_SIGNATURE_USER_TOKEN!
            : process.env.REFRESH_SIGNATURE_ADMIN_TOKEN!,
        expiresIn: '1y',
      },
    );

    return { message: 'done', access_token, refresh_token };
  }
}

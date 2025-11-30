/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/require-await */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { TokenTypeEnum } from '../enums/token.enum';
import { Types } from 'mongoose';
import { UserRepo } from 'src/DB';

@Injectable()
export class TokenService {
  signAsync(
    arg0: { userId: Types.ObjectId },
    arg1: { secret: string; expiresIn: string },
  ) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly JwtService: JwtService,
    private UserRepo: UserRepo,
  ) {}

  GenerateToken = async (
    {
      payload,
      options,
    }: {
      payload: object;
      options?: JwtSignOptions;
    },
    // p0: { email: string; userId: Types.ObjectId },
    // Options: (path?: string | string[]) => MethodDecorator,
    // p1: { secret: string; expiresIn: string },
  ): Promise<string> => {
    return this.JwtService.signAsync(payload, options);
  };

  VerifyToken = async ({
    token,
    options,
  }: {
    token: string;
    options: JwtVerifyOptions;
  }): Promise<JwtPayload> => {
    return this.JwtService.verifyAsync(token, options);
  };

  Getsignature = async (
    tokenType: TokenTypeEnum = TokenTypeEnum.access,
    prefix: string,
  ) => {
    if (tokenType === TokenTypeEnum.access) {
      if (prefix === process.env.BEARER_USER) {
        return process.env.SIGNATURE_USER_TOKEN;
      } else if (prefix === process.env.BEARER_ADMIN) {
        return process.env.SIGNATURE_ADMIN_TOKEN;
      }
    }

    if (tokenType === TokenTypeEnum.refresh) {
      if (prefix === process.env.BEARER_USER) {
        return process.env.REFRESH_SIGNATURE_USER_TOKEN;
      } else if (prefix === process.env.BEARER_ADMIN) {
        return process.env.REFRESH_SIGNATURE_ADMIN_TOKEN;
      }
    }
  };

  DecodedTokenAndFetchUser = async (token: string, signature: string) => {
    const decoded = await this.VerifyToken({
      token,
      options: { secret: signature },
    });
    if (!decoded?.email) {
      throw new BadRequestException('InValid Token');
    }

    const user = await this.UserRepo.findOne({ email: decoded?.email });
    if (!user) {
      throw new BadRequestException('user not exist');
    }
    if (!user?.confirmed) {
      throw new BadRequestException('please confirm email your email first');
    }
    // if (await this.UserRepo.findOne({ tokenId: decoded?.jti })) {
    //   throw new BadRequestException('Token has been revoked');
    // }

    // if (user.changeCredentials?.getTime()! > decoded?.iat! * 1000) {
    //   throw new BadRequestException(
    //     'Credentials have been changed, please log in again',
    //   );
    // }

    return { decoded, user };
  };
}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import type { Response, NextFunction } from 'express';
import { TokenService } from '../service';
import { TokenTypeEnum } from '../enums/token.enum';
import { UserWithRequest } from '../interfaces';

export const tokenType = (typeToken: TokenTypeEnum = TokenTypeEnum.access) => {
  return (req: UserWithRequest, res: Response, next: NextFunction) => {
    req.tokenType = typeToken;
    next();
  };
};

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: UserWithRequest, res: Response, next: NextFunction) {
    const authorization = req.headers['Authorization'];
    const [prefix, token] = authorization?.split(' ') || [];
    if (!prefix || !token) {
      throw new BadRequestException('Token not found');
    }

    const signature = await this.tokenService.Getsignature(
      prefix,
      TokenTypeEnum.access,
    );
    if (!signature) {
      throw new BadRequestException('Invalid Signature');
    }

    const { user, decoded } = await this.tokenService.DecodedTokenAndFetchUser(
      token,
      signature,
    );

    req.user = user;
    req.decoded = decoded;
    return next();
  }
}

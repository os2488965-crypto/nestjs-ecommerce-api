/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../service';
import { TokenTypeEnum } from '../enums';
import { tokenType } from '../middleware';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: any;
    let authorization: string = '';
    const typetoken = this.reflector.get<TokenTypeEnum>(
      'TypeToken',
      context.getHandler(),
    );

    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
      authorization = req.headers.authorization;
    }
    // else if (context.getType() === "ws") {
    // }
    // else if (context.getType() === "rpc") {
    // }

    try {
      const [prefix, token] = authorization?.split(' ') || [];
      if (!prefix || !token) {
        throw new BadRequestException('Token not found');
      }

      const signature = await this.tokenService.Getsignature(typetoken, prefix);
      if (!signature) {
        throw new BadRequestException('Invalid Signature');
      }

      const { user, decoded } =
        await this.tokenService.DecodedTokenAndFetchUser(token, signature);

      req.user = user;
      req.decoded = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Unauthorized');
    }
  }
}

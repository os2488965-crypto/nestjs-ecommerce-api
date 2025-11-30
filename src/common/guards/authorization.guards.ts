/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enums';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();
      const access_roles: RoleEnum[] = this.reflector.get(
        'access_roles',
        context.getHandler(),
      );

      if (!access_roles.includes(req.user.role)) {
        throw new UnauthorizedException();
      }

      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

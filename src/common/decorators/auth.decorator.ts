import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleEnum, TokenTypeEnum } from '../enums';
import { Token } from './token.decorator';
import { Role } from './role.decorator';
import { AuthenticationGuard, AuthorizationGuard } from '../guards';

export function Auth({
  typeToken = TokenTypeEnum.access,
  role = [RoleEnum.USER],
}: {
  typeToken?: TokenTypeEnum;
  role?: RoleEnum[];
} = {}) {
  return applyDecorators(
    Token(typeToken),
    Role(role),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}

import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums';

export const Role = (access_roles: RoleEnum[]) => {
  return SetMetadata('access_roles', access_roles);
};

import { SetMetadata } from '@nestjs/common';
import { TokenTypeEnum } from '../enums';

export const Token = (typetoken: TokenTypeEnum = TokenTypeEnum.access) => {
  return SetMetadata('TypeToken', typetoken);
};

import { JwtPayload } from 'jsonwebtoken';
import { HUserDocument } from 'src/DB';
import { TokenTypeEnum } from '../enums';

export interface UserWithRequest extends Request {
  typeToken(prefix: any, typeToken: any): unknown;
  user: HUserDocument;
  decoded: JwtPayload;
  tokenType?: TokenTypeEnum;
}

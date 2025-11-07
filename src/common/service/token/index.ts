/* eslint-disable @typescript-eslint/require-await */
import { JwtPayload, sign, SignOptions, verify } from 'jsonwebtoken';

export const GenerateToken = async ({
  payload,
  signature,
  options,
}: {
  payload: object;
  signature: string;
  options?: SignOptions;
}): Promise<string> => {
  return sign(payload, signature, options);
};

export const VerifyToken = async ({
  token,
  signature,
}: {
  token: string;
  signature: string;
}): Promise<JwtPayload> => {
  return verify(token, signature) as JwtPayload;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';

/**
 * Generate a random numeric OTP code (default 6 digits).
 */
export function generateOtpCode(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * Create a SHA-256 hex digest of the provided text.
 */

export async function CompareHash({
  plainText,
  hash,
}: {
  plainText: string;
  hash: string;
}) {
  return await bcrypt.compare(plainText, hash);
}

/**
 * Convenience function used in OTP model hooks.
 * If you call GenerateHash() without arguments it will:
 *  - create a numeric OTP (6 digits)
 *  - return the SHA-256 hash of that OTP
 * Use generateOtpAndHash() if you also need the plain OTP to send to the user.
 */

export function GenerateHash(_p0: { plainText: string }): string {
  const code = generateOtpCode(6);
  return hashString(code);
}

/**
 * Returns both plain OTP and its hash. Useful when you need to send the plain
 * OTP to user (email/SMS) and store only the hash in the DB.
 */
export function generateOtpAndHash(length = 6): { code: string; hash: string } {
  const code = generateOtpCode(length);
  const hash = hashString(code);
  return { code, hash };
}

/**
 * Verify whether a plain candidate matches the stored hash.
 */
export function verifyHash(candidate: string, storedHash: string): boolean {
  return hashString(candidate) === storedHash;
}

export default GenerateHash;
function hashString(code: string): string {
  throw new Error('Function not implemented.');
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // ✅ أضف هذا السطر

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

export function GenerateHash(_p0: { plainText: string }): string {
  const code = generateOtpCode(6);
  return hashString(code);
}

export function generateOtpAndHash(length = 6): { code: string; hash: string } {
  const code = generateOtpCode(length);
  const hash = hashString(code);
  return { code, hash };
}

export function verifyHash(candidate: string, storedHash: string): boolean {
  return hashString(candidate) === storedHash;
}

export default GenerateHash;

// ✅ الدالة المصلحة هنا
function hashString(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

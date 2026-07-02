import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);

  return `scrypt:${salt.toString("base64")}:${hash.toString("base64")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [algorithm, saltBase64, hashBase64] = storedHash.split(":");

  if (algorithm !== "scrypt" || !saltBase64 || !hashBase64) {
    return false;
  }

  const salt = Buffer.from(saltBase64, "base64");
  const expectedHash = Buffer.from(hashBase64, "base64");
  const actualHash = scryptSync(password, salt, expectedHash.length, SCRYPT_OPTIONS);

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedHash);
}

export function constantTimeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

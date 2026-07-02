import {
  getSessionSecret,
  SESSION_DURATION_MS,
  SESSION_VERSION,
} from "@/lib/auth/config";

interface SessionPayload {
  u: string;
  exp: number;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));

  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  return encodeBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function createSessionToken(username: string): Promise<string> {
  const payload: SessionPayload = {
    u: username,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const payloadEncoded = encodeBase64Url(JSON.stringify(payload));
  const signedContent = `${SESSION_VERSION}.${payloadEncoded}`;
  const signature = await signPayload(signedContent, getSessionSecret());

  return `${signedContent}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3 || parts[0] !== SESSION_VERSION) {
    return false;
  }

  const [, payloadEncoded, signature] = parts;
  const signedContent = `${SESSION_VERSION}.${payloadEncoded}`;

  try {
    const secret = getSessionSecret();
    const expectedSignature = await signPayload(signedContent, secret);

    if (!constantTimeEqual(signature, expectedSignature)) {
      return false;
    }

    const payload = JSON.parse(decodeBase64Url(payloadEncoded)) as SessionPayload;

    if (!payload.u || typeof payload.exp !== "number") {
      return false;
    }

    return Date.now() <= payload.exp;
  } catch {
    return false;
  }
}

export function getUsernameFromSessionToken(token: string): string | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(parts[1])) as SessionPayload;

    return payload.u ?? null;
  } catch {
    return null;
  }
}

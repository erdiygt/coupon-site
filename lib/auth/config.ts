const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const SESSION_VERSION = "v1";
const MIN_SESSION_SECRET_LENGTH = 32;

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function getSessionMaxAgeSeconds(): number {
  return Math.floor(SESSION_DURATION_MS / 1000);
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();

  if (!secret || secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new Error(
      "SESSION_SECRET must be set and at least 32 characters long."
    );
  }

  return secret;
}

export function getAdminUsername(): string {
  const username = process.env.ADMIN_USERNAME?.trim();

  if (!username) {
    throw new Error("ADMIN_USERNAME must be set.");
  }

  return username;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export { SESSION_COOKIE, SESSION_DURATION_MS, SESSION_VERSION };

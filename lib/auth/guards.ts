import {
  ADMIN_MUTATION_RATE_LIMIT,
  checkRateLimit,
} from "@/lib/security/rate-limit";
import {
  constantTimeCompare,
  verifyPassword,
} from "@/lib/auth/password";
import { getAdminUsername, getSessionCookieName, isProduction } from "@/lib/auth/config";
import { getUsernameFromSessionToken, verifySessionToken } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = getAdminUsername();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const plainPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!constantTimeCompare(username, expectedUsername)) {
    return false;
  }

  if (passwordHash) {
    return verifyPassword(password, passwordHash);
  }

  if (isProduction() || !plainPassword) {
    return false;
  }

  return constantTimeCompare(password, plainPassword);
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  return null;
}

export async function requireAdminMutation(
  request: Request,
): Promise<NextResponse | null> {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(
    `admin-mutation:${ip}`,
    ADMIN_MUTATION_RATE_LIMIT.maxRequests,
    ADMIN_MUTATION_RATE_LIMIT.windowMs,
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Çok fazla istek. ${rateLimit.retryAfterSeconds} saniye sonra tekrar deneyin.`,
      },
      { status: 429 },
    );
  }

  return requireAdminSession();
}

export async function getAdminSessionUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!(await verifySessionToken(token))) {
    return null;
  }

  return token ? getUsernameFromSessionToken(token) : null;
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

import { getSessionCookieName } from "@/lib/auth/config";
import { verifySessionToken } from "@/lib/auth/session";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isPublicApi(pathname: string, method: string): boolean {
  if (method !== "GET") return false;
  if (pathname === "/api/stores/search" || pathname.startsWith("/api/stores/search?")) {
    return true;
  }
  if (/^\/api\/coupons\/\d+\/open$/.test(pathname)) return true;
  if (/^\/api\/coupon-open\/\d+$/.test(pathname)) return true;
  return false;
}

function isProtectedApi(pathname: string, method: string): boolean {
  if (pathname.startsWith("/api/auth/")) return false;
  if (isPublicApi(pathname, method)) return false;

  return (
    pathname.startsWith("/api/stores") ||
    pathname.startsWith("/api/coupons") ||
    pathname.startsWith("/api/coupon-open") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/settings")
  );
}

function buildLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL("/admin/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (nextPath.startsWith("/admin") && nextPath !== "/admin/login") {
    loginUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(loginUrl);
}

function isProtectedAdminPage(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();
  const sessionToken = request.cookies.get(getSessionCookieName())?.value;
  const isAuthenticated = await verifySessionToken(sessionToken);

  if (isProtectedAdminPage(pathname) && !isAuthenticated) {
    return buildLoginRedirect(request);
  }

  if (isAuthenticated && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isProtectedApi(pathname, method) && !isAuthenticated) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  if (pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/stores/:path*",
    "/api/coupons/:path*",
    "/api/coupon-open/:path*",
    "/api/categories/:path*",
    "/api/admin/:path*",
    "/api/settings",
  ],
};

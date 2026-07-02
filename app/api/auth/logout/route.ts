import { getSessionCookieName } from "@/lib/auth/config";
import { isSameOriginRequest, requireAdminSession } from "@/lib/auth/guards";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  }

  const unauthorized = await requireAdminSession();

  if (unauthorized) {
    return unauthorized;
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}

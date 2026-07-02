import {
  getSessionCookieName,
  getSessionMaxAgeSeconds,
  isProduction,
} from "@/lib/auth/config";
import {
  clearFailedLogins,
  getLockoutRemainingSeconds,
  getRemainingAttempts,
  isLoginLocked,
  registerFailedLogin,
} from "@/lib/auth/rate-limit";
import {
  getClientIp,
  isSameOriginRequest,
  verifyAdminCredentials,
} from "@/lib/auth/guards";
import { createSessionToken } from "@/lib/auth/session";
import { NextResponse } from "next/server";

interface LoginBody {
  username?: string;
  password?: string;
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  }

  const ip = getClientIp(request);

  if (isLoginLocked(ip)) {
    return NextResponse.json(
      {
        error: `Çok fazla başarısız deneme. ${getLockoutRemainingSeconds(ip)} saniye sonra tekrar deneyin.`,
      },
      { status: 429 }
    );
  }

  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Kullanıcı adı ve şifre gereklidir." },
      { status: 400 }
    );
  }

  try {
    if (!verifyAdminCredentials(username, password)) {
      registerFailedLogin(ip);

      return NextResponse.json(
        {
          error: "Kullanıcı adı veya şifre hatalı.",
          remainingAttempts: getRemainingAttempts(ip),
        },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Kimlik doğrulama yapılandırması eksik." },
      { status: 500 }
    );
  }

  clearFailedLogins(ip);

  const token = await createSessionToken(username);
  const response = NextResponse.json({ success: true });

  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    maxAge: getSessionMaxAgeSeconds(),
  });

  return response;
}

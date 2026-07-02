import { getClientIp } from "@/lib/auth/guards";
import { getRepository } from "@/lib/db/repository";
import { checkRateLimit, SEARCH_RATE_LIMIT } from "@/lib/security/rate-limit";
import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = await checkRateLimit(
    `search:${ip}`,
    SEARCH_RATE_LIMIT.maxRequests,
    SEARCH_RATE_LIMIT.windowMs,
  );

  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Çok fazla arama isteği. ${limit.retryAfterSeconds} saniye sonra tekrar deneyin.` },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const results = await getRepository().searchStores(query);
  return NextResponse.json(results);
}

import { getRepository } from "@/lib/db/repository";
import { resolveCouponLink } from "@/lib/utils/coupon-links";
import { assertSafeHttpsUrl, redirectNoIndexHeaders } from "@/lib/utils/safe-url";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * /out/[id] — canonical affiliate link redirect.
 * Yeni sekmede açılır, ID'ye göre affiliate URL'e 302 ile yönlendirir.
 */
export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const couponId = Number(id);

  if (!Number.isFinite(couponId)) {
    return NextResponse.redirect(new URL("/", request.url), {
      headers: redirectNoIndexHeaders(),
    });
  }

  const result = await getRepository().getCouponWithStore(couponId);
  if (!result) {
    return NextResponse.redirect(new URL("/", request.url), {
      headers: redirectNoIndexHeaders(),
    });
  }

  const { coupon, store } = result;
  const affiliateUrl = resolveCouponLink(coupon, store);
  const safeTarget = assertSafeHttpsUrl(affiliateUrl);
  if (!safeTarget) {
    return NextResponse.redirect(new URL(`/${store.slug}`, request.url), {
      headers: redirectNoIndexHeaders(),
    });
  }

  return NextResponse.redirect(safeTarget, {
    status: 302,
    headers: redirectNoIndexHeaders(),
  });
}

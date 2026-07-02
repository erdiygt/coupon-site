import { getCouponOpenResponse } from "@/lib/api/coupon-open";

type RouteContext = { params: Promise<{ id: string }> };

/** @deprecated Prefer /api/coupon-open/[id] */
export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return getCouponOpenResponse(id);
}

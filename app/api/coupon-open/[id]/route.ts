import { getCouponOpenResponse } from "@/lib/api/coupon-open";

type RouteContext = { params: Promise<{ id: string }> };

/** Modal açmak için kupon + mağaza (public). */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return getCouponOpenResponse(id);
}

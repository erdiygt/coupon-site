import { writeAuditLog } from "@/lib/admin/audit-log";
import { requireAdminMutation, requireAdminSession } from "@/lib/auth/guards";
import { revalidatePublicData } from "@/lib/db/revalidate";
import { getRepository } from "@/lib/db/repository";
import { parseJsonBody } from "@/lib/validation/parse-body";
import { CouponInputSchema } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

async function revalidateCouponStore(couponId: number) {
  const result = await getRepository().getCouponWithStore(couponId);
  revalidatePublicData({ storeSlug: result?.store.slug });
}

export async function GET(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("store_id");
  const repo = getRepository();

  if (storeId) {
    const coupons = await repo.getCouponsByStoreId(Number(storeId));
    return NextResponse.json(coupons);
  }

  const coupons = await repo.getAllCoupons();
  return NextResponse.json(coupons);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, CouponInputSchema);
  if ("error" in parsed) return parsed.error;

  const coupon = await getRepository().createCoupon(parsed.data);
  await revalidateCouponStore(coupon.id);
  await writeAuditLog({
    request,
    action: "create",
    entity: "coupon",
    entityId: coupon.id,
    metadata: { store_id: coupon.store_id },
  });
  return NextResponse.json(coupon, { status: 201 });
}

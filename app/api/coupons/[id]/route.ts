import { writeAuditLog } from "@/lib/admin/audit-log";
import { requireAdminMutation, requireAdminSession } from "@/lib/auth/guards";
import { revalidatePublicData } from "@/lib/db/revalidate";
import { getRepository } from "@/lib/db/repository";
import { parseJsonBody } from "@/lib/validation/parse-body";
import { CouponUpdateSchema } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

async function revalidateCouponStore(couponId: number) {
  const result = await getRepository().getCouponWithStore(couponId);
  revalidatePublicData({ storeSlug: result?.store.slug });
}

export async function GET(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const coupon = await getRepository().getCouponById(Number(id));

  if (!coupon) {
    return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(coupon);
}

export async function PUT(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const couponId = Number(id);
  const parsed = await parseJsonBody(request, CouponUpdateSchema);
  if ("error" in parsed) return parsed.error;

  const coupon = await getRepository().updateCoupon(couponId, parsed.data);

  if (!coupon) {
    return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
  }

  await revalidateCouponStore(coupon.id);
  await writeAuditLog({
    request,
    action: "update",
    entity: "coupon",
    entityId: coupon.id,
    metadata: { store_id: coupon.store_id },
  });
  return NextResponse.json(coupon);
}

export async function DELETE(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const couponId = Number(id);
  const existing = await getRepository().getCouponWithStore(couponId);
  const deleted = await getRepository().deleteCoupon(couponId);

  if (!deleted) {
    return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
  }

  revalidatePublicData({ storeSlug: existing?.store.slug });
  await writeAuditLog({
    request,
    action: "delete",
    entity: "coupon",
    entityId: couponId,
    metadata: { store_id: existing?.coupon.store_id },
  });
  return NextResponse.json({ success: true });
}

import { getRepository } from "@/lib/db/repository";
import { toCouponModalCoupon, toCouponModalStore } from "@/lib/utils/coupon-modal";
import { NextResponse } from "next/server";

export async function getCouponOpenResponse(id: string) {
  const couponId = Number(id);

  if (!Number.isFinite(couponId)) {
    return NextResponse.json({ error: "Geçersiz kupon" }, { status: 400 });
  }

  const result = await getRepository().getCouponWithStore(couponId);
  if (!result) {
    return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
  }

  const { coupon, store } = result;

  return NextResponse.json({
    coupon: toCouponModalCoupon(coupon),
    store: toCouponModalStore(store),
  });
}
